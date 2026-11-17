// =========================================================
// CACTEA · services/asistente.js
// Toda la lógica de la IA vive aquí:
//   1. Lee los productos reales desde MongoDB.
//   2. Arma el system prompt + historial + mensaje nuevo.
//   3. Llama a Gemini (endpoint compatible con OpenAI).
// La ruta HTTP no sabe nada de Gemini: solo llama a responder().
// =========================================================
const mongoose = require('mongoose');
const { construirPromptSistema } = require('../prompts/asistente');

// Límites para no enviar prompts enormes a la IA.
const MAX_PRODUCTOS = 60;
const MAX_DESCRIPCION = 240;
const MAX_HISTORIAL = 6;
const MAX_TEXTO_HISTORIAL = 500;

const URL_POR_DEFECTO =
  'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions';
const MODELO_POR_DEFECTO = 'gemini-2.5-flash';

// Error propio para distinguir los fallos de la IA de otros errores.
class ErrorAsistente extends Error {
  constructor(mensaje, estado = 502) {
    super(mensaje);
    this.name = 'ErrorAsistente';
    this.estado = estado;
  }
}

// El modelo Producto no tiene campo de stock, así que usamos
// "disponible" o "stock" si algún día se agregan. Si no existen,
// devolvemos null: la planta está en catálogo, pero hay que
// confirmar existencias por WhatsApp.
function calcularDisponibilidad(producto) {
  if (typeof producto.disponible === 'boolean') return producto.disponible;
  if (typeof producto.stock === 'number') return producto.stock > 0;
  return null;
}

// Consulta el catálogo real en cada respuesta.
async function obtenerCatalogo() {
  const coleccion = mongoose.connection.collection('productos');

  const documentos = await coleccion
    .find(
      {},
      {
        projection: {
          nombre: 1,
          categoria: 1,
          descripcion: 1,
          precio: 1,
          disponible: 1,
          stock: 1,
        },
      }
    )
    .sort({ _id: 1 })
    .limit(MAX_PRODUCTOS)
    .toArray();

  return documentos.map((producto) => ({
    nombre: String(producto.nombre || '').trim(),
    categoria: String(producto.categoria || '').trim(),
    descripcion: String(producto.descripcion || '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, MAX_DESCRIPCION),
    precio: Number(producto.precio) || 0,
    disponible: calcularDisponibilidad(producto),
  }));
}

// Solo aceptamos turnos "user" y "assistant", con texto corto.
// Así el cliente no puede inyectar roles del sistema ni prompts gigantes.
function normalizarHistorial(historial) {
  if (!Array.isArray(historial)) return [];

  return historial
    .slice(-MAX_HISTORIAL)
    .filter(
      (turno) =>
        turno &&
        (turno.rol === 'user' || turno.rol === 'assistant') &&
        typeof turno.texto === 'string'
    )
    .map((turno) => ({
      role: turno.rol,
      content: turno.texto.trim().slice(0, MAX_TEXTO_HISTORIAL),
    }))
    .filter((turno) => turno.content.length > 0);
}

// Llamada HTTP a Gemini. Usamos fetch nativo (Node 20+) para no
// instalar un SDK extra. El endpoint es compatible con OpenAI.
async function llamarIA(mensajes) {
  const apiKey = process.env.IA_API_KEY && process.env.IA_API_KEY.trim();
  if (!apiKey) {
    throw new ErrorAsistente('Falta IA_API_KEY en backend/.env', 503);
  }

  const url = (process.env.IA_API_URL && process.env.IA_API_URL.trim()) || URL_POR_DEFECTO;
  const modelo = (process.env.IA_MODELO && process.env.IA_MODELO.trim()) || MODELO_POR_DEFECTO;

  let respuesta;
  try {
    respuesta = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: modelo,
        messages: mensajes,
        temperature: 0.5,
        max_tokens: 500,
      }),
      // Si Gemini tarda más de 25 segundos, cortamos la espera.
      signal: AbortSignal.timeout(25000),
    });
  } catch (err) {
    // Registramos el error completo (stack incluido) para poder diagnosticar
    // timeouts y fallos de red, no solo el mensaje resumido.
    console.error(`ERROR de conexión con la IA · modelo=${modelo} · url=${url}:`);
    console.error(err.stack || err);
    const motivo =
      err.name === 'TimeoutError'
        ? 'La IA tardó demasiado en responder'
        : 'No se pudo conectar con la IA';
    throw new ErrorAsistente(`${motivo}: ${err.message}`);
  }

  // Leemos el cuerpo como texto para poder imprimir la respuesta cruda
  // tal cual la devuelve Gemini, incluso si no es JSON válido.
  const textoCrudo = await respuesta.text().catch(() => '');

  if (!respuesta.ok) {
    console.error(
      `ERROR de la IA · status=${respuesta.status} ${respuesta.statusText} · modelo=${modelo} · url=${url}\n` +
        `Respuesta cruda de Gemini:\n${textoCrudo || '(sin cuerpo)'}`
    );
    throw new ErrorAsistente(
      `La IA respondió ${respuesta.status}: ${textoCrudo.slice(0, 300) || '(sin cuerpo)'}`
    );
  }

  let datos = null;
  try {
    datos = JSON.parse(textoCrudo);
  } catch {
    console.error(
      `La IA devolvió una respuesta que no es JSON · modelo=${modelo}\n` +
        `Respuesta cruda de Gemini:\n${textoCrudo || '(sin cuerpo)'}`
    );
    throw new ErrorAsistente('La IA devolvió una respuesta no válida.');
  }

  const eleccion =
    datos && Array.isArray(datos.choices) ? datos.choices[0] : null;
  const texto =
    eleccion && eleccion.message ? eleccion.message.content : '';

  if (typeof texto !== 'string' || !texto.trim()) {
    console.error(
      `La IA devolvió texto vacío · modelo=${modelo} · ` +
        `finish_reason=${eleccion ? eleccion.finish_reason : '(sin choices)'}\n` +
        `Respuesta cruda de Gemini:\n${textoCrudo || '(sin cuerpo)'}`
    );
    throw new ErrorAsistente('La IA devolvió una respuesta vacía.');
  }

  return texto.trim().slice(0, 2000);
}

async function responder({ mensaje, historial }) {
  const productos = await obtenerCatalogo();

  const mensajes = [
    { role: 'system', content: construirPromptSistema(productos) },
    ...normalizarHistorial(historial),
    { role: 'user', content: mensaje },
  ];

  return llamarIA(mensajes);
}

module.exports = { responder, obtenerCatalogo, normalizarHistorial, ErrorAsistente };

// =========================================================
// CACTEA · app.js  (MANIPULACIÓN DEL DOM)
// 1) Productos, filtros y pedido
// 2) Cactus con personalidad
// =========================================================

// ---------- 1) PRODUCTOS, FILTROS Y PEDIDO ----------
const listaProductos  = document.querySelector('#lista-productos');
const listaDestacados = document.querySelector('#lista-destacados');
const plantilla       = document.querySelector('#plantilla-tarjeta');
const listaPedido     = document.querySelector('#lista-pedido');
const totalPedido     = document.querySelector('#total-pedido');
const botonEnviar     = document.querySelector('#enviar-pedido');

let productos = [];   // lo que llega de la API
let pedido = [];      // [{ id, nombre, precio, cantidad }]

const dinero = (n) => `$${Number(n).toFixed(2)}`;

// Tarjeta grande: copia la <template> y llena los datos
function crearTarjeta(producto) {
  const tarjeta = plantilla.content.cloneNode(true);
  const img = tarjeta.querySelector('.tarjeta__imagen');
  img.src = producto.imagen;
  img.alt = producto.nombre;
  tarjeta.querySelector('.tarjeta__nombre').textContent = producto.nombre;
  tarjeta.querySelector('.tarjeta__descripcion').textContent = producto.descripcion;
  tarjeta.querySelector('.tarjeta__precio').textContent = dinero(producto.precio);
  tarjeta.querySelector('.tarjeta__pedir').addEventListener('click', () => agregarAlPedido(producto));
  return tarjeta;
}

// Tarjeta pequeña de "favoritos": se crea elemento por elemento
function crearTarjetaMini(producto) {
  const tarjeta = document.createElement('article');
  tarjeta.className = 'tarjeta tarjeta--mini';

  const img = document.createElement('img');
  img.className = 'tarjeta__imagen';
  img.src = producto.imagen;
  img.alt = producto.nombre;

  const nombre = document.createElement('h3');
  nombre.className = 'tarjeta__nombre';
  nombre.textContent = producto.nombre;

  const precio = document.createElement('p');
  precio.className = 'tarjeta__precio';
  precio.textContent = dinero(producto.precio);

  const enlace = document.createElement('a');
  enlace.className = 'tarjeta__enlace';
  enlace.href = '#productos';
  enlace.textContent = 'Ver más →';

  tarjeta.append(img, nombre, precio, enlace);
  return tarjeta;
}

function pintarDestacados() {
  listaDestacados.replaceChildren(
    ...productos.filter((p) => p.destacado).slice(0, 3).map(crearTarjetaMini)
  );
}

function pintarProductos(categoria) {
  const visibles = categoria === 'todos'
    ? productos
    : productos.filter((p) => p.categoria === categoria);
  listaProductos.replaceChildren(...visibles.map(crearTarjeta));
}

// ----- Pedido (como la to-do list: agregar y quitar elementos) -----
function agregarAlPedido(producto) {
  const existente = pedido.find((item) => item.id === producto._id);
  if (existente) {
    existente.cantidad++;
  } else {
    pedido.push({ id: producto._id, nombre: producto.nombre, precio: producto.precio, cantidad: 1 });
  }
  pintarPedido();
}

function quitarDelPedido(id) {
  pedido = pedido.filter((item) => item.id !== id);
  pintarPedido();
}

function pintarPedido() {
  listaPedido.replaceChildren();

  if (pedido.length === 0) {
    const vacio = document.createElement('li');
    vacio.className = 'pedido__vacio';
    vacio.textContent = 'Aún no has agregado nada 🌱';
    listaPedido.append(vacio);
  }

  pedido.forEach((item) => {
    const fila = document.createElement('li');
    const texto = document.createElement('span');
    texto.textContent = `${item.cantidad} × ${item.nombre} — ${dinero(item.precio * item.cantidad)}`;

    const quitar = document.createElement('button');
    quitar.type = 'button';
    quitar.className = 'pedido__quitar';
    quitar.textContent = '✕';
    quitar.setAttribute('aria-label', `Quitar ${item.nombre}`);
    quitar.addEventListener('click', () => quitarDelPedido(item.id));

    fila.append(texto, quitar);
    listaPedido.append(fila);
  });

  const total = pedido.reduce((suma, item) => suma + item.precio * item.cantidad, 0);
  totalPedido.textContent = dinero(total);

  // Mensaje de WhatsApp con el resumen del pedido
  const lineas = pedido.map((i) => `• ${i.cantidad} × ${i.nombre} (${dinero(i.precio * i.cantidad)})`);
  const mensaje = `Hola Cactea, quiero hacer este pedido:\n${lineas.join('\n')}\nTotal: ${dinero(total)}`;
  botonEnviar.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
  botonEnviar.setAttribute('aria-disabled', pedido.length === 0 ? 'true' : 'false');
}

// ----- Filtros -----
document.querySelector('#filtros').addEventListener('click', (evento) => {
  const boton = evento.target.closest('.filtro');
  if (!boton) return;
  document.querySelectorAll('.filtro').forEach((b) => b.setAttribute('aria-pressed', String(b === boton)));
  pintarProductos(boton.dataset.categoria);
});

// ----- Arranque: pedir productos a la API y dibujarlos -----
async function iniciar() {
  pintarPedido();
  try {
    productos = await obtenerProductos();      // viene de api.js
    pintarDestacados();
    pintarProductos('todos');
  } catch (error) {
    console.error(error);
    const aviso = document.createElement('p');
    aviso.className = 'productos__estado';
    aviso.textContent = 'No pudimos cargar los productos. ¿Está encendido el servidor?';
    listaProductos.replaceChildren(aviso);
    listaDestacados.replaceChildren();
  }
}
iniciar();


// ---------- 2) CACTUS CON PERSONALIDAD ----------
const contenedor = document.querySelector('.planta-fija');

if (contenedor) {
  const planta = contenedor.querySelector('.planta-scroll');
  const piezas = contenedor.querySelectorAll('[data-inicio]'); // tronco, brazos y flor

  const limitar = (n) => Math.min(1, Math.max(0, n));

  // ----- Añade una clase un ratito (para saltos y celebraciones) -----
  function activarUnRato(clase, milisegundos) {
    contenedor.classList.remove(clase);
    void contenedor.offsetWidth;   // reinicia la animación si ya estaba puesta
    contenedor.classList.add(clase);
    setTimeout(() => contenedor.classList.remove(clase), milisegundos);
  }

  // ----- Dibujo: tronco, brazos y flor según el progreso -----
  function dibujar(progreso) {
    piezas.forEach((pieza) => {
      const inicio   = parseFloat(pieza.dataset.inicio);
      const duracion = parseFloat(pieza.dataset.duracion || 0.12);   // cuánto tarda en crecer
      let tamano = limitar((progreso - inicio) / duracion);
      if (pieza.dataset.min) tamano = Math.max(parseFloat(pieza.dataset.min), tamano); // brotecito inicial

      if (pieza.dataset.eje === 'y') {
        pieza.setAttribute('transform', `scale(1 ${tamano})`);        // crece solo hacia arriba
      } else {
        // La flor además gira mientras se abre
        const giro = pieza.dataset.giro ? `rotate(${(1 - tamano) * -120}) ` : '';
        pieza.setAttribute('transform', `${giro}scale(${tamano})`);
      }
    });
  }

  // ----- Estado que recuerda la plantita -----
  let celebrado = false;
  let temporizadorScroll;

  function actualizar() {
    const recorrido = document.documentElement.scrollHeight - window.innerHeight;
    const progreso = limitar(recorrido > 0 ? window.scrollY / recorrido : 1);
    dibujar(progreso);

    // Al llegar al final: salta y sonríe grande (una sola vez por llegada)
    if (progreso >= 0.98 && !celebrado) {
      celebrado = true;
      activarUnRato('celebrando', 2500);
      activarUnRato('saltando', 600);
    } else if (progreso < 0.9) {
      celebrado = false;
    }
  }

  // ----- Clic sobre la plantita -----
  planta.addEventListener('click', () => {
    activarUnRato('saltando', 600);
  });

  // ----- Scroll -----
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    dibujar(1);   // sin animaciones: la mostramos ya crecida
  } else {
    let esperando = false;
    window.addEventListener('scroll', () => {
      // Se agita mientras haces scroll y se calma al parar
      contenedor.classList.add('activa');
      clearTimeout(temporizadorScroll);
      temporizadorScroll = setTimeout(() => contenedor.classList.remove('activa'), 200);

      if (!esperando) {
        esperando = true;
        requestAnimationFrame(() => {
          actualizar();
          esperando = false;
        });
      }
    }, { passive: true });

    window.addEventListener('resize', actualizar);
    actualizar();   // estado inicial al cargar
  }
}
// =========================================================
// CACTEA · routes/asistente.js
// Ruta pública del chat. Se monta en /api/asistente
// Valida la entrada, limita los intentos por IP y delega
// la conversación al servicio de IA.
// =========================================================
const express = require('express');
const rateLimit = require('express-rate-limit');
const { responder } = require('../services/asistente');

const router = express.Router();

const MAX_MENSAJE = 500;

// Máximo 10 mensajes por minuto por IP.
// Al superarlo, el cliente recibe un JSON amable en vez de la IA.
const limitador = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Enviaste muchos mensajes seguidos. Espera un minuto y vuelve a intentarlo.',
  },
});

// POST /api/asistente
// Body: { mensaje: string, historial?: [{ rol, texto }] }
router.post('/', limitador, async (req, res) => {
  const mensaje =
    typeof req.body?.mensaje === 'string' ? req.body.mensaje.trim() : '';

  if (!mensaje) {
    return res.status(400).json({ error: 'Escribe una pregunta para poder ayudarte.' });
  }

  if (mensaje.length > MAX_MENSAJE) {
    return res.status(400).json({
      error: `Tu mensaje es muy largo. Usa máximo ${MAX_MENSAJE} caracteres.`,
    });
  }

  const historial = Array.isArray(req.body?.historial) ? req.body.historial : [];

  try {
    const respuesta = await responder({ mensaje, historial });
    res.json({ respuesta });
  } catch (err) {
    // El detalle técnico (con stack y respuesta cruda) queda en la consola
    // del servidor. Al cliente le damos un mensaje amable y accionable.
    console.error('ERROR POST /api/asistente:', err.stack || err.message);
    res.status(err.estado || 502).json({
      error:
        'El asistente no pudo responder en este momento. Intenta de nuevo o escríbenos por WhatsApp.',
    });
  }
});

module.exports = router;

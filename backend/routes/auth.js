// =========================================================
// CACTEA · routes/auth.js
// Ruta de login: POST /api/login
// Compara usuario y contraseña con los datos guardados en .env
// y, si coinciden, entrega un token (la "pulsera" de admin).
// =========================================================
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { usuario, clave } = req.body;

    if (!usuario || !clave) {
      return res.status(400).json({ error: 'Escribe usuario y contraseña.' });
    }

    // Se comparan las dos cosas siempre, para no dar pistas de cuál falló
    const usuarioOk = usuario === process.env.ADMIN_USER;
    const claveOk = await bcrypt.compare(clave, process.env.ADMIN_PASS_HASH || '');

    if (!usuarioOk || !claveOk) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });
    }

    // Token firmado con la llave secreta; vence solo a las 4 horas
    const token = jwt.sign({ usuario }, process.env.JWT_SECRET, { expiresIn: '4h' });
    res.json({ token });
  } catch (err) {
    console.error('ERROR POST /api/login:', err.message);
    res.status(500).json({ error: 'No se pudo iniciar sesión.' });
  }
});

module.exports = router;
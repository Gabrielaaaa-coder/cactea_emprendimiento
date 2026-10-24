// =========================================================
// CACTEA · middleware/auth.js
// El "guardia": se pone antes de las rutas protegidas.
// Revisa que el pedido traiga un token válido de admin.
// Uso:  app.post('/api/productos', requiereAdmin, (req, res) => { ... })
// =========================================================
const jwt = require('jsonwebtoken');

function requiereAdmin(req, res, next) {
  // El token llega en el encabezado:  Authorization: Bearer <token>
  const cabecera = req.headers.authorization || '';
  const [tipo, token] = cabecera.split(' ');

  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'No autorizado: falta iniciar sesión.' });
  }

  try {
    // Si la firma es falsa o el token ya venció, verify lanza un error
    req.admin = jwt.verify(token, process.env.JWT_SECRET);
    next(); // todo bien: deja pasar a la ruta
  } catch (err) {
    res.status(401).json({ error: 'Sesión inválida o vencida. Inicia sesión otra vez.' });
  }
}

module.exports = requiereAdmin;
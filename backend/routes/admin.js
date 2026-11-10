// =========================================================
// CACTEA · routes/admin.js
// Rutas del panel de administrador (todas protegidas).
// Se montan en /api/admin
// =========================================================
const express = require('express');
const mongoose = require('mongoose');
const requiereAdmin = require('../middleware/auth');
const Producto = require('../models/Producto.js');
const Mensaje = require('../models/Mensaje.js');

const router = express.Router();

// El guardia vigila TODAS las rutas de este archivo
router.use(requiereAdmin);

// Evita errores raros si el id viene mal escrito
function idValido(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'ID no válido.' });
  }
  next();
}

// ---------- MENSAJES ----------

// Ver todos los mensajes (los más nuevos primero)
router.get('/mensajes', async (req, res) => {
  try {
    const mensajes = await Mensaje.find().sort({ createdAt: -1 });
    res.json(mensajes);
  } catch (err) {
    console.error('ERROR GET /api/admin/mensajes:', err.message);
    res.status(500).json({ error: 'No se pudieron cargar los mensajes.' });
  }
});

// Marcar un mensaje como leído / no leído
router.patch('/mensajes/:id', idValido, async (req, res) => {
  try {
    const mensaje = await Mensaje.findByIdAndUpdate(
      req.params.id,
      { leido: Boolean(req.body.leido) },
      { new: true }
    );
    if (!mensaje) return res.status(404).json({ error: 'Mensaje no encontrado.' });
    res.json(mensaje);
  } catch (err) {
    console.error('ERROR PATCH /api/admin/mensajes:', err.message);
    res.status(500).json({ error: 'No se pudo actualizar el mensaje.' });
  }
});

// Borrar un mensaje
router.delete('/mensajes/:id', idValido, async (req, res) => {
  try {
    const mensaje = await Mensaje.findByIdAndDelete(req.params.id);
    if (!mensaje) return res.status(404).json({ error: 'Mensaje no encontrado.' });
    res.json({ ok: true });
  } catch (err) {
    console.error('ERROR DELETE /api/admin/mensajes:', err.message);
    res.status(500).json({ error: 'No se pudo borrar el mensaje.' });
  }
});

// ---------- PRODUCTOS ----------

// Crear producto
router.post('/productos', async (req, res) => {
  try {
    const { nombre, categoria, descripcion, precio, imagen, destacado } = req.body;
    const producto = await Producto.create({
      nombre, categoria, descripcion, precio, imagen, destacado,
    });
    res.status(201).json(producto);
  } catch (err) {
    console.error('ERROR POST /api/admin/productos:', err.message);
    res.status(400).json({ error: 'Revisa los datos: el nombre y el precio son obligatorios.' });
  }
});

// Editar producto
router.put('/productos/:id', idValido, async (req, res) => {
  try {
    const { nombre, categoria, descripcion, precio, imagen, destacado } = req.body;
    const producto = await Producto.findByIdAndUpdate(
      req.params.id,
      { nombre, categoria, descripcion, precio, imagen, destacado },
      { new: true, runValidators: true }
    );
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado.' });
    res.json(producto);
  } catch (err) {
    console.error('ERROR PUT /api/admin/productos:', err.message);
    res.status(400).json({ error: 'Revisa los datos del producto.' });
  }
});

// Borrar producto
router.delete('/productos/:id', idValido, async (req, res) => {
  try {
    const producto = await Producto.findByIdAndDelete(req.params.id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado.' });
    res.json({ ok: true });
  } catch (err) {
    console.error('ERROR DELETE /api/admin/productos:', err.message);
    res.status(500).json({ error: 'No se pudo borrar el producto.' });
  }
});

module.exports = router;
// =========================================================
// CACTEA · app.js  (API CON EXPRESS + MONGODB)
// =========================================================//
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Modelos
const Mensaje = require('./models/Mensaje');

// Panel de administrador
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const requiereAdmin = require('./middleware/auth');

const app = express();
const PUERTO = process.env.PORT || 3000;

// ---------- MIDDLEWARES ----------
app.use(cors());
app.use(express.json());
app.use('/api', authRoutes);            // POST /api/login
app.use('/api/admin', adminRoutes);     // rutas protegidas del panel

mongoose.set('bufferCommands', false);
mongoose.set('strictQuery', false);

// ---------- PRODUCTOS (públicas) ----------

// GET /api/productos  -> lista completa (acepta ?categoria=cactus)
app.get('/api/productos', async (req, res) => {
  try {
    const filtro = {};
    if (req.query.categoria) {
      filtro.categoria = req.query.categoria;
    }
    const coll = mongoose.connection.collection('productos');
    const productos = await coll.find(filtro).sort({ _id: 1 }).toArray();
    res.json(productos);
  } catch (err) {
    console.error('ERROR GET /api/productos:', err);
    res.status(500).json({ error: 'Error al obtener productos', detalle: err.message });
  }
});

// GET /api/productos/:id  -> un producto
app.get('/api/productos/:id', async (req, res) => {
  try {
    const { ObjectId } = mongoose.Types;
    const coll = mongoose.connection.collection('productos');
    const producto = await coll.findOne({ _id: new ObjectId(req.params.id) });
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(producto);
  } catch (err) {
    console.error('ERROR GET /api/productos/:id:', err.message);
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

// POST /api/productos  -> agrega un producto nuevo (solo admin)
app.post('/api/productos', requiereAdmin, async (req, res) => {
  try {
    const { nombre, categoria, descripcion, precio, imagen, destacado } = req.body;
    if (!nombre || typeof precio !== 'number') {
      return res.status(400).json({ error: 'Faltan datos: nombre y precio (número)' });
    }
    const coll = mongoose.connection.collection('productos');
    const nuevo = {
      nombre,
      categoria: categoria || 'suculentas',
      descripcion: descripcion || '',
      precio,
      imagen: imagen || 'img/producto-1.jpg',
      destacado: destacado || false,
      __v: 0,
    };
    const result = await coll.insertOne(nuevo);
    nuevo._id = result.insertedId;
    res.status(201).json(nuevo);
  } catch (err) {
    console.error('ERROR POST /api/productos:', err);
    res.status(400).json({ error: 'Error al crear producto', detalle: err.message });
  }
});

// ---------- FORMULARIO DE CONTACTO (público) ----------

// POST /api/mensajes
app.post('/api/mensajes', async (req, res) => {
  try {
    const { nombre, correo, telefono, asunto, mensaje } = req.body;

    if (!nombre || !correo || !asunto || !mensaje) {
      return res.status(400).json({ error: 'Completa nombre, correo, asunto y mensaje.' });
    }

    const nuevo = await Mensaje.create({ nombre, correo, telefono, asunto, mensaje });
    res.status(201).json({ ok: true, id: nuevo._id });
  } catch (err) {
    console.error('ERROR POST /api/mensajes:', err.message);
    const codigo = err.name === 'ValidationError' ? 400 : 500;
    res.status(codigo).json({ error: 'No se pudo guardar el mensaje.' });
  }
});

// ---------- FRONTEND (REACT) ----------
// En producción se sirve la carpeta que genera "npm run build" dentro de frontend.
const carpetaFrontend = path.join(__dirname, '..', 'frontend', 'dist');

// Cualquier /api/... que no exista responde JSON, no HTML.
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada.' });
});

// Archivos estáticos: index.html, assets, img y fonts.
app.use(express.static(carpetaFrontend));

// Las rutas de React Router (/admin/mensajes, etc.) también devuelven index.html.
app.get('*', (req, res, next) => {
  // Si la dirección parece un archivo (tiene extensión), dejamos que siga
  // y responda el 404 normal, en vez de devolver HTML.
  if (path.extname(req.path)) return next();
  res.sendFile(path.join(carpetaFrontend, 'index.html'));
});

// ---------- ARRANQUE ----------
async function start() {
  console.log('Conectando a MongoDB...');
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log('Conectado a MongoDB Atlas');
    app.listen(PUERTO, () => {
      console.log(`API de Cactea lista en http://localhost:${PUERTO}`);
    });
  } catch (err) {
    console.error('Error conectando a MongoDB:', err.message);
    process.exit(1);
  }
}

start();
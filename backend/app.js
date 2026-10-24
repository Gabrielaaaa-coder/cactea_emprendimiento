// =========================================================
// CACTEA · app.js  (API CON EXPRESS + MONGODB)
// Instala una vez:  npm install     Ejecuta:  npm start
// =========================================================
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Producto = require('./models/Producto');

const app = express();
const PUERTO = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

mongoose.set('bufferCommands', false);
mongoose.set('strictQuery', false);

async function start() {
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
    const { ObjectId } = require('mongoose').Types;
    const coll = mongoose.connection.collection('productos');
    const producto = await coll.findOne({ _id: new ObjectId(req.params.id) });
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(producto);
  } catch (err) {
    console.error('ERROR GET /api/productos/:id:', err.message);
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

// POST /api/productos  -> agrega un producto nuevo
app.post('/api/productos', async (req, res) => {
  try {
    const { nombre, categoria, descripcion, precio, imagen, destacado } = req.body;
    if (!nombre || typeof precio !== 'number') {
      return res.status(400).json({ error: 'Faltan datos: nombre y precio (número)' });
    }
    const coll = mongoose.connection.collection('productos');
    const count = await coll.countDocuments();
    const nuevo = {
      nombre,
      categoria: categoria || 'suculentas',
      descripcion: descripcion || '',
      precio,
      imagen: imagen || 'img/producto-1.jpg',
      destacado: destacado || false,
      __v: 0,
    };
    // keep numeric id compatibility? frontend doesn't use _id, but just in case
    const result = await coll.insertOne(nuevo);
    nuevo._id = result.insertedId;
    res.status(201).json(nuevo);
  } catch (err) {
    console.error('ERROR POST /api/productos:', err);
    res.status(400).json({ error: 'Error al crear producto', detalle: err.message });
  }
});
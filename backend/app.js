// =========================================================
// CACTEA · app.js  (API CON EXPRESS)
// Instala una vez:  npm install     Ejecuta:  npm start
// Abre http://localhost:3000 y verás la página completa.
// =========================================================
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PUERTO = process.env.PORT || 3000;
const ARCHIVO = path.join(__dirname, '..', 'data', 'productos.json');

app.use(cors());           // permite pedir datos desde otro puerto (Live Server)
app.use(express.json());   // entiende el JSON que llega en los POST
app.use(express.static(path.join(__dirname, '..', '01-frontend')));   // sirve tu página

const leerProductos = () => JSON.parse(fs.readFileSync(ARCHIVO, 'utf-8'));
const guardarProductos = (lista) => fs.writeFileSync(ARCHIVO, JSON.stringify(lista, null, 2));

// GET /api/productos  -> lista completa (acepta ?categoria=cactus)
app.get('/api/productos', (req, res) => {
  let productos = leerProductos();
  if (req.query.categoria) {
    productos = productos.filter((p) => p.categoria === req.query.categoria);
  }
  res.json(productos);
});

// GET /api/productos/2  -> un producto
app.get('/api/productos/:id', (req, res) => {
  const producto = leerProductos().find((p) => p.id === Number(req.params.id));
  if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(producto);
});

// POST /api/productos  -> agrega un producto nuevo
app.post('/api/productos', (req, res) => {
  const { nombre, categoria, descripcion, precio, imagen } = req.body;
  if (!nombre || typeof precio !== 'number') {
    return res.status(400).json({ error: 'Faltan datos: nombre y precio (número)' });
  }
  const productos = leerProductos();
  const nuevo = {
    id: Math.max(0, ...productos.map((p) => p.id)) + 1,
    nombre, categoria: categoria || 'suculentas', descripcion: descripcion || '',
    precio, imagen: imagen || 'img/producto-1.jpg', destacado: false,
  };
  productos.push(nuevo);
  guardarProductos(productos);
  res.status(201).json(nuevo);
});

app.listen(PUERTO, () => {
  console.log(`API de Cactea lista en http://localhost:${PUERTO}`);
});
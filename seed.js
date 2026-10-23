require('dotenv').config({ path: './backend/.env' });
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Producto = require('./models/Producto');

const productos = JSON.parse(fs.readFileSync(path.join(__dirname, 'productos.json'), 'utf-8'));

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a MongoDB');
    await Producto.deleteMany({});
    await Producto.insertMany(productos);
    console.log(`Importados ${productos.length} productos`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error al hacer seed:', err.message);
    process.exit(1);
  }
}

seed();

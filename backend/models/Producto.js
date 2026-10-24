// =========================
// productozzzzz
//===============================
const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    categoria: { type: String, enum: ['suculentas', 'cactus', 'regalos'], default: 'suculentas' },
    descripcion: { type: String, default: '' },
    precio: { type: Number, required: true },
    imagen: { type: String, default: 'img/producto-1.jpg' },
    destacado: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Producto', productoSchema);

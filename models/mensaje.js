const mongoose = require('mongoose');

// Cómo es un mensaje que llega desde el formulario de contacto
const mensajeSchema = new mongoose.Schema(
  {
    nombre:  { type: String, required: true, trim: true, maxlength: 80 },
    correo:  { type: String, required: true, trim: true, lowercase: true, maxlength: 120 },
    mensaje: { type: String, required: true, trim: true, maxlength: 1000 },
    leido:   { type: Boolean, default: false }, // para marcarlo desde el panel de admin
  },
  { timestamps: true } // Mongoose agrega solo createdAt (fecha de envío) y updatedAt
);

module.exports = mongoose.model('Mensaje', mensajeSchema);
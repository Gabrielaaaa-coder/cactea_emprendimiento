// =========================================================
// CACTEA · config/db.js
// Conexión con MongoDB Atlas.
// Las credenciales se leen de variables de entorno (MONGODB_URI o MONGO_URI).
// =========================================================
const mongoose = require('mongoose');

// Sin búfer: si la base no está conectada, las consultas fallan rápido
// en vez de quedarse esperando.
mongoose.set('bufferCommands', false);
mongoose.set('strictQuery', false);

async function conectarDB() {
  // MONGODB_URI es el nombre principal; MONGO_URI se acepta como alias para
  // hosting que usa esa convención. La clave nunca vive en el código.
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!uri) {
    throw new Error('Falta la cadena de conexión: define MONGODB_URI (o MONGO_URI).');
  }

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  });
}

module.exports = conectarDB;

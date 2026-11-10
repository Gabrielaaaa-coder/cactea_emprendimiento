// =========================================================
// CACTEA · config/db.js
// Conexión con MongoDB Atlas.
// Las credenciales se leen de backend/.env (MONGODB_URI).
// =========================================================
const mongoose = require('mongoose');

// Sin búfer: si la base no está conectada, las consultas fallan rápido
// en vez de quedarse esperando.
mongoose.set('bufferCommands', false);
mongoose.set('strictQuery', false);

async function conectarDB() {
  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  });
}

module.exports = conectarDB;

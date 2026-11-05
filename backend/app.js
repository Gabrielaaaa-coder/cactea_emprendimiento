// =========================================================
// CACTEA · app.js  (API CON EXPRESS + MONGODB)
// T-T
// =========================================================

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Modelos
const Producto = require('./models/Producto');
const Mensaje = require('./models/mensaje');

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
app.use(express.static(path.join(__dirname, '..', 'public')));

mongoose.set('bufferCommands', false);
mongoose.set('strictQuery')
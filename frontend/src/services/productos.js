import { pedir } from './api.js'

// Trae todos los productos guardados en MongoDB.
export const obtenerProductos = () => pedir('/productos')

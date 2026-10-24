// =========================================================
// CACTEA · api.js  (CONSUMO DE API)
// Aquí vive todo lo que habla con el servidor.
// =========================================================

// Dirección de tu servidor (Node o Express, ambos usan el puerto 3000)
const API_URL = '/api';
const WHATSAPP = '593993122218';
// Pide la lista de productos al servidor y la devuelve como arreglo de objetos
async function obtenerProductos() {
  const respuesta = await fetch(`${API_URL}/productos`);
  if (!respuesta.ok) {
    throw new Error(`El servidor respondió con error ${respuesta.status}`);
  }
  return respuesta.json();
}
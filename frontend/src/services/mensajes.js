import { pedir } from './api.js'

// Guarda el mensaje del formulario de contacto en MongoDB.
export const enviarMensaje = (datos) =>
  pedir('/mensajes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  })

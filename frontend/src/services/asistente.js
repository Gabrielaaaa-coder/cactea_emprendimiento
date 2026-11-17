import { pedir } from './api.js'

// Envía una pregunta al backend junto con los últimos turnos
// de la conversación. El backend es el único que conoce la API key.
export function preguntarAsistente(mensaje, historial) {
  return pedir('/asistente', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mensaje, historial }),
  })
}

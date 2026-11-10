import { pedir } from './api.js'
import { guardarToken } from '../admin/sesion.js'

// Envía usuario y contraseña y guarda el token que devuelve el servidor.
export async function iniciarSesion(usuario, clave) {
  const { token } = await pedir('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario, clave }),
  })

  guardarToken(token)
  return token
}

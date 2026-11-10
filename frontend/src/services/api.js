import { API_URL } from '../constants.js'

// Cliente común para hablar con el servidor.
// Arma la URL, revisa la respuesta y devuelve los datos ya convertidos.
export async function pedir(ruta, opciones = {}) {
  const respuesta = await fetch(`${API_URL}${ruta}`, opciones)

  if (!respuesta.ok) {
    // El servidor puede mandar un mensaje de error; si no, usamos uno general.
    const datos = await respuesta.json().catch(() => ({}))
    throw new Error(datos.error || `El servidor respondió con error ${respuesta.status}`)
  }

  return respuesta.json()
}

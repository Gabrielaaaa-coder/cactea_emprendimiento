import { API_URL } from '../constants.js'
import { borrarToken, obtenerToken } from '../admin/sesion.js'

// Aviso global para que la aplicación se entere cuando la sesión vence.
export const EVENTO_SESION_EXPIRADA = 'cactea:sesion-expirada'

// Pide datos a las rutas protegidas mandando el token en el encabezado.
export async function pedirAdmin(ruta, opciones = {}) {
  const token = obtenerToken()

  const respuesta = await fetch(`${API_URL}${ruta}`, {
    ...opciones,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...opciones.headers,
    },
  })

  const datos = await respuesta.json().catch(() => ({}))

  if (!respuesta.ok) {
    // Si el token venció, lo borramos y avisamos para volver al login.
    if (respuesta.status === 401) {
      borrarToken()
      window.dispatchEvent(new Event(EVENTO_SESION_EXPIRADA))
    }

    const error = new Error(datos.error || 'Algo salió mal.')
    error.status = respuesta.status
    throw error
  }

  return datos
}

import { useCallback, useEffect, useState } from 'react'
import { pedirAdmin } from '../services/admin.js'

// Carga los mensajes del formulario y permite marcarlos o borrarlos.
export function useMensajesAdmin() {
  const [mensajes, setMensajes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const cargar = useCallback(async () => {
    try {
      const datos = await pedirAdmin('/admin/mensajes')
      setMensajes(datos)
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    cargar()
  }, [cargar])

  const alternarLeido = async (mensaje) => {
    await pedirAdmin(`/admin/mensajes/${mensaje._id}`, {
      method: 'PATCH',
      body: JSON.stringify({ leido: !mensaje.leido }),
    })
    await cargar()
  }

  const borrar = async (id) => {
    await pedirAdmin(`/admin/mensajes/${id}`, { method: 'DELETE' })
    await cargar()
  }

  return { mensajes, cargando, error, alternarLeido, borrar }
}

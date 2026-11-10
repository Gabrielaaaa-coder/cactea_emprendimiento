import { useCallback, useEffect, useState } from 'react'
import { obtenerProductos } from '../services/productos.js'
import { pedirAdmin } from '../services/admin.js'

// Carga los productos y ofrece las acciones del panel.
export function useProductosAdmin() {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const cargar = useCallback(async () => {
    try {
      const datos = await obtenerProductos()
      setProductos(Array.isArray(datos) ? datos : datos.productos || [])
      setError('')
    } catch {
      setError('No se pudieron cargar los productos.')
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    cargar()
  }, [cargar])

  // Si recibe un id, edita; si no, crea un producto nuevo.
  const guardar = async (cuerpo, id) => {
    await pedirAdmin(id ? `/admin/productos/${id}` : '/admin/productos', {
      method: id ? 'PUT' : 'POST',
      body: JSON.stringify(cuerpo),
    })
    await cargar()
  }

  const borrar = async (id) => {
    await pedirAdmin(`/admin/productos/${id}`, { method: 'DELETE' })
    await cargar()
  }

  return { productos, cargando, error, guardar, borrar }
}

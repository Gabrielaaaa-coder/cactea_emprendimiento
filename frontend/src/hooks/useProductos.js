import { useEffect, useState } from 'react'
import { obtenerProductos } from '../services/productos.js'

// Carga los productos al entrar y avisa si hay error o sigue cargando.
export function useProductos() {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelado = false

    async function cargar() {
      try {
        const datos = await obtenerProductos()
        if (!cancelado) setProductos(datos)
      } catch (err) {
        if (!cancelado) {
          setError('No pudimos cargar los productos. ¿Está encendido el servidor?')
        }
        console.error(err)
      } finally {
        if (!cancelado) setCargando(false)
      }
    }

    cargar()

    // Si la persona sale de la página antes de que llegue la respuesta,
    // ya no intentamos actualizar el estado.
    return () => {
      cancelado = true
    }
  }, [])

  return { productos, cargando, error }
}

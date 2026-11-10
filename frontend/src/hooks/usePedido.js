import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

// Guarda el pedido y ofrece las acciones para agregar, cambiar cantidades o quitar.
export function usePedido() {
  const [pedido, setPedido] = useState([])
  const [ultimoCambiado, setUltimoCambiado] = useState(null)
  const temporizador = useRef(null)

  // Marca la fila que acaba de cambiar para que el CSS haga el "pop".
  const marcarCambio = useCallback((id) => {
    setUltimoCambiado(id)
    clearTimeout(temporizador.current)
    temporizador.current = setTimeout(() => setUltimoCambiado(null), 400)
  }, [])

  useEffect(() => () => clearTimeout(temporizador.current), [])

  const agregar = useCallback(
    (producto) => {
      setPedido((actual) => {
        const existente = actual.find((item) => item.id === producto._id)

        if (existente) {
          return actual.map((item) =>
            item.id === producto._id ? { ...item, cantidad: item.cantidad + 1 } : item,
          )
        }

        return [
          ...actual,
          {
            id: producto._id,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: 1,
          },
        ]
      })
      marcarCambio(producto._id)
    },
    [marcarCambio],
  )

  const cambiarCantidad = useCallback(
    (id, cambio) => {
      setPedido((actual) => {
        const item = actual.find((i) => i.id === id)
        if (!item) return actual

        const cantidad = item.cantidad + cambio
        if (cantidad <= 0) return actual.filter((i) => i.id !== id)

        return actual.map((i) => (i.id === id ? { ...i, cantidad } : i))
      })
      marcarCambio(id)
    },
    [marcarCambio],
  )

  const quitar = useCallback((id) => {
    setPedido((actual) => actual.filter((item) => item.id !== id))
  }, [])

  const total = useMemo(
    () => pedido.reduce((suma, item) => suma + item.precio * item.cantidad, 0),
    [pedido],
  )

  const unidades = useMemo(
    () => pedido.reduce((suma, item) => suma + item.cantidad, 0),
    [pedido],
  )

  return {
    pedido,
    agregar,
    cambiarCantidad,
    quitar,
    total,
    unidades,
    ultimoCambiado,
  }
}

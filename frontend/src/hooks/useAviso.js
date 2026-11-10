import { useCallback, useEffect, useState } from 'react'

// Muestra un aviso flotante durante 3 segundos.
export function useAviso() {
  const [aviso, setAviso] = useState(null)

  useEffect(() => {
    if (!aviso) return
    const id = setTimeout(() => setAviso(null), 3000)
    return () => clearTimeout(id)
  }, [aviso])

  const avisar = useCallback((texto) => setAviso({ texto, momento: Date.now() }), [])

  return { aviso: aviso?.texto || '', avisar }
}

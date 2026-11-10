import { createContext, useContext } from 'react'

export const SesionContext = createContext(null)

// Hook para leer el token y las acciones de sesión desde cualquier componente.
export function useSesion() {
  const contexto = useContext(SesionContext)
  if (!contexto) throw new Error('useSesion debe usarse dentro de SesionProvider')
  return contexto
}

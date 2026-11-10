import { useCallback, useEffect, useState } from 'react'
import { iniciarSesion } from '../services/auth.js'
import { EVENTO_SESION_EXPIRADA } from '../services/admin.js'
import { borrarToken, obtenerToken } from './sesion.js'
import { SesionContext } from './contextoSesion.js'

// Guarda el token en memoria y en sessionStorage para toda la aplicación.
export function SesionProvider({ children }) {
  const [token, setToken] = useState(() => obtenerToken())

  // Si una petición recibe 401, el token se borra y volvemos al login.
  useEffect(() => {
    const alExpirar = () => setToken(null)
    window.addEventListener(EVENTO_SESION_EXPIRADA, alExpirar)
    return () => window.removeEventListener(EVENTO_SESION_EXPIRADA, alExpirar)
  }, [])

  const entrar = useCallback(async (usuario, clave) => {
    const nuevoToken = await iniciarSesion(usuario, clave)
    setToken(nuevoToken)
  }, [])

  const salir = useCallback(() => {
    borrarToken()
    setToken(null)
  }, [])

  return (
    <SesionContext.Provider value={{ token, entrar, salir }}>
      {children}
    </SesionContext.Provider>
  )
}

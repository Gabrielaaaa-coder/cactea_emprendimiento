import { Navigate, Outlet } from 'react-router-dom'
import { useSesion } from './contextoSesion.js'

// Deja pasar al panel solo si hay un token guardado.
function RutaProtegida() {
  const { token } = useSesion()
  return token ? <Outlet /> : <Navigate to="/admin/login" replace />
}

export default RutaProtegida

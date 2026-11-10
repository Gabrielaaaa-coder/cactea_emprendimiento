import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useSesion } from './contextoSesion.js'

function LoginAdmin() {
  const { token, entrar } = useSesion()
  const navegar = useNavigate()

  const [usuario, setUsuario] = useState('')
  const [clave, setClave] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  // Si ya hay sesión, no tiene sentido mostrar el login.
  if (token) return <Navigate to="/admin" replace />

  const enviar = async (evento) => {
    evento.preventDefault()
    setError('')
    setEnviando(true)

    try {
      await entrar(usuario, clave)
      navegar('/admin', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="panel-admin">
      <section className="login">
        <form className="tarjeta" onSubmit={enviar}>
          <h1>Cactea</h1>
          <p>Panel de administrador</p>

          <input
            placeholder="Usuario"
            autoComplete="username"
            required
            value={usuario}
            onChange={(evento) => setUsuario(evento.target.value)}
          />

          <input
            type="password"
            placeholder="Contraseña"
            autoComplete="current-password"
            required
            value={clave}
            onChange={(evento) => setClave(evento.target.value)}
          />

          <button className="btn" type="submit" disabled={enviando}>
            {enviando ? 'Entrando...' : 'Entrar'}
          </button>

          <p className="error">{error}</p>
        </form>
      </section>
    </div>
  )
}

export default LoginAdmin

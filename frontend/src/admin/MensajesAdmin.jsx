import Aviso from './Aviso.jsx'
import { useAviso } from '../hooks/useAviso.js'
import { useMensajesAdmin } from '../hooks/useMensajesAdmin.js'

const fecha = (valor) => new Date(valor).toLocaleString('es-EC')

function MensajesAdmin() {
  const { mensajes, cargando, error, alternarLeido, borrar } = useMensajesAdmin()
  const { aviso, avisar } = useAviso()

  const cambiarLeido = async (mensaje) => {
    try {
      await alternarLeido(mensaje)
      avisar('Mensaje actualizado 🌿')
    } catch (err) {
      avisar(err.message)
    }
  }

  const borrarMensaje = async (mensaje) => {
    if (!window.confirm('¿Borrar este mensaje?')) return

    try {
      await borrar(mensaje._id)
      avisar('Mensaje borrado')
    } catch (err) {
      avisar(err.message)
    }
  }

  return (
    <div className="lista-admin">
      {cargando && <p>Cargando mensajes...</p>}
      {!cargando && error && <p className="error">{error}</p>}
      {!cargando && !error && mensajes.length === 0 && (
        <p className="vacio">Aún no hay mensajes 🌱</p>
      )}

      {!cargando &&
        !error &&
        mensajes.map((mensaje) => (
          <article
            key={mensaje._id}
            className={`tarjeta mensaje${mensaje.leido ? '' : ' nuevo'}`}
          >
            <h3>
              {mensaje.nombre} · {mensaje.asunto}
            </h3>
            <small>
              {mensaje.correo}
              {mensaje.telefono ? ` · ${mensaje.telefono}` : ''} · {fecha(mensaje.createdAt)}
            </small>
            <p>{mensaje.mensaje}</p>

            <div className="fila">
              <button
                type="button"
                className="btn-sec"
                onClick={() => cambiarLeido(mensaje)}
              >
                {mensaje.leido ? 'Marcar como no leído' : 'Marcar como leído'}
              </button>
              <button
                type="button"
                className="btn-peligro"
                onClick={() => borrarMensaje(mensaje)}
              >
                Borrar
              </button>
            </div>
          </article>
        ))}

      <Aviso texto={aviso} />
    </div>
  )
}

export default MensajesAdmin

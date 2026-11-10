import { useContacto } from '../../hooks/useContacto.js'

function ContactoForm() {
  const { datos, estado, error, enviando, enviado, cambiar, enviar, enviarOtro } = useContacto()

  // Cuando el mensaje se guarda bien, el formulario se reemplaza por la confirmación.
  if (enviado) {
    return (
      <div className="contacto__exito" role="status">
        <span className="contacto__exito-planta" aria-hidden="true">
          🌱
        </span>
        <h3>¡Mensaje enviado!</h3>
        <p>Gracias por escribirnos. Te respondemos pronto 🌵</p>
        <button type="button" className="contacto__otro" onClick={enviarOtro}>
          Enviar otro mensaje
        </button>
      </div>
    )
  }

  return (
    <form id="form-contacto" className="formulario" noValidate onSubmit={enviar}>
      <div className="campo">
        <label htmlFor="contacto-nombre">Nombre</label>
        <input
          id="contacto-nombre"
          name="nombre"
          type="text"
          required
          maxLength="80"
          autoComplete="name"
          value={datos.nombre}
          onChange={cambiar}
        />
      </div>

      <div className="campo">
        <label htmlFor="contacto-correo">Correo electrónico</label>
        <input
          id="contacto-correo"
          name="correo"
          type="email"
          required
          maxLength="120"
          autoComplete="email"
          value={datos.correo}
          onChange={cambiar}
        />
      </div>

      <div className="campo">
        <label htmlFor="contacto-telefono">Teléfono (opcional)</label>
        <input
          id="contacto-telefono"
          name="telefono"
          type="tel"
          maxLength="20"
          autoComplete="tel"
          value={datos.telefono}
          onChange={cambiar}
        />
      </div>

      <div className="campo">
        <label htmlFor="contacto-asunto">Asunto</label>
        <select
          id="contacto-asunto"
          name="asunto"
          required
          value={datos.asunto}
          onChange={cambiar}
        >
          <option value="">Elige una opción</option>
          <option value="consulta">Consulta</option>
          <option value="pedido-especial">Pedido especial</option>
          <option value="regalos">Regalos y eventos</option>
          <option value="otro">Otro</option>
        </select>
      </div>

      <div className="campo campo--completo">
        <label htmlFor="contacto-mensaje">Mensaje</label>
        <textarea
          id="contacto-mensaje"
          name="mensaje"
          rows="5"
          required
          maxLength="1000"
          value={datos.mensaje}
          onChange={cambiar}
        />
      </div>

      <button type="submit" className="boton" disabled={enviando}>
        {enviando ? 'Enviando...' : 'Enviar mensaje'}
      </button>

      <p
        id="estado-contacto"
        className={`formulario__estado${error ? ' formulario__estado--error' : ''}`}
        role="status"
        aria-live="polite"
      >
        {estado}
      </p>
    </form>
  )
}

export default ContactoForm

import { WHATSAPP } from '../../constants.js'

function DatosContacto() {
  return (
    <ul className="contacto__datos">
      <li>
        <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener">
          <span className="contacto__icono" aria-hidden="true">
            💬
          </span>
          <span>
            <small>WhatsApp</small>+593 99 312 2218
          </span>
        </a>
      </li>

      <li>
        <a
          href="https://www.instagram.com/cactea_suculentas/"
          target="_blank"
          rel="noopener"
        >
          <span className="contacto__icono" aria-hidden="true">
            📸
          </span>
          <span>
            <small>Instagram</small>@cactea_suculentas
          </span>
        </a>
      </li>

      <li className="contacto__dato">
        <span className="contacto__icono" aria-hidden="true">
          📍
        </span>
        <span>
          <small>Ciudad</small>Guayaquil
        </span>
      </li>
    </ul>
  )
}

export default DatosContacto

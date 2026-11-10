import { WHATSAPP } from '../../constants.js'
import { dinero } from '../../utils/dinero.js'
import PedidoItem from '../pedido/PedidoItem.jsx'
import PedidoVacio from '../pedido/PedidoVacio.jsx'

function Pedido({ pedido, total, onCambiarCantidad, onQuitar, ultimoCambiado }) {
  const vacio = pedido.length === 0

  // Mensaje que se abrirá en WhatsApp con el resumen del pedido.
  const lineas = pedido.map(
    (item) => `• ${item.cantidad} × ${item.nombre} (${dinero(item.precio * item.cantidad)})`,
  )
  const mensaje = `Hola Cactea, quiero hacer este pedido:\n${lineas.join('\n')}\nTotal: ${dinero(total)}`
  const enlaceWhatsApp = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensaje)}`

  return (
    <section id="pedido" className="pedido">
      <h2>Mi pedido</h2>

      <ul id="lista-pedido" className="pedido__lista">
        {vacio ? (
          <PedidoVacio />
        ) : (
          pedido.map((item) => (
            <PedidoItem
              key={item.id}
              item={item}
              nuevo={item.id === ultimoCambiado}
              onCambiarCantidad={onCambiarCantidad}
              onQuitar={onQuitar}
            />
          ))
        )}
      </ul>

      <p className="pedido__total">
        Total: <strong id="total-pedido">{dinero(total)}</strong>
      </p>

      <a
        id="enviar-pedido"
        className="boton"
        href={enlaceWhatsApp}
        target="_blank"
        rel="noopener"
        aria-disabled={vacio ? 'true' : 'false'}
        tabIndex={vacio ? -1 : 0}
      >
        <svg
          className="boton__icono"
          viewBox="0 0 24 24"
          width="20"
          height="20"
          aria-hidden="true"
          focusable="false"
        >
          <path fill="currentColor" d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" />
        </svg>
        Enviar pedido por WhatsApp
      </a>
    </section>
  )
}

export default Pedido

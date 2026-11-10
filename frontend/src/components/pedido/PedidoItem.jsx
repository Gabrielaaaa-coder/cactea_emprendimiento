import { dinero } from '../../utils/dinero.js'

function PedidoItem({ item, nuevo, onCambiarCantidad, onQuitar }) {
  return (
    <li className={`pedido__item${nuevo ? ' pedido__item--nuevo' : ''}`}>
      <span className="pedido__nombre">{item.nombre}</span>

      <div className="pedido__cantidad">
        <button
          type="button"
          aria-label={`Quitar una unidad de ${item.nombre}`}
          onClick={() => onCambiarCantidad(item.id, -1)}
        >
          −
        </button>
        <span>{item.cantidad}</span>
        <button
          type="button"
          aria-label={`Agregar una unidad de ${item.nombre}`}
          onClick={() => onCambiarCantidad(item.id, 1)}
        >
          +
        </button>
      </div>

      <span className="pedido__subtotal">{dinero(item.precio * item.cantidad)}</span>

      <button
        type="button"
        className="pedido__quitar"
        aria-label={`Quitar ${item.nombre}`}
        onClick={() => onQuitar(item.id)}
      >
        ✕
      </button>
    </li>
  )
}

export default PedidoItem

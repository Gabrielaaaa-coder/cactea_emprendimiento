import { dinero } from '../../utils/dinero.js'
import { rutaImagen } from '../../utils/imagen.js'

function ProductoCard({ producto, onAgregar }) {
  return (
    <article className="tarjeta">
      <img
        className="tarjeta__imagen"
        src={rutaImagen(producto.imagen)}
        alt={producto.nombre}
      />
      <h3 className="tarjeta__nombre">{producto.nombre}</h3>
      <p className="tarjeta__descripcion">{producto.descripcion}</p>
      <p className="tarjeta__precio">{dinero(producto.precio)}</p>
      <button type="button" className="boton tarjeta__pedir" onClick={() => onAgregar(producto)}>
        Agregar al pedido
      </button>
    </article>
  )
}

export default ProductoCard

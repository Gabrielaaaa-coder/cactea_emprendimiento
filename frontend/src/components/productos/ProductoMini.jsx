import { dinero } from '../../utils/dinero.js'
import { rutaImagen } from '../../utils/imagen.js'

function ProductoMini({ producto }) {
  return (
    <article className="tarjeta tarjeta--mini">
      <img
        className="tarjeta__imagen"
        src={rutaImagen(producto.imagen)}
        alt={producto.nombre}
      />
      <h3 className="tarjeta__nombre">{producto.nombre}</h3>
      <p className="tarjeta__precio">{dinero(producto.precio)}</p>
      <a className="tarjeta__enlace" href="#productos">
        Ver más →
      </a>
    </article>
  )
}

export default ProductoMini

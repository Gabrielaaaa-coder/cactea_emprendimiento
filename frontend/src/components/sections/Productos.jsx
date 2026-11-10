import { useState } from 'react'
import Filtros from '../productos/Filtros.jsx'
import ProductoCard from '../productos/ProductoCard.jsx'

function Productos({ productos, cargando, error, onAgregar }) {
  const [categoria, setCategoria] = useState('todos')

  const visibles =
    categoria === 'todos'
      ? productos
      : productos.filter((producto) => producto.categoria === categoria)

  return (
    <section id="productos" className="productos">
      <h2>Nuestros productos</h2>

      <Filtros categoria={categoria} onCambiar={setCategoria} />

      <div id="lista-productos" className="productos__lista" aria-live="polite">
        {cargando && <p className="productos__estado">Cargando productos...</p>}
        {!cargando && error && <p className="productos__estado">{error}</p>}
        {!cargando &&
          !error &&
          visibles.map((producto) => (
            <ProductoCard key={producto._id} producto={producto} onAgregar={onAgregar} />
          ))}
      </div>
    </section>
  )
}

export default Productos

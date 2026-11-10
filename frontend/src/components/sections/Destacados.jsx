import ProductoMini from '../productos/ProductoMini.jsx'

function Destacados({ productos, cargando }) {
  const favoritos = productos.filter((producto) => producto.destacado).slice(0, 3)

  return (
    <section id="destacados" className="destacados">
      <h2>Nuestros favoritos</h2>
      <div id="lista-destacados" className="destacados__lista" aria-live="polite">
        {cargando ? (
          <p className="productos__estado">Cargando...</p>
        ) : (
          favoritos.map((producto) => <ProductoMini key={producto._id} producto={producto} />)
        )}
      </div>
    </section>
  )
}

export default Destacados

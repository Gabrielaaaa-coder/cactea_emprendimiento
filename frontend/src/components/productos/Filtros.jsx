const categorias = [
  { valor: 'todos', texto: 'Todos' },
  { valor: 'suculentas', texto: 'Suculentas' },
  { valor: 'cactus', texto: 'Cactus' },
  { valor: 'regalos', texto: 'Regalos' },
]

function Filtros({ categoria, onCambiar }) {
  return (
    <div id="filtros" className="filtros">
      {categorias.map(({ valor, texto }) => (
        <button
          key={valor}
          type="button"
          className="filtro"
          data-categoria={valor}
          aria-pressed={categoria === valor}
          onClick={() => onCambiar(valor)}
        >
          {texto}
        </button>
      ))}
    </div>
  )
}

export default Filtros

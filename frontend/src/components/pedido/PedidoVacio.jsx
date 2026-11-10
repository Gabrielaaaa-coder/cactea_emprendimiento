function PedidoVacio() {
  return (
    <li className="pedido__vacio">
      <span className="pedido__vacio-icono" aria-hidden="true">
        🌱
      </span>
      <span>Aún no has agregado nada</span>
      <a className="pedido__vacio-enlace" href="#productos">
        Ver productos
      </a>
    </li>
  )
}

export default PedidoVacio

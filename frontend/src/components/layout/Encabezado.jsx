import { useEffect, useRef, useState } from 'react'

function Encabezado({ unidades }) {
  const [rebote, setRebote] = useState(false)
  const anteriores = useRef(unidades)
  const temporizador = useRef(null)
  const frame = useRef(null)

  // Hace rebotar la burbuja solo cuando aumenta la cantidad de productos.
  useEffect(() => {
    if (unidades > anteriores.current) {
      setRebote(false)
      frame.current = requestAnimationFrame(() => setRebote(true))
      clearTimeout(temporizador.current)
      temporizador.current = setTimeout(() => setRebote(false), 450)
    } else {
      setRebote(false)
    }

    anteriores.current = unidades

    return () => {
      cancelAnimationFrame(frame.current)
      clearTimeout(temporizador.current)
    }
  }, [unidades])

  return (
    <header className="encabezado">
      <a href="#inicio" className="encabezado__logo">
        <img src="/img/logo-cactea.png" alt="Logo de Cactea" />
      </a>

      <nav className="menu" aria-label="Menú principal">
        <ul>
          <li>
            <a href="#nosotros">Nosotros</a>
          </li>
          <li>
            <a href="#productos">Productos</a>
          </li>
          <li>
            <a href="#pedido">
              Mi pedido
              <span
                className={`contador-pedido${rebote ? ' rebote' : ''}`}
                hidden={unidades === 0}
              >
                {unidades}
              </span>
            </a>
          </li>
          <li>
            <a href="#cuidados">Cuidados</a>
          </li>
          <li>
            <a href="#contacto">Contáctanos</a>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Encabezado

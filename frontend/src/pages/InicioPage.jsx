import Encabezado from '../components/layout/Encabezado.jsx'
import Pie from '../components/layout/Pie.jsx'
import PlantaScroll from '../components/PlantaScroll.jsx'
import Cuidados from '../components/sections/Cuidados.jsx'
import Contacto from '../components/sections/Contacto.jsx'
import Destacados from '../components/sections/Destacados.jsx'
import Nosotros from '../components/sections/Nosotros.jsx'
import Pedido from '../components/sections/Pedido.jsx'
import Portada from '../components/sections/Portada.jsx'
import Productos from '../components/sections/Productos.jsx'
import { usePedido } from '../hooks/usePedido.js'
import { useProductos } from '../hooks/useProductos.js'

function InicioPage() {
  const { productos, cargando, error } = useProductos()
  const {
    pedido,
    agregar,
    cambiarCantidad,
    quitar,
    total,
    unidades,
    ultimoCambiado,
  } = usePedido()

  return (
    <>
      <Encabezado unidades={unidades} />

      <main>
        <Portada />
        <Destacados productos={productos} cargando={cargando} />
        <Nosotros />
        <Productos
          productos={productos}
          cargando={cargando}
          error={error}
          onAgregar={agregar}
        />
        <Pedido
          pedido={pedido}
          total={total}
          onCambiarCantidad={cambiarCantidad}
          onQuitar={quitar}
          ultimoCambiado={ultimoCambiado}
        />
        <Cuidados />
        <Contacto />
      </main>

      <Pie />
      <PlantaScroll />
    </>
  )
}

export default InicioPage

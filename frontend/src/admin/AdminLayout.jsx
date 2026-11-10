import { NavLink, Outlet } from 'react-router-dom'
import { useSesion } from './contextoSesion.js'

// Marco del panel: barra superior, pestañas y botón para salir.
function AdminLayout() {
  const { salir } = useSesion()

  const claseTab = ({ isActive }) => `tab${isActive ? ' activa' : ''}`

  return (
    <div className="panel-admin">
      <header className="barra">
        <h1>Cactea · Panel</h1>

        <nav>
          <NavLink to="/admin/mensajes" className={claseTab}>
            Mensajes
          </NavLink>
          <NavLink to="/admin/productos" className={claseTab}>
            Productos
          </NavLink>
        </nav>

        <button type="button" className="btn-sec" onClick={salir}>
          Salir
        </button>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout

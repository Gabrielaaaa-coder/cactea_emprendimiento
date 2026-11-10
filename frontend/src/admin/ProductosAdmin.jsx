import { useState } from 'react'
import Aviso from './Aviso.jsx'
import { useAviso } from '../hooks/useAviso.js'
import { useProductosAdmin } from '../hooks/useProductosAdmin.js'
import { dinero } from '../utils/dinero.js'

const formularioVacio = {
  id: '',
  nombre: '',
  categoria: 'suculentas',
  precio: '',
  imagen: '',
  descripcion: '',
  destacado: false,
}

function ProductosAdmin() {
  const { productos, cargando, error, guardar, borrar } = useProductosAdmin()
  const { aviso, avisar } = useAviso()
  const [formulario, setFormulario] = useState(formularioVacio)

  const editando = Boolean(formulario.id)

  const cambiar = (evento) => {
    const { name, value, type, checked } = evento.target
    setFormulario((actual) => ({
      ...actual,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const limpiar = () => setFormulario(formularioVacio)

  const editar = (producto) => {
    setFormulario({
      id: producto._id,
      nombre: producto.nombre,
      categoria: producto.categoria,
      precio: producto.precio,
      imagen: producto.imagen || '',
      descripcion: producto.descripcion || '',
      destacado: Boolean(producto.destacado),
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const enviar = async (evento) => {
    evento.preventDefault()

    const cuerpo = {
      nombre: formulario.nombre,
      categoria: formulario.categoria,
      precio: Number(formulario.precio),
      imagen: formulario.imagen || undefined,
      descripcion: formulario.descripcion,
      destacado: formulario.destacado,
    }

    try {
      await guardar(cuerpo, formulario.id)
      avisar(editando ? 'Producto actualizado 🌿' : 'Producto creado 🌱')
      limpiar()
    } catch (err) {
      avisar(err.message)
    }
  }

  const borrarProducto = async (producto) => {
    if (!window.confirm(`¿Borrar "${producto.nombre}"?`)) return

    try {
      await borrar(producto._id)
      avisar('Producto borrado')
    } catch (err) {
      avisar(err.message)
    }
  }

  return (
    <div className="lista-admin">
      <form className="tarjeta" onSubmit={enviar}>
        <h2>{editando ? 'Editar producto' : 'Nuevo producto'}</h2>

        <input
          name="nombre"
          placeholder="Nombre"
          required
          value={formulario.nombre}
          onChange={cambiar}
        />

        <select name="categoria" value={formulario.categoria} onChange={cambiar}>
          <option value="suculentas">Suculentas</option>
          <option value="cactus">Cactus</option>
        </select>

        <input
          name="precio"
          type="number"
          step="0.01"
          min="0"
          placeholder="Precio"
          required
          value={formulario.precio}
          onChange={cambiar}
        />

        <input
          name="imagen"
          placeholder="Imagen (ej: img/producto-1.jpg)"
          value={formulario.imagen}
          onChange={cambiar}
        />

        <textarea
          name="descripcion"
          rows="3"
          placeholder="Descripción"
          value={formulario.descripcion}
          onChange={cambiar}
        />

        <label className="check">
          <input
            name="destacado"
            type="checkbox"
            checked={formulario.destacado}
            onChange={cambiar}
          />
          Destacado
        </label>

        <div className="fila">
          <button className="btn" type="submit">
            Guardar
          </button>
          {editando && (
            <button type="button" className="btn-sec" onClick={limpiar}>
              Cancelar edición
            </button>
          )}
        </div>
      </form>

      {cargando && <p>Cargando productos...</p>}
      {!cargando && error && <p className="error">{error}</p>}

      {!cargando &&
        !error &&
        productos.map((producto) => (
          <article className="tarjeta producto" key={producto._id}>
            <h3>
              {producto.nombre}
              {producto.destacado ? ' ⭐' : ''}
            </h3>
            <small>
              {producto.categoria} · {dinero(producto.precio)}
            </small>
            <p>{producto.descripcion}</p>

            <div className="fila">
              <button type="button" className="btn-sec" onClick={() => editar(producto)}>
                Editar
              </button>
              <button
                type="button"
                className="btn-peligro"
                onClick={() => borrarProducto(producto)}
              >
                Borrar
              </button>
            </div>
          </article>
        ))}

      <Aviso texto={aviso} />
    </div>
  )
}

export default ProductosAdmin

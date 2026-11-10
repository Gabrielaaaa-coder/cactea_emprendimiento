import { cuidados } from '../../data/cuidados.js'
import Reveal from '../Reveal.jsx'

function Cuidados() {
  return (
    <section id="cuidados" className="cuidados">
      <h2>Cuidados</h2>
      <p className="cuidados__intro">
        Las suculentas y los cactus son fáciles de cuidar si conoces lo básico.
      </p>

      <div className="cuidados__lista">
        {cuidados.map((cuidado, indice) => {
          const clases = [
            'cuidado',
            'aparece',
            cuidado.destacado ? 'cuidado--destacado' : '',
            cuidado.ancho ? 'cuidado--ancho' : '',
          ]
            .filter(Boolean)
            .join(' ')

          return (
            <Reveal
              as="article"
              key={cuidado.titulo}
              className={clases}
              style={{ '--i': indice }}
            >
              <span className="cuidado__icono" aria-hidden="true">
                {cuidado.icono}
              </span>
              <h3>{cuidado.titulo}</h3>
              <p className="cuidado__dato">{cuidado.dato}</p>
              <p>{cuidado.texto}</p>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}

export default Cuidados

import Reveal from '../Reveal.jsx'

const fotosIzquierda = [
  { emoji: '🌱', titulo: 'Nuestra terraza', rot: '-5deg', delay: '0s' },
  { emoji: '🌵', titulo: 'Nuestras plantas', rot: '3deg', delay: '0.15s' },
]

const fotosDerecha = [
  { emoji: '🪴', titulo: 'Nuestro equipo', rot: '4deg', delay: '0.1s' },
  { emoji: '🌿', titulo: 'Cactea', rot: '-3deg', delay: '0.25s' },
]

function Polaroid({ foto, lado }) {
  return (
    <Reveal
      as="figure"
      className={`polaroid reveal reveal-${lado}`}
      style={{ '--rot': foto.rot, '--delay': foto.delay }}
    >
      <div className="foto-placeholder">
        <span>{foto.emoji}</span>
        <small>Tu foto aquí</small>
      </div>
      <figcaption>{foto.titulo}</figcaption>
    </Reveal>
  )
}

function Nosotros() {
  return (
    <section className="nosotros" id="nosotros">
      <div className="nosotros-grid">
        <div className="fotos fotos-izq">
          {fotosIzquierda.map((foto) => (
            <Polaroid key={foto.titulo} foto={foto} lado="izq" />
          ))}
        </div>

        <div className="nosotros-texto">
          <h2>Quiénes somos</h2>
          <p>
            Todo surgió desde una pequeña terraza en el suburbio de Guayaquil. El amor a las
            plantas y a la naturaleza nos llevó a crear un pequeño oasis que poco a poco se fue
            transformando en una forma de vida.
          </p>
          <p>Cada planta contiene una parte del corazón de todos los que conformamos Cactea.</p>
        </div>

        <div className="fotos fotos-der">
          {fotosDerecha.map((foto) => (
            <Polaroid key={foto.titulo} foto={foto} lado="der" />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Nosotros

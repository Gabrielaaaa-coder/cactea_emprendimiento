function Hoja() {
  return (
    <svg viewBox="0 0 100 150" aria-hidden="true">
      <path d="M50 4C92 36 92 100 50 146C8 100 8 36 50 4Z" fill="currentColor" />
      <path d="M50 22V132" stroke="#E0E5CF" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.8" />
    </svg>
  )
}

function Maceta() {
  return (
    <svg viewBox="0 0 120 140" aria-hidden="true">
      <ellipse cx="60" cy="42" rx="14" ry="30" fill="currentColor" />
      <ellipse cx="60" cy="58" rx="13" ry="28" fill="currentColor" transform="rotate(-50 60 80)" />
      <ellipse cx="60" cy="58" rx="13" ry="28" fill="currentColor" transform="rotate(50 60 80)" />
      <ellipse cx="60" cy="66" rx="12" ry="24" fill="currentColor" transform="rotate(-85 60 86)" />
      <ellipse cx="60" cy="66" rx="12" ry="24" fill="currentColor" transform="rotate(85 60 86)" />
      <path d="M26 86H94L84 134H36Z" fill="currentColor" />
      <rect x="20" y="78" width="80" height="14" rx="5" fill="currentColor" />
    </svg>
  )
}

function Cactus() {
  return (
    <svg viewBox="0 0 100 160" aria-hidden="true">
      <rect x="36" y="10" width="28" height="140" rx="14" fill="currentColor" />
      <path d="M36 90H22A8 8 0 0 1 14 82V52A9 9 0 0 1 32 52V76H36Z" fill="currentColor" />
      <path d="M64 70H78A8 8 0 0 0 86 62V38A9 9 0 0 0 68 38V56H64Z" fill="currentColor" />
    </svg>
  )
}

function Puntos() {
  return (
    <svg viewBox="0 0 80 80" aria-hidden="true">
      <circle cx="12" cy="12" r="5" fill="currentColor" />
      <circle cx="44" cy="20" r="3.5" fill="currentColor" />
      <circle cx="68" cy="8" r="4" fill="currentColor" />
      <circle cx="24" cy="48" r="4" fill="currentColor" />
      <circle cx="58" cy="52" r="5.5" fill="currentColor" />
      <circle cx="36" cy="72" r="3.5" fill="currentColor" />
    </svg>
  )
}

function Nosotros() {
  return (
    <section className="fondo-hojas" id="nosotros">
      <div className="fondo-hojas__capa" aria-hidden="true">
        <span className="forma forma--hoja-1"><Hoja /></span>
        <span className="forma forma--hoja-2"><Hoja /></span>
        <span className="forma forma--hoja-3"><Hoja /></span>
        <span className="forma forma--hoja-4"><Hoja /></span>
        <span className="forma forma--maceta-1"><Maceta /></span>
        <span className="forma forma--maceta-2"><Maceta /></span>
        <span className="forma forma--cactus-1"><Cactus /></span>
        <span className="forma forma--cactus-2"><Cactus /></span>
        <span className="forma forma--puntos-1"><Puntos /></span>
        <span className="forma forma--puntos-2"><Puntos /></span>
      </div>

      <div className="fondo-hojas__contenido">
        <div className="nosotros-texto">
          <h2>Quiénes somos</h2>
          <p>
            Todo surgió desde una pequeña terraza en el suburbio de Guayaquil. El amor a las
            plantas y a la naturaleza nos llevó a crear un pequeño oasis que poco a poco se fue
            transformando en una forma de vida.
          </p>
          <p>Cada planta contiene una parte del corazón de todos los que conformamos Cactea.</p>
        </div>
      </div>
    </section>
  )
}

export default Nosotros
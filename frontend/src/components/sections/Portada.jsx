function Portada() {
  return (
    <section id="inicio" className="portada">
      {/* Decoración de fondo: círculos y hojitas suaves. */}
      <svg
        className="portada__deco"
        viewBox="0 0 1000 600"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="900" cy="80" r="180" className="deco__circulo" />
        <circle cx="60" cy="540" r="150" className="deco__circulo" />
        <circle cx="500" cy="590" r="70" className="deco__circulo deco__circulo--suave" />
        <circle cx="120" cy="90" r="26" className="deco__circulo deco__circulo--suave" />
        <circle cx="820" cy="470" r="18" className="deco__circulo deco__circulo--suave" />
        <g transform="translate(400 110) rotate(-25)">
          <path className="deco__hoja" d="M0 0 C14 -18 40 -22 58 -8 C40 10 14 12 0 0Z" />
        </g>
        <g transform="translate(860 300) rotate(40) scale(-1 1)">
          <path className="deco__hoja deco__hoja--b" d="M0 0 C14 -18 40 -22 58 -8 C40 10 14 12 0 0Z" />
        </g>
        <g transform="translate(600 40) rotate(20)">
          <path className="deco__hoja deco__hoja--c" d="M0 0 C14 -18 40 -22 58 -8 C40 10 14 12 0 0Z" />
        </g>
      </svg>

      <div className="portada__texto">
        <h1>Cactea</h1>
        <p className="portada__lema">Vivero orgánico</p>
        <p className="portada__descripcion">
          En Cactea encontrarás suculentas y cactus cultivados con cariño, perfectos para
          decorar tu casa, tu oficina o para regalar a alguien especial. Además, te contamos
          cómo cuidarlos para que crezcan sanos y felices.
        </p>
        <div className="portada__botones">
          <a href="#productos" className="boton">
            Ver productos
          </a>
          <a href="#cuidados" className="boton boton--borde">
            Cómo cuidarlas
          </a>
        </div>
      </div>

      <img
        className="portada__imagen"
        src="/img/portada.jpeg"
        alt="Suculentas en macetas de Cactea"
      />

      {/* Ola que separa la portada de la siguiente sección. */}
      <svg
        className="portada__ola"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M0 40 C240 90 480 0 720 40 S1200 80 1440 30 V80 H0Z" />
      </svg>
    </section>
  )
}

export default Portada

// =========================================================
// CACTEA · main.js
// 1) Cactus con personalidad (crece, se mece, salta)
// (Después agregaremos aquí el fetch a /api/productos)
// =========================================================

// ---------- 1) PLANTITA ----------
const contenedor = document.querySelector('.planta-fija');

if (contenedor) {
  const planta = contenedor.querySelector('.planta-scroll');
  const tallo  = contenedor.querySelector('.planta__tallo');
  const piezas = contenedor.querySelectorAll('[data-inicio]'); // hojas y flor

  const limitar = (n) => Math.min(1, Math.max(0, n));

  // ----- Añade una clase un ratito (para saltos y celebraciones) -----
  function activarUnRato(clase, milisegundos) {
    contenedor.classList.remove(clase);
    void contenedor.offsetWidth;   // reinicia la animación si ya estaba puesta
    contenedor.classList.add(clase);
    setTimeout(() => contenedor.classList.remove(clase), milisegundos);
  }

  // ----- Dibujo: tallo, hojas y flor según el progreso -----
  function dibujar(progreso) {
    // El tallo crece hasta el 85% del recorrido; siempre asoma un brotecito
    if (tallo) {
      tallo.style.strokeDashoffset = 1 - Math.max(0.06, limitar(progreso / 0.85));
    }

    piezas.forEach((pieza) => {
      const inicio   = parseFloat(pieza.dataset.inicio);
      const duracion = parseFloat(pieza.dataset.duracion || 0.12);   // cuánto tarda en crecer
      let tamano = limitar((progreso - inicio) / duracion);
      if (pieza.dataset.min) tamano = Math.max(parseFloat(pieza.dataset.min), tamano); // brotecito inicial

      if (pieza.dataset.eje === 'y') {
        pieza.setAttribute('transform', `scale(1 ${tamano})`);        // crece solo hacia arriba
      } else {
        // La flor además gira mientras se abre
        const giro = pieza.dataset.giro ? `rotate(${(1 - tamano) * -120}) ` : '';
        pieza.setAttribute('transform', `${giro}scale(${tamano})`);
      }
    });
  }

  // ----- Estado que recuerda la plantita -----
  let celebrado = false;
  let temporizadorScroll;

  function actualizar() {
    const recorrido = document.documentElement.scrollHeight - window.innerHeight;
    const progreso = limitar(recorrido > 0 ? window.scrollY / recorrido : 1);
    dibujar(progreso);

    // Al llegar al final: salta y sonríe grande (una sola vez por llegada)
    if (progreso >= 0.98 && !celebrado) {
      celebrado = true;
      activarUnRato('celebrando', 2500);
      activarUnRato('saltando', 600);
    } else if (progreso < 0.9) {
      celebrado = false;
    }
  }

  // ----- Clic sobre la plantita -----
  planta.addEventListener('click', () => {
    activarUnRato('saltando', 600);
  });

  // ----- Scroll -----
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    dibujar(1);   // sin animaciones: la mostramos ya crecida
  } else {
    let esperando = false;
    window.addEventListener('scroll', () => {
      // Se agita mientras haces scroll y se calma al parar
      contenedor.classList.add('activa');
      clearTimeout(temporizadorScroll);
      temporizadorScroll = setTimeout(() => contenedor.classList.remove('activa'), 200);

      if (!esperando) {
        esperando = true;
        requestAnimationFrame(() => {
          actualizar();
          esperando = false;
        });
      }
    }, { passive: true });

    window.addEventListener('resize', actualizar);
    actualizar();   // estado inicial al cargar
  }
}
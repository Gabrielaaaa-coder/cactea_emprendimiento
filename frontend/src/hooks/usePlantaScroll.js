import { useEffect, useRef, useState } from 'react'

const limitar = (numero) => Math.min(1, Math.max(0, numero))

const FRASES_GLOBO = [
  '¡Avísame si te puedo ayudar! 🌵',
  '¿No sabes qué planta elegir?',
  'Pregúntame por cuidados 💧',
]

const CLAVE_SESION = 'cactea_chat_abierto_en_sesion'

// Hace que la plantita crezca con el scroll, se meza, salte y celebre.
// También controla el globo de sugerencias para abrir el asistente.
export function usePlantaScroll(contenedorRef) {
  const temporizadores = useRef(new Set())
  const indiceFrase = useRef(0)
  const [globoVisible, setGloboVisible] = useState(false)
  const [fraseActual, setFraseActual] = useState(FRASES_GLOBO[0])

  useEffect(() => {
    const contenedor = contenedorRef.current
    if (!contenedor) return

    const planta = contenedor.querySelector('.planta-scroll')
    const piezas = contenedor.querySelectorAll('[data-inicio]')
    const temporizadoresActivos = temporizadores.current
    let celebrado = false
    let esperando = false
    let temporizadorScroll
    let cicloGloboIniciado = false

    // Añade una clase durante un ratito (para saltos y celebraciones).
    function activarUnRato(clase, milisegundos) {
      contenedor.classList.remove(clase)
      // Reinicia la animación si ya estaba puesta.
      void contenedor.offsetWidth
      contenedor.classList.add(clase)

      const id = setTimeout(() => {
        contenedor.classList.remove(clase)
        temporizadoresActivos.delete(id)
      }, milisegundos)

      temporizadoresActivos.add(id)
    }

    // Dibuja tronco, brazos y flor según el progreso del scroll.
    function dibujar(progreso) {
      piezas.forEach((pieza) => {
        const inicio = parseFloat(pieza.dataset.inicio)
        const duracion = parseFloat(pieza.dataset.duracion || 0.12)
        let tamano = limitar((progreso - inicio) / duracion)

        if (pieza.dataset.min) {
          tamano = Math.max(parseFloat(pieza.dataset.min), tamano)
        }

        if (pieza.dataset.eje === 'y') {
          pieza.setAttribute('transform', `scale(1 ${tamano})`)
        } else {
          const giro = pieza.dataset.giro ? `rotate(${(1 - tamano) * -120}) ` : ''
          pieza.setAttribute('transform', `${giro}scale(${tamano})`)
        }
      })
    }

    function actualizar() {
      const recorrido = document.documentElement.scrollHeight - window.innerHeight
      const progreso = limitar(recorrido > 0 ? window.scrollY / recorrido : 1)
      dibujar(progreso)

      // Al llegar al final: salta y sonríe grande (una sola vez por llegada).
      if (progreso >= 0.98 && !celebrado) {
        celebrado = true
        activarUnRato('celebrando', 2500)
        activarUnRato('saltando', 600)
      } else if (progreso < 0.9) {
        celebrado = false
      }
    }

    const boton = contenedor.querySelector('.planta-fija__boton') || planta

    function alHacerClic() {
      activarUnRato('saltando', 600)
    }

    boton.addEventListener('click', alHacerClic)

    // ---------- Globo del asistente ----------
    function ocultarGlobo() {
      setGloboVisible(false)
    }

    function mostrarSiguienteGlobo() {
      const frase = FRASES_GLOBO[indiceFrase.current % FRASES_GLOBO.length]
      indiceFrase.current += 1
      setFraseActual(frase)
      setGloboVisible(true)

      const idOcultar = setTimeout(() => {
        setGloboVisible(false)
        temporizadoresActivos.delete(idOcultar)

        // Vuelve a salir cada 15 segundos.
        const idReaparecer = setTimeout(() => {
          temporizadoresActivos.delete(idReaparecer)
          if (sessionStorage.getItem(CLAVE_SESION) === '1') return
          mostrarSiguienteGlobo()
        }, 15000)
        temporizadoresActivos.add(idReaparecer)
      }, 5000)
      temporizadoresActivos.add(idOcultar)
    }

    function iniciarCicloGlobo() {
      if (cicloGloboIniciado) return
      if (sessionStorage.getItem(CLAVE_SESION) === '1') return
      cicloGloboIniciado = true

      const idInicial = setTimeout(() => {
        temporizadoresActivos.delete(idInicial)
        if (sessionStorage.getItem(CLAVE_SESION) === '1') return
        mostrarSiguienteGlobo()
      }, 4000)
      temporizadoresActivos.add(idInicial)
    }

    function alAbrirChat() {
      sessionStorage.setItem(CLAVE_SESION, '1')
      ocultarGlobo()
      cicloGloboIniciado = true
    }

    window.addEventListener('cactea:chat-abierto', alAbrirChat)
    iniciarCicloGlobo()

    let limpiarScroll = () => {}

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Sin animaciones: la mostramos ya crecida.
      dibujar(1)
    } else {
      function alHacerScroll() {
        contenedor.classList.add('activa')
        clearTimeout(temporizadorScroll)
        temporizadorScroll = setTimeout(() => contenedor.classList.remove('activa'), 200)

        if (!esperando) {
          esperando = true
          requestAnimationFrame(() => {
            actualizar()
            esperando = false
          })
        }
      }

      function alRedimensionar() {
        actualizar()
      }

      window.addEventListener('scroll', alHacerScroll, { passive: true })
      window.addEventListener('resize', alRedimensionar)
      actualizar()

      limpiarScroll = () => {
        window.removeEventListener('scroll', alHacerScroll)
        window.removeEventListener('resize', alRedimensionar)
        clearTimeout(temporizadorScroll)
      }
    }

    return () => {
      boton.removeEventListener('click', alHacerClic)
      window.removeEventListener('cactea:chat-abierto', alAbrirChat)
      limpiarScroll()
      temporizadoresActivos.forEach(clearTimeout)
      temporizadoresActivos.clear()
    }
  }, [contenedorRef])

  return { globoVisible, fraseActual }
}

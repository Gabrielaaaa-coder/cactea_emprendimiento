import { useEffect, useRef } from 'react'

// Muestra su contenido cuando entra en pantalla (polaroids y tarjetas de cuidados).
function Reveal({ as: Etiqueta = 'div', className = '', style, children, ...props }) {
  const ref = useRef(null)

  useEffect(() => {
    const elemento = ref.current
    if (!elemento) return

    // Si el navegador no soporta IntersectionObserver, mostramos todo directo.
    if (!('IntersectionObserver' in window)) {
      elemento.classList.add('visible')
      return
    }

    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            entrada.target.classList.add('visible')
            observador.unobserve(entrada.target) // solo anima una vez
          }
        })
      },
      { threshold: 0.25 },
    )

    observador.observe(elemento)
    return () => observador.disconnect()
  }, [])

  return (
    <Etiqueta ref={ref} className={className} style={style} {...props}>
      {children}
    </Etiqueta>
  )
}

export default Reveal

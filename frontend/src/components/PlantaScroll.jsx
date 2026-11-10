import { useRef } from 'react'
import { usePlantaScroll } from '../hooks/usePlantaScroll.js'

function PlantaScroll() {
  const contenedorRef = useRef(null)
  usePlantaScroll(contenedorRef)

  return (
    <div className="planta-fija" aria-hidden="true" ref={contenedorRef}>
      <svg className="planta-scroll" viewBox="0 0 120 200" focusable="false">
        {/* Degradado del cactus: el centro más claro le da forma redondeada. */}
        <defs>
          <linearGradient id="grad-cactus" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#2F9463" />
            <stop offset="0.45" stopColor="#5CC793" />
            <stop offset="1" stopColor="#3A9E6D" />
          </linearGradient>
        </defs>

        {/* Cuerpo: brazos, tronco y flor. Todo se mece suavemente. */}
        <g className="planta__cuerpo">
          <g transform="translate(48 112)">
            <path className="cactus__brazo" data-inicio="0.40" d="M0 0 H-18 V-28" />
          </g>
          <g transform="translate(72 90)">
            <path className="cactus__brazo" data-inicio="0.60" d="M0 0 H18 V-24" />
          </g>

          <g transform="translate(60 172)">
            <g data-inicio="0" data-duracion="0.7" data-eje="y" data-min="0.1">
              <rect className="cactus__tronco" x="-15" y="-122" width="30" height="122" rx="15" />
              <path className="cactus__costilla" d="M-4 -8 V-108 M6 -8 V-108" />
              <path
                className="cactus__espina"
                d="M-9 -30 l-4 -2 M9 -46 l4 -2 M-9 -66 l-4 -2 M9 -86 l4 -2 M-9 -102 l-4 -2"
              />
            </g>
          </g>

          <g transform="translate(60 46)">
            <g data-inicio="0.85" data-giro="1">
              <ellipse className="cactus__petalo" cx="0" cy="-9" rx="5" ry="8" transform="rotate(0)" />
              <ellipse className="cactus__petalo" cx="0" cy="-9" rx="5" ry="8" transform="rotate(72)" />
              <ellipse className="cactus__petalo" cx="0" cy="-9" rx="5" ry="8" transform="rotate(144)" />
              <ellipse className="cactus__petalo" cx="0" cy="-9" rx="5" ry="8" transform="rotate(216)" />
              <ellipse className="cactus__petalo" cx="0" cy="-9" rx="5" ry="8" transform="rotate(288)" />
              <circle className="cactus__centro" r="4.5" />
            </g>
          </g>
        </g>

        {/* Maceta con carita. */}
        <path className="planta__maceta" d="M34 172 H86 L80 198 H40 Z" />
        <ellipse className="planta__ojo" cx="51" cy="182" rx="2.6" ry="3" />
        <ellipse className="planta__ojo" cx="69" cy="182" rx="2.6" ry="3" />
        <circle className="planta__cachete" cx="45" cy="188" r="3.2" />
        <circle className="planta__cachete" cx="75" cy="188" r="3.2" />
        <path className="planta__boca" d="M54 187 Q60 192 66 187" />
        <path className="planta__boca planta__boca--feliz" d="M53 186 Q60 197 67 186 Z" />
      </svg>
    </div>
  )
}

export default PlantaScroll

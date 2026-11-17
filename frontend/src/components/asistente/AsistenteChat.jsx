import { useEffect, useRef, useState } from 'react'
import { WHATSAPP } from '../../constants.js'
import { preguntarAsistente } from '../../services/asistente.js'
import '../../styles/asistente.css'

const BIENVENIDA =
  '¡Hola! Soy el asistente de Cactea 🌵 Puedo ayudarte a elegir una planta, revisar precios del catálogo o resolver dudas de cuidados. ¿Qué te gustaría saber?'

const SUGERENCIAS = [
  '¿Qué planta me recomiendas si tengo poca luz?',
  '¿Cómo riego un cactus?',
  '¿Tienen plantas por menos de $5?',
]

const ERROR_GENERAL =
  'Uy, no pude responder en este momento. Intenta de nuevo en un ratito o escríbenos por WhatsApp.'

const enlaceWhatsApp = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
  'Hola, tengo una consulta sobre Cactea.'
)}`

function AsistenteChat() {
  const [abierto, setAbierto] = useState(false)
  const [texto, setTexto] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [mensajes, setMensajes] = useState([
    { id: 'bienvenida', rol: 'assistant', texto: BIENVENIDA },
  ])

  const entradaRef = useRef(null)
  const listaRef = useRef(null)
  const contadorRef = useRef(0)
  const enviandoRef = useRef(false)

  const nuevoId = () => {
    contadorRef.current += 1
    return `mensaje-${contadorRef.current}`
  }

  // Al abrir: enfocar el campo y bloquear el scroll del fondo en celular.
  useEffect(() => {
    if (!abierto) return undefined

    document.body.classList.add('asistente-con-panel')
    const temporizador = setTimeout(() => entradaRef.current?.focus(), 120)

    return () => {
      clearTimeout(temporizador)
      document.body.classList.remove('asistente-con-panel')
    }
  }, [abierto])

  // Cerrar con la tecla Escape.
  useEffect(() => {
    if (!abierto) return undefined

    const alPresionar = (evento) => {
      if (evento.key === 'Escape') setAbierto(false)
    }

    document.addEventListener('keydown', alPresionar)
    return () => document.removeEventListener('keydown', alPresionar)
  }, [abierto])

  // Bajar siempre al último mensaje o al indicador de "escribiendo...".
  useEffect(() => {
    if (!abierto || !listaRef.current) return
    listaRef.current.scrollTop = listaRef.current.scrollHeight
  }, [abierto, mensajes, enviando])

  // El textarea crece con el texto, hasta un máximo de 110 px.
  useEffect(() => {
    const entrada = entradaRef.current
    if (!entrada) return
    entrada.style.height = 'auto'
    entrada.style.height = `${Math.min(entrada.scrollHeight, 110)}px`
  }, [texto, abierto])

  async function enviarMensaje(contenido) {
    const limpio = (contenido ?? texto).trim()
    // El ref evita dos envíos si se hace doble clic antes de que React
    // vuelva a pintar el botón como deshabilitado.
    if (!limpio || enviandoRef.current) return

    enviandoRef.current = true

    // Historial corto: sin los mensajes de error.
    const historial = mensajes
      .filter((mensaje) => !mensaje.error)
      .slice(-6)
      .map((mensaje) => ({ rol: mensaje.rol, texto: mensaje.texto }))

    setMensajes((anteriores) => [
      ...anteriores,
      { id: nuevoId(), rol: 'user', texto: limpio },
    ])
    setTexto('')
    setEnviando(true)

    try {
      const datos = await preguntarAsistente(limpio, historial)

      if (!datos || typeof datos.respuesta !== 'string') {
        throw new Error('Respuesta vacía del asistente')
      }

      setMensajes((anteriores) => [
        ...anteriores,
        { id: nuevoId(), rol: 'assistant', texto: datos.respuesta.trim() },
      ])
    } catch (err) {
      // Si el servidor explicó algo útil (por ejemplo, rate limit),
      // lo mostramos. Si no, usamos un mensaje amable.
      const textoError =
        err.message && /muchos mensajes|muy largo/i.test(err.message)
          ? err.message
          : ERROR_GENERAL

      setMensajes((anteriores) => [
        ...anteriores,
        { id: nuevoId(), rol: 'assistant', texto: textoError, error: true },
      ])
    } finally {
      enviandoRef.current = false
      setEnviando(false)
      entradaRef.current?.focus()
    }
  }

  function manejarTecla(evento) {
    if (evento.key === 'Enter' && !evento.shiftKey && !evento.nativeEvent.isComposing) {
      evento.preventDefault()
      enviarMensaje(texto)
    }
  }

  return (
    <div className={`asistente${abierto ? ' asistente--abierto' : ''}`}>
      {abierto && (
        <section
          id="asistente-panel"
          className="asistente__panel"
          role="dialog"
          aria-labelledby="asistente-titulo"
          aria-busy={enviando}
        >
          <header className="asistente__cabecera">
            <span className="asistente__avatar" aria-hidden="true">
              🌵
            </span>

            <div className="asistente__identidad">
              <h2 id="asistente-titulo" className="asistente__titulo">
                Asistente de Cactea
              </h2>
              <p className="asistente__estado">En línea · respuestas al instante</p>
            </div>

            <button
              type="button"
              className="asistente__cerrar"
              onClick={() => setAbierto(false)}
              aria-label="Cerrar asistente"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </header>

          <div
            ref={listaRef}
            className="asistente__mensajes"
            role="log"
            aria-live="polite"
            aria-relevant="additions"
          >
            {mensajes.map((mensaje) => (
              <div
                key={mensaje.id}
                className={`asistente__fila ${
                  mensaje.rol === 'user' ? 'asistente__fila--usuario' : 'asistente__fila--bot'
                }`}
              >
                <div
                  className={`asistente__burbuja${
                    mensaje.error ? ' asistente__burbuja--error' : ''
                  }`}
                >
                  {mensaje.texto}

                  {mensaje.error && (
                    <a
                      className="asistente__enlace"
                      href={enlaceWhatsApp}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Escribir por WhatsApp
                    </a>
                  )}
                </div>
              </div>
            ))}

            {enviando && (
              <div className="asistente__fila asistente__fila--bot">
                <div
                  className="asistente__burbuja asistente__burbuja--escribiendo"
                  role="status"
                  aria-label="El asistente está escribiendo"
                >
                  <span className="asistente__punto" />
                  <span className="asistente__punto" />
                  <span className="asistente__punto" />
                </div>
              </div>
            )}
          </div>

          {mensajes.length === 1 && !enviando && (
            <div className="asistente__sugerencias" aria-label="Preguntas sugeridas">
              {SUGERENCIAS.map((sugerencia) => (
                <button
                  key={sugerencia}
                  type="button"
                  className="asistente__sugerencia"
                  onClick={() => enviarMensaje(sugerencia)}
                >
                  {sugerencia}
                </button>
              ))}
            </div>
          )}

          <form
            className="asistente__form"
            onSubmit={(evento) => {
              evento.preventDefault()
              enviarMensaje(texto)
            }}
          >
            <textarea
              ref={entradaRef}
              className="asistente__entrada"
              rows={1}
              maxLength={500}
              value={texto}
              onChange={(evento) => setTexto(evento.target.value)}
              onKeyDown={manejarTecla}
              placeholder="Escribe tu pregunta..."
              aria-label="Mensaje para el asistente"
            />

            <button
              type="submit"
              className="asistente__enviar"
              disabled={!texto.trim() || enviando}
              aria-label="Enviar mensaje"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 2 11 13" />
                <path d="M22 2 15 22l-4-9-9-4 20-7Z" />
              </svg>
            </button>
          </form>

          <p className="asistente__nota">
            La IA puede equivocarse. Confirma precios y stock por WhatsApp.
          </p>
        </section>
      )}

      <button
        type="button"
        className="asistente__boton"
        onClick={() => setAbierto((estado) => !estado)}
        aria-expanded={abierto}
        aria-controls="asistente-panel"
        aria-label={abierto ? 'Cerrar asistente de Cactea' : 'Abrir asistente de Cactea'}
      >
        {abierto ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.5 8.9 8.9 0 0 1-3.6-.8L3 21l1.8-5.6A8.5 8.5 0 1 1 21 11.5Z" />
            <path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01" />
          </svg>
        )}
      </button>
    </div>
  )
}

export default AsistenteChat

import { useState } from 'react'
import { enviarMensaje } from '../services/mensajes.js'

const datosIniciales = {
  nombre: '',
  correo: '',
  telefono: '',
  asunto: '',
  mensaje: '',
}

// Comprueba que el correo tenga forma de "nombre@dominio.com".
const correoValido = (correo) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)

// Maneja el formulario de contacto: campos, validación, envío y confirmación.
export function useContacto() {
  const [datos, setDatos] = useState(datosIniciales)
  const [estado, setEstado] = useState('')
  const [error, setError] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)

  const cambiar = (evento) => {
    const { name, value } = evento.target
    setDatos((actuales) => ({ ...actuales, [name]: value }))
    setEstado('') // al escribir de nuevo, limpiamos el aviso anterior
    setError(false)
  }

  const enviar = async (evento) => {
    evento.preventDefault()
    if (enviando) return // evita enviar dos veces con doble clic

    // Quitamos los espacios sobrantes antes de validar y enviar.
    const limpios = {
      nombre: datos.nombre.trim(),
      correo: datos.correo.trim(),
      telefono: datos.telefono.trim(),
      asunto: datos.asunto,
      mensaje: datos.mensaje.trim(),
    }

    // El teléfono es opcional; el resto es obligatorio.
    if (!limpios.nombre || !limpios.correo || !limpios.asunto || !limpios.mensaje) {
      setError(true)
      setEstado('Por favor completa los campos obligatorios.')
      return
    }

    if (!correoValido(limpios.correo)) {
      setError(true)
      setEstado('Escribe un correo válido (ejemplo: nombre@dominio.com).')
      return
    }

    setEnviando(true)
    setError(false)
    setEstado('Enviando...')

    try {
      await enviarMensaje(limpios)
      setEnviado(true) // muestra la tarjeta de confirmación
      setDatos(datosIniciales)
      setEstado('')
    } catch (err) {
      setError(true)
      setEstado(err.message)
    } finally {
      setEnviando(false)
    }
  }

  // Vuelve a mostrar el formulario vacío después de enviar.
  const enviarOtro = () => {
    setEnviado(false)
    setEstado('')
    setError(false)
  }

  return { datos, estado, error, enviando, enviado, cambiar, enviar, enviarOtro }
}

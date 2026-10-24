// =========================================================
// CACTEA · contacto.js
// Toma los datos del formulario y los manda al servidor
// (POST /api/mensajes) para guardarlos en MongoDB.
// =========================================================
const formulario = document.getElementById('form-contacto');
const estado = document.getElementById('estado-contacto');

if (formulario) {
  formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault(); // evita que la página se recargue

    const datos = {
      nombre: formulario.nombre.value.trim(),
      correo: formulario.correo.value.trim(),
      telefono: formulario.telefono.value.trim(),
      asunto: formulario.asunto.value,
      mensaje: formulario.mensaje.value.trim(),
    };

    // Validación rápida antes de molestar al servidor (el teléfono es opcional)
    if (!datos.nombre || !datos.correo || !datos.asunto || !datos.mensaje) {
      estado.textContent = 'Por favor completa los campos obligatorios.';
      return;
    }

    const boton = formulario.querySelector('button[type="submit"]');
    boton.disabled = true;
    estado.textContent = 'Enviando...';

    try {
      const respuesta = await fetch('/api/mensajes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      });

      if (!respuesta.ok) {
        const error = await respuesta.json().catch(() => ({}));
        throw new Error(error.error || 'No se pudo enviar el mensaje.');
      }

      estado.textContent = '¡Gracias! Recibimos tu mensaje y te responderemos pronto. 🌵';
      formulario.reset();
    } catch (err) {
      estado.textContent = err.message;
    } finally {
      boton.disabled = false;
    }
  });
}
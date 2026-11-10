import ContactoForm from '../contacto/ContactoForm.jsx'
import DatosContacto from '../contacto/DatosContacto.jsx'

function Contacto() {
  return (
    <section id="contacto" className="contacto">
      <h2>Contáctanos</h2>

      <div className="contacto__tarjeta">
        <div className="contacto__panel">
          <h3>Hablemos</h3>
          <p className="contacto__intro">
            ¿Tienes una duda o quieres un pedido especial? Escríbenos y te respondemos pronto.
          </p>
          <DatosContacto />
        </div>

        <div className="contacto__formulario">
          <ContactoForm />
        </div>
      </div>
    </section>
  )
}

export default Contacto

import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AdminLayout from './admin/AdminLayout.jsx'
import LoginAdmin from './admin/LoginAdmin.jsx'
import MensajesAdmin from './admin/MensajesAdmin.jsx'
import ProductosAdmin from './admin/ProductosAdmin.jsx'
import RutaProtegida from './admin/RutaProtegida.jsx'
import { SesionProvider } from './admin/SesionContext.jsx'
import InicioPage from './pages/InicioPage.jsx'

function App() {
  // La clase "js" activa las animaciones de aparición definidas en global.css.
  useEffect(() => {
    document.documentElement.classList.add('js')
  }, [])

  return (
    <SesionProvider>
      <BrowserRouter>
        <Routes>
          {/* Sitio público */}
          <Route path="/" element={<InicioPage />} />

          {/* Login del panel */}
          <Route path="/admin/login" element={<LoginAdmin />} />

          {/* Panel protegido: sin token, RutaProtegida manda al login */}
          <Route element={<RutaProtegida />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="mensajes" replace />} />
              <Route path="mensajes" element={<MensajesAdmin />} />
              <Route path="productos" element={<ProductosAdmin />} />
            </Route>
          </Route>

          {/* Cualquier dirección desconocida vuelve al inicio */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </SesionProvider>
  )
}

export default App

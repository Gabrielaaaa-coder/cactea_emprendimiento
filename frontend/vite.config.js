import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Configuración de Vite para Cactea
export default defineConfig({
  plugins: [react()],
  server: {
    // En desarrollo, todo lo que empiece con /api se envía al backend de Express.
    // Así el frontend puede seguir usando rutas relativas como /api/productos.
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})

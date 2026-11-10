# Cactea · Frontend

Sitio público y panel de administración de Cactea, hecho con React + Vite.

## Comandos

```bash
npm install     # instalar dependencias
npm run dev     # servidor de desarrollo con recarga automática
npm run build   # genera dist/ para producción
npm run lint    # revisa el código
```

## Estructura

```
src/
├── components/   → secciones del sitio público (portada, catálogo, contacto...)
├── pages/        → páginas completas
├── admin/        → panel de administración (rutas protegidas)
├── hooks/        → lógica reutilizable
├── services/     → llamadas a la API
├── styles/       → global.css (sitio público) y admin.css (panel)
└── utils/        → funciones auxiliares (precios, imágenes)
```

- Las imágenes y fuentes están en `public/img` y `public/fonts`.
- En desarrollo, Vite envía las llamadas `/api` al backend en `http://localhost:3000` (ver `vite.config.js`).
- En producción, Express sirve esta carpeta `dist/`, así que hay que ejecutar `npm run build` antes de arrancar el backend.

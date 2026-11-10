# Cactea · Vivero de suculentas y cactus

Sitio web de Cactea con catálogo de productos, pedido por WhatsApp, formulario de
contacto y panel de administración.

- **Frontend:** React + Vite (`frontend/`)
- **Backend:** Node + Express + Mongoose (`backend/`)
- **Base de datos:** MongoDB Atlas

## Estructura

```
rp_suculentas/
├── backend/
│   ├── config/          → conexión con MongoDB (db.js)
│   ├── middleware/      → guardia de sesión (JWT)
│   ├── models/          → Producto y Mensaje
│   ├── routes/          → auth (login) y admin (panel)
│   ├── app.js           → servidor Express
│   ├── .env             → credenciales reales (NO se sube a git)
│   └── package.json
│
├── frontend/
│   ├── public/          → imágenes y fuentes
│   ├── src/
│   │   ├── admin/       → login y panel protegido
│   │   ├── components/  → secciones y piezas del sitio
│   │   ├── data/        → contenido de "Cuidados"
│   │   ├── hooks/       → lógica reutilizable
│   │   ├── pages/       → página de inicio
│   │   ├── services/    → llamadas a la API
│   │   ├── styles/      → global.css y admin.css
│   │   └── utils/       → precios e imágenes
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── .env.example         → plantilla de variables de entorno
├── .gitignore
└── README.md
```

## Requisitos

- Node.js 20 o superior
- Una base de datos en MongoDB Atlas

## Instalación

Instala las dependencias de cada parte por separado:

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Variables de entorno

1. Copia la plantilla:

   ```bash
   cp .env.example backend/.env
   ```

2. Completa `backend/.env` con tus datos reales:

   ```env
   PORT=3000
   MONGODB_URI=mongodb+srv://usuario:clave@cluster.mongodb.net/cactea
   ADMIN_USER=admin
   ADMIN_PASS_HASH=$2b$10$...
   JWT_SECRET=una-clave-larga-y-aleatoria
   ```

3. Para generar el hash de la contraseña del administrador:

   ```bash
   cd backend
   node -e "console.log(require('bcryptjs').hashSync('tu-clave', 10))"
   ```

> `.env` está en `.gitignore` y nunca debe subirse al repositorio.

## Arrancar en desarrollo

Abre dos terminales.

**Terminal 1 · Backend** (puerto 3000):

```bash
cd backend
npm run dev
```

**Terminal 2 · Frontend** (Vite, normalmente puerto 5173):

```bash
cd frontend
npm run dev
```

Vite envía automáticamente las llamadas `/api` al backend en `http://localhost:3000`
(ver `frontend/vite.config.js`).

## Producción

1. Genera el frontend:

   ```bash
   cd frontend
   npm run build
   ```

2. Arranca el backend. Express sirve la carpeta `frontend/dist` y también responde
   las rutas de React Router:

   ```bash
   cd backend
   npm start
   ```

## Rutas principales de la API

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/api/productos` | Lista de productos (acepta `?categoria=cactus`) |
| GET | `/api/productos/:id` | Un producto |
| POST | `/api/mensajes` | Guarda un mensaje del formulario |
| POST | `/api/login` | Login del administrador (devuelve JWT) |
| GET | `/api/admin/mensajes` | Mensajes (requiere token) |
| PATCH | `/api/admin/mensajes/:id` | Marcar leído / no leído |
| DELETE | `/api/admin/mensajes/:id` | Borrar mensaje |
| POST | `/api/admin/productos` | Crear producto |
| PUT | `/api/admin/productos/:id` | Editar producto |
| DELETE | `/api/admin/productos/:id` | Borrar producto |

## Panel de administración

- Login: `http://localhost:5173/admin/login`
- Mensajes: `/admin/mensajes`
- Productos: `/admin/productos`

El token se guarda en `sessionStorage` y dura mientras la pestaña esté abierta.
Si vence, el panel vuelve automáticamente al login.

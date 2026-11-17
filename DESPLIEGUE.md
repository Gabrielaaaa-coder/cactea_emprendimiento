# Despliegue de Cactea

El proyecto corre como **un solo servicio Node**: Express sirve la API y el frontend compilado.

## 1. Subir el código

Conecta el repositorio a tu proveedor de Node (por ejemplo, **Render** → *New Web Service*) y usa la raíz del repositorio como directorio de trabajo.

## 2. Comandos del servicio

| Campo | Valor |
| --- | --- |
| Build command | `npm run build` |
| Start command | `npm start` |
| Runtime | Node.js 20.19+ o 22.12+ |

`npm run build` instala las dependencias de `backend/` y `frontend/` y genera `frontend/dist`. `npm start` arranca Express en el puerto que indique `PORT`.

## 3. Variables de entorno

Copia al panel del hosting los nombres de [`.env.example`](.env.example) con sus valores reales:

`PORT`, `MONGODB_URI` (o `MONGO_URI`), `ADMIN_USER`, `ADMIN_PASS_HASH`, `JWT_SECRET`, `IA_API_KEY`, `IA_API_URL`, `IA_MODELO`, `CORS_ORIGIN`.

- `MONGODB_URI` es el nombre principal; `MONGO_URI` queda como alias compatible.
- `ADMIN_PASS_HASH` es un hash bcrypt de la contraseña, no la contraseña en texto plano.
- `CORS_ORIGIN` es opcional; si lo dejas vacío, Express responde a cualquier origen. Si publicas el frontend en otro dominio, pon aquí ese dominio.

En local, copia `.env.example` a `backend/.env` y completa los valores. Ese archivo está ignorado por Git.

## 4. MongoDB Atlas

En **Network Access**, permite la IP saliente del servicio (o `0.0.0.0/0` de forma temporal si el proveedor no da IP fija) y comprueba que el usuario de base de datos tenga permisos de lectura y escritura.

## 5. Verificación

Abre la URL pública del servicio y comprueba que:

- La portada de Cactea carga correctamente.
- `GET /api/productos` responde JSON con el catálogo.

La clave de Gemini y el resto de secretos viven solo en variables de entorno; nunca en el repositorio.

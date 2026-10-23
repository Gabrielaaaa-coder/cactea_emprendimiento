# AGENTS.md

Cactea is a small storefront (HTML/CSS/JS) plus an Express JSON API. User-facing copy and code comments are in Spanish; keep new copy and comments in Spanish.

## What is actually served

- `public/` is the live frontend. `backend/app.js` serves it statically and exposes the API on port 3000.
- Root `index.html`, `styles.css`, and `js/main.js` are an older duplicate: no filters, no cart, and no API fetch. Edit `public/` for site behavior; the root and `public/` styles/scripts are not equivalent.
- `public/index.html` loads `api.js` then `app.js` as classic `defer` scripts. `app.js` depends on globals (`WHATSAPP`, `obtenerProductos`) defined in `api.js`, so preserve that order unless converting both to modules.
- The API base URL is hardcoded to `http://localhost:3000/api` in `public/api.js`; run the API on port 3000.

## Run and verify

- Install and run from `backend/`; the root package has no start script and does not contain `express`/`cors`.
- `backend/app.js` reads and writes the root `productos.json`. Keep that file as the single source of product data; POSTs persist there.
- Expected flow: `cd backend && npm install && npm start` (or `npm run dev`), open `http://localhost:3000`, then check `curl http://localhost:3000/api/productos` and `curl "http://localhost:3000/api/productos?categoria=cactus"`.
- There are no tests, lint, build, or CI steps. Verification is manual in the browser plus `curl`.

## Data and assets

- Product fields: `id`, `nombre`, `categoria` (`suculentas` | `cactus` | `regalos`), `descripcion`, `precio` (number), `imagen`, `destacado`.
- API surface: `GET /api/productos` (optional `?categoria=`), `GET /api/productos/:id`, `POST /api/productos`. There is no update or delete.
- Only `img/logo-cactea.png` exists. `public/index.html` and the seed data reference `portada.jpg` and `producto-*.jpg` that are missing, so broken images are expected unless added.
- `routes/productos.js`, `models/Producto.js`, and `seed.js` are empty, and the root `mongoose`/`dotenv` dependencies are unused. This is a JSON-file API, not a Mongo app yet; do not add database wiring unless asked.

## Git

- `public/` contains its own `.git` clone of the same remote, while the root repo also tracks the files under `public/`. Commit from the repo root only and avoid `git -C public`, whose status is divergent and unrelated.
- `.gitignore` covers `node_modules/` and `.env`.

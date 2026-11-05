// =========================================================
// CACTEA · public/admin.js
// Login, mensajes y productos del panel de administrador.
// =========================================================
const API = '/api';
let token = sessionStorage.getItem('cactea_token');

const $ = (id) => document.getElementById(id);

// Crea elementos de forma segura (textContent, nunca innerHTML)
function el(tag, props = {}, ...hijos) {
  const e = document.createElement(tag);
  Object.assign(e, props);
  hijos.forEach((h) => e.append(h));
  return e;
}

// Pide algo al servidor mandando el token en el formato Bearer
async function pedir(ruta, opciones = {}) {
  const res = await fetch(API + ruta, {
    ...opciones,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: 'Bearer ' + token } : {}),
    },
  });
  const datos = await res.json().catch(() => ({}));
  if (res.status === 401 && ruta !== '/login') cerrarSesion();
  if (!res.ok) throw new Error(datos.error || 'Algo salió mal.');
  return datos;
}

function avisar(texto) {
  const a = $('aviso');
  a.textContent = texto;
  a.hidden = false;
  setTimeout(() => (a.hidden = true), 3000);
}

// ---------- LOGIN / SESIÓN ----------
function mostrarPanel() {
  $('vista-login').hidden = true;
  $('vista-panel').hidden = false;
  cargarMensajes();
  cargarProductos();
}

function cerrarSesion() {
  token = null;
  sessionStorage.removeItem('cactea_token');
  $('vista-panel').hidden = true;
  $('vista-login').hidden = false;
}

$('form-login').addEventListener('submit', async (e) => {
  e.preventDefault();
  $('login-error').textContent = '';
  try {
    const { token: t } = await pedir('/login', {
      method: 'POST',
      body: JSON.stringify({ usuario: $('usuario').value, clave: $('clave').value }),
    });
    token = t;
    sessionStorage.setItem('cactea_token', t);
    $('clave').value = '';
    mostrarPanel();
  } catch (err) {
    $('login-error').textContent = err.message;
  }
});

$('btn-salir').addEventListener('click', cerrarSesion);

// ---------- PESTAÑAS ----------
document.querySelectorAll('.tab').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach((b) => b.classList.remove('activa'));
    btn.classList.add('activa');
    $('tab-mensajes').hidden = btn.dataset.tab !== 'mensajes';
    $('tab-productos').hidden = btn.dataset.tab !== 'productos';
  });
});

// ---------- MENSAJES ----------
async function cargarMensajes() {
  try {
    const mensajes = await pedir('/admin/mensajes');
    const lista = $('lista-mensajes');
    lista.replaceChildren();
    $('msj-vacio').hidden = mensajes.length > 0;

    mensajes.forEach((m) => {
      const fecha = new Date(m.createdAt).toLocaleString('es-EC');
      const tarjeta = el(
        'article',
        { className: 'tarjeta mensaje' + (m.leido ? '' : ' nuevo') },
        el('h3', { textContent: `${m.nombre} · ${m.asunto}` }),
        el('small', { textContent: `${m.correo}${m.telefono ? ' · ' + m.telefono : ''} · ${fecha}` }),
        el('p', { textContent: m.mensaje }),
        el(
          'div',
          { className: 'fila' },
          el('button', {
            className: 'btn-sec',
            textContent: m.leido ? 'Marcar como no leído' : 'Marcar como leído',
            onclick: async () => {
              await pedir('/admin/mensajes/' + m._id, {
                method: 'PATCH',
                body: JSON.stringify({ leido: !m.leido }),
              });
              cargarMensajes();
            },
          }),
          el('button', {
            className: 'btn-peligro',
            textContent: 'Borrar',
            onclick: async () => {
              if (!confirm('¿Borrar este mensaje?')) return;
              await pedir('/admin/mensajes/' + m._id, { method: 'DELETE' });
              cargarMensajes();
            },
          })
        )
      );
      lista.append(tarjeta);
    });
  } catch (err) {
    avisar(err.message);
  }
}

// ---------- PRODUCTOS ----------
async function cargarProductos() {
  try {
    const datos = await fetch(API + '/productos').then((r) => r.json());
    const productos = Array.isArray(datos) ? datos : datos.productos || [];
    const lista = $('lista-productos');
    lista.replaceChildren();

    productos.forEach((p) => {
      lista.append(
        el(
          'article',
          { className: 'tarjeta producto' },
          el('h3', { textContent: `${p.nombre}${p.destacado ? ' ⭐' : ''}` }),
          el('small', { textContent: `${p.categoria} · $${Number(p.precio).toFixed(2)}` }),
          el('p', { textContent: p.descripcion }),
          el(
            'div',
            { className: 'fila' },
            el('button', { className: 'btn-sec', textContent: 'Editar', onclick: () => editar(p) }),
            el('button', {
              className: 'btn-peligro',
              textContent: 'Borrar',
              onclick: async () => {
                if (!confirm(`¿Borrar "${p.nombre}"?`)) return;
                try {
                  await pedir('/admin/productos/' + p._id, { method: 'DELETE' });
                  cargarProductos();
                } catch (err) {
                  avisar(err.message);
                }
              },
            })
          )
        )
      );
    });
  } catch (err) {
    avisar('No se pudieron cargar los productos.');
  }
}

function editar(p) {
  $('titulo-form').textContent = 'Editar producto';
  $('p-id').value = p._id;
  $('p-nombre').value = p.nombre;
  $('p-categoria').value = p.categoria;
  $('p-precio').value = p.precio;
  $('p-imagen').value = p.imagen || '';
  $('p-descripcion').value = p.descripcion || '';
  $('p-destacado').checked = !!p.destacado;
  $('btn-cancelar').hidden = false;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function limpiarFormulario() {
  $('form-producto').reset();
  $('p-id').value = '';
  $('titulo-form').textContent = 'Nuevo producto';
  $('btn-cancelar').hidden = true;
}

$('btn-cancelar').addEventListener('click', limpiarFormulario);

$('form-producto').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = $('p-id').value;
  const cuerpo = {
    nombre: $('p-nombre').value,
    categoria: $('p-categoria').value,
    precio: Number($('p-precio').value),
    imagen: $('p-imagen').value || undefined,
    descripcion: $('p-descripcion').value,
    destacado: $('p-destacado').checked,
  };
  try {
    await pedir(id ? '/admin/productos/' + id : '/admin/productos', {
      method: id ? 'PUT' : 'POST',
      body: JSON.stringify(cuerpo),
    });
    avisar(id ? 'Producto actualizado 🌿' : 'Producto creado 🌱');
    limpiarFormulario();
    cargarProductos();
  } catch (err) {
    avisar(err.message);
  }
});

// ---------- INICIO ----------
if (token) mostrarPanel();
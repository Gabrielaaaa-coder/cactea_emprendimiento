// Las rutas guardadas en MongoDB son del tipo "img/producto-1.jpg".
// Les añadimos la barra inicial para que funcionen desde cualquier ruta de React.
export function rutaImagen(imagen) {
  if (!imagen) return '/img/producto-1.jpg'
  if (/^https?:\/\//i.test(imagen)) return imagen
  return imagen.startsWith('/') ? imagen : `/${imagen}`
}

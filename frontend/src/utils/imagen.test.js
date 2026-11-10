import assert from 'node:assert/strict'
import { test } from 'node:test'
import { rutaImagen } from './imagen.js'

test('usa la imagen por defecto si no hay ruta', () => {
  assert.equal(rutaImagen(), '/img/producto-1.jpg')
  assert.equal(rutaImagen(''), '/img/producto-1.jpg')
})

test('agrega la barra inicial a las rutas relativas', () => {
  assert.equal(rutaImagen('img/producto-1.jpg'), '/img/producto-1.jpg')
})

test('respeta las rutas que ya empiezan con barra', () => {
  assert.equal(rutaImagen('/img/producto-2.jpg'), '/img/producto-2.jpg')
})

test('deja intactas las direcciones http y https', () => {
  assert.equal(
    rutaImagen('https://ejemplo.com/foto.jpg'),
    'https://ejemplo.com/foto.jpg'
  )
  assert.equal(
    rutaImagen('http://ejemplo.com/foto.jpg'),
    'http://ejemplo.com/foto.jpg'
  )
})

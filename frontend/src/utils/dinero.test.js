import assert from 'node:assert/strict'
import { test } from 'node:test'
import { dinero } from './dinero.js'

test('formatea un precio con dos decimales', () => {
  assert.equal(dinero(2.5), '$2.50')
})

test('agrega los decimales que faltan', () => {
  assert.equal(dinero(10), '$10.00')
})

test('acepta números escritos como texto', () => {
  assert.equal(dinero('3.9'), '$3.90')
})

test('formatea el cero', () => {
  assert.equal(dinero(0), '$0.00')
})

const assert = require('node:assert/strict');
const { test } = require('node:test');
const Mensaje = require('./Mensaje.js');

const base = {
  nombre: 'Ana',
  correo: 'ana@ejemplo.com',
  asunto: 'consulta',
  mensaje: 'Hola, quiero saber el precio de una suculenta.',
};

test('acepta un mensaje con un correo válido', () => {
  const mensaje = new Mensaje(base);
  assert.equal(mensaje.validateSync(), undefined);
});

test('rechaza un correo sin formato válido', () => {
  const mensaje = new Mensaje({ ...base, correo: 'ana-sin-arroba' });
  const error = mensaje.validateSync();

  assert.ok(error);
  assert.ok(error.errors.correo);
});

test('exige nombre, correo, asunto y mensaje', () => {
  const mensaje = new Mensaje({});
  const error = mensaje.validateSync();

  assert.ok(error);
  assert.ok(error.errors.nombre);
  assert.ok(error.errors.correo);
  assert.ok(error.errors.asunto);
  assert.ok(error.errors.mensaje);
});

test('rechaza un asunto fuera de la lista permitida', () => {
  const mensaje = new Mensaje({ ...base, asunto: 'inventado' });
  const error = mensaje.validateSync();

  assert.ok(error);
  assert.ok(error.errors.asunto);
});

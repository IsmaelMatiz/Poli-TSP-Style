const { test } = require('node:test');
const assert = require('node:assert/strict');

const {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails
} = require('@firebase/rules-unit-testing');

const {
  doc,
  getDoc,
  setDoc,
  deleteDoc
} = require('firebase/firestore');

test('Seguridad de productos', async () => {

  const entorno = await initializeTestEnvironment({
    projectId: 'demo-polistyle',
    firestore: {
      host: '127.0.0.1',
      port: 8080
    }
  });

  try {
    const usuario = entorno.unauthenticatedContext();
    const db = usuario.firestore();

    const producto = doc(db, 'productos', 'producto1');

    // Prueba 1: permitir consultar productos
    await assertSucceeds(getDoc(producto));
    console.log('Prueba 1: lectura permitida');

    // Prueba 2: impedir modificar productos
    await assertFails(setDoc(producto, {
      nombre: 'Camiseta',
      precio: 50000
    }));
    console.log('Prueba 2: escritura bloqueada');

  } finally {
    await entorno.cleanup();
  }
});
test('Seguridad de carritos', async () => {

  const entorno = await initializeTestEnvironment({
    projectId: 'demo-polistyle',
    firestore: {
      host: '127.0.0.1',
      port: 8080
    }
  });

  try {
    const usuario1 = entorno.authenticatedContext('usuario1');
    const usuario2 = entorno.authenticatedContext('usuario2');

    const db1 = usuario1.firestore();
    const db2 = usuario2.firestore();

    const carrito = doc(db1, 'carritos', 'usuario1');
// El propietario no puede guardar items como texto
await assertFails(
  setDoc(carrito, {
    items: 'camiseta'
  })
);
console.log('Carrito: formato incorrecto bloqueado');
    // El propietario puede crear su carrito
    await assertSucceeds(setDoc(carrito, {
      items: []
    }));
    console.log('Carrito: creación permitida al propietario');

    // Otro usuario no puede consultar ese carrito
    await assertFails(
      getDoc(doc(db2, 'carritos', 'usuario1'))
    );
    console.log('Carrito: lectura ajena bloqueada');

    // Otro usuario no puede modificarlo
    await assertFails(
      setDoc(doc(db2, 'carritos', 'usuario1'), {
        items: []
      })
    );
    console.log('Carrito: escritura ajena bloqueada');

    // El propietario puede eliminar su carrito
    await assertSucceeds(deleteDoc(carrito));
    console.log('Carrito: eliminación permitida al propietario');

  } finally {
    await entorno.cleanup();
  }
});
test('Seguridad de pedidos', async () => {

  const entorno = await initializeTestEnvironment({
    projectId: 'demo-polistyle',
    firestore: {
      host: '127.0.0.1',
      port: 8080
    }
  });

  try {
    const usuario1 = entorno.authenticatedContext('usuario1');
    const usuario2 = entorno.authenticatedContext('usuario2');

    const db1 = usuario1.firestore();
    const db2 = usuario2.firestore();

    const pedido = doc(db1, 'pedidos', 'pedido1');

    // Crear un pedido de prueba sin saltarnos la seguridad
    await entorno.withSecurityRulesDisabled(async (contexto) => {
      await setDoc(
        doc(contexto.firestore(), 'pedidos', 'pedido1'),
        {
          usuarioId: 'usuario1',
          total: 50000
        }
      );
    });

    // El propietario puede consultar su pedido
    await assertSucceeds(getDoc(pedido));
    console.log('Pedido: lectura del propietario permitida');

    // Otro usuario no puede consultar el pedido
    await assertFails(
      getDoc(doc(db2, 'pedidos', 'pedido1'))
    );
    console.log('Pedido: lectura ajena bloqueada');

    // El cliente no puede crear pedidos directamente
    await assertFails(
      setDoc(doc(db1, 'pedidos', 'pedido2'), {
        usuarioId: 'usuario1',
        total: 30000
      })
    );
    console.log('Pedido: creación directa bloqueada');

    // El propietario tampoco puede eliminar pedidos
    await assertFails(deleteDoc(pedido));
    console.log('Pedido: eliminación bloqueada');

  } finally {
    await entorno.cleanup();
  }
});
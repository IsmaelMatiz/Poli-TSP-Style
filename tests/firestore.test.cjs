
const { test } = require('node:test');

const {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails
} = require('@firebase/rules-unit-testing');

const {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  updateDoc
} = require('firebase/firestore');

async function crearEntorno() {
  return initializeTestEnvironment({
    projectId: 'demo-polistyle',
    firestore: {
      host: '127.0.0.1',
      port: 8080
    }
  });
}

// PRUEBA 1: PRODUCTOS
test('Seguridad de productos', async () => {
  const entorno = await crearEntorno();

  try {
    const db = entorno.unauthenticatedContext().firestore();
    const producto = doc(db, 'products', 'producto1');

    await assertSucceeds(getDoc(producto));
    console.log('Productos: lectura pública permitida');

    await assertFails(setDoc(producto, {
      nombre: 'Camiseta',
      precio: 50000
    }));
    console.log('Productos: escritura bloqueada');
  } finally {
    await entorno.cleanup();
  }
});

// PRUEBA 2: CARRITOS
test('Seguridad de carritos', async () => {
  const entorno = await crearEntorno();

  try {
    const db1 = entorno.authenticatedContext('usuario1').firestore();
    const db2 = entorno.authenticatedContext('usuario2').firestore();
    const dbAnonimo = entorno.unauthenticatedContext().firestore();

    const ruta = ['users', 'usuario1', 'cart', 'carrito1'];
    const carrito = doc(db1, ...ruta);

    await assertFails(setDoc(carrito, {
      items: 'camiseta'
    }));
    console.log('Carritos: formato incorrecto bloqueado');

    await assertSucceeds(setDoc(carrito, {
      items: []
    }));
    console.log('Carritos: creación del propietario permitida');

    await assertSucceeds(getDoc(carrito));
    console.log('Carritos: lectura del propietario permitida');

    await assertFails(getDoc(doc(db2, ...ruta)));
    console.log('Carritos: lectura ajena bloqueada');

    await assertFails(setDoc(doc(db2, ...ruta), {
      items: []
    }));
    console.log('Carritos: escritura ajena bloqueada');

    await assertFails(getDoc(doc(dbAnonimo, ...ruta)));
    console.log('Carritos: lectura anónima bloqueada');

    await assertSucceeds(deleteDoc(carrito));
    console.log('Carritos: eliminación del propietario permitida');
  } finally {
    await entorno.cleanup();
  }
});

// PRUEBA 3: PEDIDOS
test('Seguridad de pedidos', async () => {
  const entorno = await crearEntorno();

  try {
    const db1 = entorno.authenticatedContext('usuario1').firestore();
    const db2 = entorno.authenticatedContext('usuario2').firestore();
    const dbAnonimo = entorno.unauthenticatedContext().firestore();

    const pedido = doc(db1, 'orders', 'pedido1');

    await assertSucceeds(setDoc(pedido, {
      usuarioId: 'usuario1',
      total: 50000
    }));
    console.log('Pedidos: creación propia permitida');

    await assertSucceeds(getDoc(pedido));
    console.log('Pedidos: lectura propia permitida');

    await assertFails(getDoc(doc(db2, 'orders', 'pedido1')));
    console.log('Pedidos: lectura ajena bloqueada');

    await assertFails(setDoc(doc(db2, 'orders', 'pedido2'), {
      usuarioId: 'usuario1',
      total: 30000
    }));
    console.log('Pedidos: creación a nombre de otro bloqueada');

    await assertFails(setDoc(doc(dbAnonimo, 'orders', 'pedido3'), {
      usuarioId: 'usuario1',
      total: 30000
    }));
    console.log('Pedidos: creación anónima bloqueada');

    await assertFails(updateDoc(pedido, {
      total: 1000
    }));
    console.log('Pedidos: modificación bloqueada');

    await assertFails(deleteDoc(pedido));
    console.log('Pedidos: eliminación bloqueada');
  } finally {
    await entorno.cleanup();
  }
});

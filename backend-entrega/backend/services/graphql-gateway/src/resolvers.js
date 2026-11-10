const fetch = require('node-fetch');

const ORDERS_URL = process.env.ORDERS_SERVICE_URL || 'http://orders:8082';
const CLIENTS_URL = process.env.CLIENTS_SERVICE_URL || 'http://clients:8083';
const INVENTORY_URL = process.env.INVENTORY_SERVICE_URL || 'http://inventory:8081';

const resolvers = {
  obtenerPedidoResumen: async ({ pedidoId }, req) => {
    const orderRes = await fetch(`${ORDERS_URL}/internal/orders/${pedidoId}`);
    const orderData = await orderRes.json();
    const clientRes = await fetch(`${CLIENTS_URL}/internal/clients/${orderData.cliente_id}`);
    const clientData = await clientRes.json();
    const itemsConProducto = await Promise.all(
      orderData.items.map(async (item) => {
        const prodRes = await fetch(`${INVENTORY_URL}/products/${item.producto_id}`);
        const prodData = await prodRes.json();
        return { id: item.id, cantidad: item.cantidad, subtotal: prodData.precio * item.cantidad, producto: prodData };
      })
    );
    return {
      id: orderData.id, estado: orderData.estado,
      total: itemsConProducto.reduce((acc, i) => acc + i.subtotal, 0),
      cliente: clientData, items: itemsConProducto, fechaCreacion: orderData.fecha_creacion
    };
  }
};

module.exports = resolvers;

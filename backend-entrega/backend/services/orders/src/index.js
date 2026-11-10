const express = require('express');
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 8082;

const carts = {};
const orders = {};
let counter = 1;

app.get('/cart', (req, res) => {
  const userId = req.headers['x-user-id'];
  if (!userId) return res.status(401).json({ error: "No autorizado" });
  res.json({ cliente_id: userId, items: carts[userId] || [] });
});

app.post('/cart', (req, res) => {
  const userId = req.headers['x-user-id'];
  const { producto_id, cantidad } = req.body;
  if (!userId) return res.status(401).json({ error: "No autorizado" });
  if (!producto_id || !cantidad || cantidad < 1) return res.status(400).json({ error: "Datos invalidos" });
  if (!carts[userId]) carts[userId] = [];
  const idx = carts[userId].findIndex(i => i.producto_id === parseInt(producto_id));
  if (idx >= 0) carts[userId][idx].cantidad += parseInt(cantidad);
  else carts[userId].push({ id: counter++, producto_id: parseInt(producto_id), cantidad: parseInt(cantidad) });
  res.status(201).json({ cart: carts[userId] });
});

app.put('/cart/:itemId', (req, res) => {
  const userId = req.headers['x-user-id'];
  const itemId = parseInt(req.params.itemId);
  const { cantidad } = req.body;
  if (!userId) return res.status(401).json({ error: "No autorizado" });
  const userCart = carts[userId] || [];
  const item = userCart.find(i => i.id === itemId);
  if (!item) return res.status(404).json({ error: "Item no encontrado" });
  item.cantidad = parseInt(cantidad);
  res.json({ cart: userCart });
});

app.delete('/cart/:itemId', (req, res) => {
  const userId = req.headers['x-user-id'];
  const itemId = parseInt(req.params.itemId);
  if (!userId) return res.status(401).json({ error: "No autorizado" });
  if (!carts[userId]) return res.status(404).json({ error: "Carrito vacio" });
  carts[userId] = carts[userId].filter(i => i.id !== itemId);
  res.status(204).send();
});

app.get('/internal/orders/:id', (req, res) => {
  const orderId = req.params.id;
  const order = orders[orderId] || {
    id: orderId, cliente_id: "105", estado: "PENDIENTE_PAGO",
    fecha_creacion: new Date().toISOString(),
    items: [ { id: 1, producto_id: 1, cantidad: 2 }, { id: 2, producto_id: 4, cantidad: 1 } ]
  };
  res.json(order);
});

app.listen(PORT, () => console.log(`[Orders] en puerto ${PORT}`));

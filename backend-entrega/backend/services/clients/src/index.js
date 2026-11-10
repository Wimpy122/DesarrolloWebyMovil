const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 8083;
const JWT_SECRET = process.env.JWT_SECRET || 'secret_jwt_key_ofiexpress_2026';

const users = [
  { id: 105, nombre: "Juan Pérez", email: "juan.perez@example.com", role: "cliente" },
  { id: 1, nombre: "Admin OfiExpress", email: "admin@ofiexpress.cl", role: "Admin" }
];

const messages = [];

app.post('/auth/login', (req, res) => {
  const { email } = req.body;
  const user = users.find(u => u.email === email) || users[0];
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role, nombre: user.nombre }, JWT_SECRET, { expiresIn: '2h' });
  res.json({ token, user: { id: user.id, nombre: user.nombre, email: user.email, role: user.role } });
});

app.post('/contact', (req, res) => {
  const { nombre, email, mensaje } = req.body;
  if (!nombre || !email || !mensaje) return res.status(400).json({ error: "Campos requeridos" });
  messages.push({ id: messages.length + 1, nombre, email, mensaje, fecha: new Date().toISOString() });
  res.status(201).json({ mensaje: "Contacto guardado" });
});

app.get('/internal/clients/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId) || { id: userId, nombre: "Cliente Registrado", email: "cliente@ofiexpress.cl" };
  res.json({ id: user.id, nombre: user.nombre, email: user.email });
});

app.listen(PORT, () => console.log(`[Clients] en puerto ${PORT}`));

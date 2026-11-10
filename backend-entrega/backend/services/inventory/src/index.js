const express = require('express');
const { startGrpcServer } = require('./grpc_server');

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 8081;

const catalog = [
  { id: 1, titulo: "Set 3 Lápices Grafito HB", precio: 1200, imagen: "img/imagen1.jpg", categoria: "Útiles Escolares", stock: 150 },
  { id: 2, titulo: "Goma de Borrar Miga x2", precio: 800, imagen: "img/imagen2.jpg", categoria: "Útiles Escolares", stock: 200 },
  { id: 3, titulo: "Regla Acrílica 30cm", precio: 1000, imagen: "img/imagen3.jpg", categoria: "Útiles Escolares", stock: 80 },
  { id: 4, titulo: "Cuaderno Universitario Mat.", precio: 2500, imagen: "img/imagen4.jpg", categoria: "Cuadernos y Papel", stock: 300 },
  { id: 5, titulo: "Block de Dibujo Mediano", precio: 1800, imagen: "img/imagen5.png", categoria: "Cuadernos y Papel", stock: 90 },
  { id: 6, titulo: "Notas Adhesivas 100h", precio: 1500, imagen: "img/imagen6.jpg", categoria: "Cuadernos y Papel", stock: 120 },
  { id: 7, titulo: "Resma Papel Carta 500h", precio: 5500, imagen: "img/imagen7.png", categoria: "Oficina", stock: 50 },
  { id: 8, titulo: "Archivador Oficio Lomo Ancho", precio: 3200, imagen: "img/imagen8.jpg", categoria: "Oficina", stock: 40 },
  { id: 9, titulo: "Caja Clips Metálicos x100", precio: 900, imagen: "img/imagen9.jpg", categoria: "Oficina", stock: 300 },
  { id: 10, titulo: "Set 12 Acuarelas Profesionales", precio: 8900, imagen: "img/imagen10.jpg", categoria: "Arte y Diseño", stock: 25 },
  { id: 11, titulo: "Estuche 6 Pinceles Mixtos", precio: 4500, imagen: "img/imagen11.jpg", categoria: "Arte y Diseño", stock: 60 },
  { id: 12, titulo: "Caja 24 Lápices Acuarelables", precio: 12000, imagen: "img/imagen12.jpg", categoria: "Arte y Diseño", stock: 35 }
];

app.get('/products', (req, res) => {
  const { q, category } = req.query;
  let result = [...catalog];
  if (category) result = result.filter(p => p.categoria.toLowerCase() === category.toLowerCase());
  if (q) result = result.filter(p => p.titulo.toLowerCase().includes(q.toLowerCase()));
  res.json(result);
});

app.get('/products/:id', (req, res) => {
  const product = catalog.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: "Producto no encontrado" });
  res.json(product);
});

app.post('/products', (req, res) => {
  const { titulo, precio, imagen, categoria, stock } = req.body;
  if (!titulo || !precio) return res.status(400).json({ error: "Título y precio requeridos" });
  const newProd = { id: catalog.length + 1, titulo, precio: parseInt(precio), imagen: imagen || "img/default.jpg", categoria: categoria || "General", stock: stock || 10 };
  catalog.push(newProd);
  res.status(201).json(newProd);
});

app.listen(PORT, () => {
  console.log(`[Inventory] REST en puerto ${PORT}`);
  startGrpcServer(process.env.GRPC_PORT || 50051);
});

const express = require('express');
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 8084;

app.post('/checkout', (req, res) => {
  const userId = req.headers['x-user-id'];
  const { orderId, total } = req.body;
  if (!userId) return res.status(401).json({ error: "No autorizado" });
  if (!orderId || !total) return res.status(400).json({ error: "Faltan parametros" });
  res.json({
    status: "INICIADO",
    transaction: { orderId, total, tbkToken: `tbk_token_${Date.now()}` }
  });
});

app.listen(PORT, () => console.log(`[Payments] en puerto ${PORT}`));

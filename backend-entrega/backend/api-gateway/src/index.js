const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { authenticateToken, requireAdminRole } = require('./policies/auth');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(helmet());
app.use(cors());

app.use((req, res, next) => {
  delete req.headers['x-user-id'];
  delete req.headers['x-user-role'];
  next();
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    gateway: 'OfiExpress API Gateway',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/v1/products', (req, res, next) => {
  if (req.method === 'GET') {
    return createProxyMiddleware({
      target: process.env.INVENTORY_SERVICE_URL || 'http://inventory:8081',
      changeOrigin: true,
      pathRewrite: { '^/api/v1/products': '/products' }
    })(req, res, next);
  }
  if (req.method === 'POST') {
    return authenticateToken(req, res, () => {
      return requireAdminRole(req, res, () => {
        return createProxyMiddleware({
          target: process.env.INVENTORY_SERVICE_URL || 'http://inventory:8081',
          changeOrigin: true,
          pathRewrite: { '^/api/v1/products': '/products' }
        })(req, res, next);
      });
    });
  }
  next();
});

app.use('/api/v1/orders/cart', authenticateToken, (req, res, next) => {
  createProxyMiddleware({
    target: process.env.ORDERS_SERVICE_URL || 'http://orders:8082',
    changeOrigin: true,
    pathRewrite: { '^/api/v1/orders/cart': '/cart' },
    onProxyReq: (proxyReq, req) => {
      if (req.user) {
        proxyReq.setHeader('X-User-ID', String(req.user.id));
        proxyReq.setHeader('X-User-Role', req.user.role || 'cliente');
      }
    }
  })(req, res, next);
});

app.use('/api/v1/support/contact', (req, res, next) => {
  createProxyMiddleware({
    target: process.env.CLIENTS_SERVICE_URL || 'http://clients:8083',
    changeOrigin: true,
    pathRewrite: { '^/api/v1/support/contact': '/contact' }
  })(req, res, next);
});

app.use('/api/v1/payments/checkout', authenticateToken, (req, res, next) => {
  createProxyMiddleware({
    target: process.env.PAYMENTS_SERVICE_URL || 'http://payments:8084',
    changeOrigin: true,
    pathRewrite: { '^/api/v1/payments/checkout': '/checkout' },
    onProxyReq: (proxyReq, req) => {
      if (req.user) {
        proxyReq.setHeader('X-User-ID', String(req.user.id));
      }
    }
  })(req, res, next);
});

app.use('/api/v1/auth', (req, res, next) => {
  createProxyMiddleware({
    target: process.env.CLIENTS_SERVICE_URL || 'http://clients:8083',
    changeOrigin: true,
    pathRewrite: { '^/api/v1/auth': '/auth' }
  })(req, res, next);
});

app.use('/graphql', authenticateToken, (req, res, next) => {
  createProxyMiddleware({
    target: process.env.GRAPHQL_GATEWAY_URL || 'http://graphql-gateway:4000/graphql',
    changeOrigin: true,
    onProxyReq: (proxyReq, req) => {
      if (req.user) {
        proxyReq.setHeader('X-User-ID', String(req.user.id));
      }
    }
  })(req, res, next);
});

app.listen(PORT, () => {
  console.log(`[ApiGateway] Escuchando en puerto ${PORT}`);
});

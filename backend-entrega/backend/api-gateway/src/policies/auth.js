const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_jwt_key_ofiexpress_2026';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de autenticacion requerido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token invalido o expirado' });
    }
    req.user = user;
    req.headers['x-user-id'] = String(user.id);
    req.headers['x-user-role'] = user.role || 'cliente';
    next();
  });
}

function requireAdminRole(req, res, next) {
  const role = req.headers['x-user-role'];
  if (role !== 'Admin' && role !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado: se requiere rol Administrador' });
  }
  next();
}

module.exports = { authenticateToken, requireAdminRole };

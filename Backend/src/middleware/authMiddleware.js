const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JWT_SECRET = 'your_jwt_secret_key';

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    console.log('❌ No se proporcionó token');
    return res.status(401).json({ error: 'No autorizado - Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    req.user = {
      id: user.id,
      role: user.role
    };
    
    console.log('✅ Token verificado, userId:', decoded.userId, 'role:', user.role);
    next();
  } catch (err) {
    console.log('❌ Error en verificación de token:', err.message);
    return res.status(401).json({ error: 'No autorizado - Token inválido' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado - Se requiere rol de administrador' });
  }
  next();
};

module.exports = { authMiddleware, isAdmin };
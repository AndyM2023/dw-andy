const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret_key';

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    console.log('❌ No se proporcionó token');
    return res.status(401).json({ error: 'No autorizado - Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    console.log('✅ Token verificado, userId:', decoded.userId);
    next();
  } catch (err) {
    console.log('❌ Error en verificación de token:', err.message);
    return res.status(401).json({ error: 'No autorizado - Token inválido' });
  }
};

module.exports = authMiddleware;
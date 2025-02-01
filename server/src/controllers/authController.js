const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = 'your_jwt_secret_key';

const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Nombre de usuario y contraseña requeridos' });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: 'El nombre de usuario ya está en uso' });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const newUser = await User.create({ username, password: hashedPassword });

    // Generar token
    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token, userId: newUser.id, message: 'Usuario registrado con éxito' });
  } catch (error) {
    console.error('Error en registro:', error);
    console.error('❌ Error en el registro:', err);
    return res.status(500).json({ error: 'Error en la base de datos', details: err.message });
    
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Nombre de usuario y contraseña requeridos' });
    }

    // Buscar usuario
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(400).json({ error: 'Nombre de usuario o contraseña incorrectos' });
    }

    // Comparar contraseñas
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Nombre de usuario o contraseña incorrectos' });
    }

    // Generar token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token, userId: user.id, message: 'Login exitoso' });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

const validateToken = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(403).json({ error: 'Token requerido' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Token inválido' });
    res.status(200).json({ message: 'Token válido', userId: decoded.userId });
  });
};

module.exports = { register, login, validateToken };


/*const express = require('express');
const { register, login } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Rutas públicas
router.post('/register', register);
router.post('/login', login);

// Ruta protegida para validar token
router.get('/validate-token', authMiddleware, (req, res) => {
  res.status(200).json({ 
    valid: true, 
    user: {
      id: req.user.id,
      role: req.user.role
    }
  });
});

module.exports = router;*/

const express = require('express');
const { register, login } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');
const User = require('../models/User');

const router = express.Router();

// Rutas públicas
router.post('/register', register);
router.post('/login', login);

// Ruta para obtener todos los usuarios
router.get('/users', authMiddleware, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'role']
    });
    res.json(users);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// Ruta protegida para validar token
router.get('/validate-token', authMiddleware, (req, res) => {
  res.status(200).json({ 
    valid: true, 
    user: {
      id: req.user.id,
      role: req.user.role
    }
  });
});

module.exports = router;
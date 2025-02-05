const express = require('express');
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

module.exports = router;
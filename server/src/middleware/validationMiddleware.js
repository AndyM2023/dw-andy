const { validateEmail, validatePassword, validateUsername } = require('../utils/formValidations');

// Middleware para validar el login
const validateLogin = (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  next(); // Si todo está bien, pasar al siguiente middleware o ruta
};

// Middleware para validar el registro
const validateRegister = (req, res, next) => {
  const { username, password, confirmPassword, email } = req.body;

  if (!username || !validateUsername(username)) {
    return res.status(400).json({ error: 'El nombre de usuario debe tener al menos 3 caracteres.' });
  }
//nuevo
  if (!username == password) {
    return res.status(400).json({ error: 'El nombre de usuario no debe ser igual que la contraseña.' });
  }

  if (!password || !validatePassword(password)) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres.' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Las contraseñas no coinciden.' });
  }

  if (email && !validateEmail(email)) {
    return res.status(400).json({ error: 'Por favor ingrese un correo válido.' });
  }

  next(); // Si todo está bien, pasar al siguiente middleware o ruta
};

module.exports = { validateLogin, validateRegister };

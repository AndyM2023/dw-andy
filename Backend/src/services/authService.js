const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

const registerUser = async (username, password) => {
  const existingUser = await User.findOne({ where: { username } });
  if (existingUser) {
    throw new Error('El nombre de usuario ya está en uso.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ username, password: hashedPassword });

  const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '1h' });
  return { token, userId: newUser.id };
};

const loginUser = async (username, password) => {
  const user = await User.findOne({ where: { username } });
  if (!user) {
    throw new Error('Usuario o contraseña incorrectos.');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Usuario o contraseña incorrectos.');
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
  return { token, userId: user.id };
};

module.exports = { registerUser, loginUser };

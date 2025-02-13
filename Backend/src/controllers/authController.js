const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = "your_jwt_secret_key";

const register = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Nombre de usuario y contraseña requeridos" });
    }


    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "El nombre de usuario ya está en uso" });
    }


    const hashedPassword = await bcrypt.hash(password, 10);


    const newUser = await User.create({
      username,
      password: hashedPassword,
      role: role || "user",
    });


    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      token,
      userId: newUser.id,
      role: newUser.role,
      message: "Usuario registrado con éxito",
    });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ error: "Error en el registro" });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Nombre de usuario y contraseña requeridos" });
    }


    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res
        .status(400)
        .json({ error: "Nombre de usuario o contraseña incorrectos" });
    }


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ error: "Nombre de usuario o contraseña incorrectos" });
    }


    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      token,
      userId: user.id,
      role: user.role,
      message: "Login exitoso",
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
};

module.exports = { register, login };

import React, { useState } from "react";
import Swal from "sweetalert2";
import PropTypes from "prop-types";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      Swal.fire({
        icon: "warning",
        title: "Campos vacíos",
        text: "Por favor, ingresa tu usuario y contraseña",
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.userId) {
        Swal.fire({
          icon: "success",
          title: "¡Bienvenido!",
          text: "Has iniciado sesión correctamente",
          timer: 2000,
          showConfirmButton: false,
        });

        // Pasar el rol y el ID junto con el token
        onLogin(data.token, data.role, data.userId);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error al iniciar sesión",
          text: data.error || "Usuario o contraseña incorrectos",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error de conexión",
        text: "No se pudo conectar con el servidor",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="username" className="block text-white">
          Usuario
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border rounded-md"
          placeholder="Ingresa tu usuario"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="block text-white">
          Contraseña
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded-md"
          placeholder="Ingresa tu contraseña"
          required
          autoComplete="current-password"
        />
      </div>
      <button
        type="submit"
        className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
      >
        Iniciar Sesión
      </button>
    </form>
  );
};
Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default Login;

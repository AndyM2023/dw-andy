

import React, { useState } from 'react';
import Swal from 'sweetalert2';
const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos vacíos',
        text: 'Por favor, ingresa tu usuario y contraseña',
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log('Respuesta del servidor:', data); // Debug

//LINEA DE CAMBIO


    
if (response.ok && data.userId) {
  localStorage.setItem('authToken', data.token);
  localStorage.setItem('user_id', data.userId.toString());

  Swal.fire({
    icon: 'success',
    title: '¡Bienvenido!',
    text: 'Has iniciado sesión correctamente',
    timer: 2000,
    showConfirmButton: false,
  });

  setTimeout(() => onLogin(), 2000);
} else {
  Swal.fire({
    icon: 'error',
    title: 'Error al iniciar sesión',
    text: data.error || 'Usuario o contraseña incorrectos',
  });
}
} catch (err) {
Swal.fire({
  icon: 'error',
  title: 'Error de conexión',
  text: 'No se pudo conectar con el servidor',
});
}
};

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="username" className="block text-gray-700">
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
        <label htmlFor="password" className="block text-gray-700">
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
        />
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <button
        type="submit"
        className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
      >
        Iniciar Sesión
      </button>
    </form>
  );
};

export default Login;

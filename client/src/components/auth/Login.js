

import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Por favor, ingresa tu usuario y contraseña');
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
        // Asegurarse de que el userId existe y convertirlo a string
        const userIdString = data.userId.toString();
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user_id', userIdString);
        
        console.log('Token guardado:', data.token);
        console.log('User ID guardado:', userIdString);
        
        // Verificar que se guardó correctamente
        const savedUserId = localStorage.getItem('user_id');
        console.log('User ID verificación:', savedUserId);
        
        if (savedUserId && savedUserId !== 'undefined' && savedUserId !== 'null') {
          onLogin();
        } else {
          setError('Error al guardar la sesión. Por favor, intente nuevamente.');
        }
      } else {
        setError(data.error || 'Error al iniciar sesión');
      }
    } catch (err) {
      console.error('Error en la conexión:', err);
      setError('Error en la conexión al servidor');
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

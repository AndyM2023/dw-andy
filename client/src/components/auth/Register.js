import React, { useState } from 'react';

const Register = ({ onRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!username || !password || !confirmPassword) {
      setError('Por favor, completa todos los campos');
      return;
    }

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Registro exitoso, ya puedes iniciar sesión');
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        onRegister();
      } else {
        setError(data.error || 'Error al registrarse');
      }
    } catch (err) {
      console.error('Error en la conexión:', err);
      setError('Error en la conexión al servidor');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
      <div className="mb-4">
        <label htmlFor="username" className="block text-gray-700">Usuario</label>
        <input type="text" id="username" value={username} placeholder="Ingrese su usuario" onChange={(e) => setUsername(e.target.value)} className="w-full p-2 border rounded-md" required />
      </div>

      <div className="mb-4">
        <label htmlFor="password" className="block text-gray-700">Contraseña</label>
        <input type="password" id="password" value={password} placeholder="Ingrese su contraseña" onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border rounded-md" required />
      </div>

      <div className="mb-4">
        <label htmlFor="confirmPassword" className="block text-gray-700">Confirmar Contraseña</label>
        <input type="password" id="confirmPassword" value={confirmPassword} placeholder="Ingrese nuevamente su contraseña"onChange={(e) => setConfirmPassword(e.target.value)} className="w-full p-2 border rounded-md" required />
      </div>

      {error && <p className="text-red-500">{error}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}

      <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
        Registrarse
      </button>
    </form>
  );
};

export default Register;

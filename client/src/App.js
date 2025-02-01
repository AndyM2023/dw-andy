import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Home from './pages/Home';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleRegister = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user_id');
    setIsAuthenticated(false);
    
    navigate('/'); // 🔄 Redirige al login inmediatamente
  };

  return (
    <div>
      <Routes>
        {isAuthenticated ? (
          <>
            <Route path="/home" element={<Home onLogout={handleLogout} />} />
            <Route path="*" element={<Navigate to="/home" />} />
          </>
        ) : (
          <>
            <Route path="/" element={
              <section className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-200 to-gray-800">
                <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg">
                  <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-800">
                      {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
                    </h2>
                  </div>
                  <div className="flex space-x-1 mb-6">
                    <button
                      className={`w-full py-2 rounded-md text-lg font-semibold ${isLogin ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                      onClick={() => setIsLogin(true)}
                    >
                      Iniciar Sesión
                    </button>
                    <button
                      className={`w-full py-2 rounded-md text-lg font-semibold ${!isLogin ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                      onClick={() => setIsLogin(false)}
                    >
                      Registrarse
                    </button>
                  </div>
                  {isLogin ? (
                    <Login onLogin={handleLogin} />
                  ) : (
                    <Register onRegister={handleRegister} />
                  )}
                </div>
              </section>
            } />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;

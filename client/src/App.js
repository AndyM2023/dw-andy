import React, { useContext, useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Home from './pages/Home';

function App() {
  const { isAuthenticated, login } = useContext(AuthContext); // ✅ Asegúrate de obtener `login`
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div>
      <Routes>
        {isAuthenticated ? (
          <>
            <Route path="/home" element={<Home />} />
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
                    <Login onLogin={login} />  
                  ) : (
                    <Register />
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

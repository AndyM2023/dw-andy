import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Login from "../components/auth/Login";
import Navbar from "../components/Navbar"; // Importar Navbar

const LoginPage = () => {
  const { login } = useContext(AuthContext);

  return (
    <>
      <Navbar showAuthLinks={false} /> {/* Navbar sin enlaces de inicio ni estadísticas */}
      <section className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-800 to-gray-800">
        <div className="w-full max-w-lg p-8 bg-white/10 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 text-center">Iniciar Sesión</h2>
          <Login onLogin={login} />
        </div>
      </section>
    </>
  );
};

export default LoginPage;

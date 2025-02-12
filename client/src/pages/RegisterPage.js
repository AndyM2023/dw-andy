import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Register from "../components/auth/Register";
import Navbar from "../components/Navbar"; // Importar Navbar

const RegisterPage = () => {
  const { login } = useContext(AuthContext);

  return (
    <>
      <Navbar showAuthLinks={false} /> {/* Navbar sin enlaces de inicio ni estadísticas */}
      <section className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-800 to-gray-500">
        <div className="w-full max-w-lg p-8 bg-white/10 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 text-center">Registrarse</h2>
          <Register onRegister={login} />
        </div>
      </section>
    </>
  );
};

export default RegisterPage;

import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Login from "../components/auth/Login";

const LoginPage = () => {
  const { login } = useContext(AuthContext);

  return (
    <section className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-800 to-gray-800">
      <div className="w-full max-w-lg p-8 bg-white/50 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 text-center">Iniciar Sesión</h2>
        <Login onLogin={login} />
      </div>
    </section>
  );
};

export default LoginPage;

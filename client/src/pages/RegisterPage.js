import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Register from "../components/auth/Register";

const RegisterPage = () => {
  const { login } = useContext(AuthContext);

  return (
    <section className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-200 to-gray-800">
      <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 text-center">Registrarse</h2>
        <Register onRegister={login} />
      </div>
    </section>
  );
};

export default RegisterPage;

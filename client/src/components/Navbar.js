import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center shadow-lg">
      {/* Izquierda: Nombre del sistema */}
      <div className="text-xl font-bold">
        📂 Gestión de Proyectos
      </div>

      {/* Centro: Links de navegación */}
      <div className="space-x-4">
        <Link to="/home" className="hover:text-blue-400">
          🏠 Inicio
        </Link>
        <Link to="/statistics" className="hover:text-blue-400">
          📊 Estadísticas
        </Link>
      </div>

      {/* Derecha: Botón de Cerrar Sesión */}
      {isAuthenticated && (
        <button 
          onClick={handleLogout} 
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Cerrar Sesión
        </button>
      )}
    </nav>
  );
}

export default Navbar;

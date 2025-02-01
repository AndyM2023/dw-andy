import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("authToken"));

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token);
  }, []);

  const login = (token) => {
    localStorage.setItem("authToken", token);
    setIsAuthenticated(true);
    navigate("/home");
  };
  const logout = () => {
    console.log("🔴 CERRANDO SESIÓN...");
    localStorage.removeItem("authToken");
    localStorage.removeItem("user_id");
    setIsAuthenticated(false); // ✅ ACTUALIZA EL ESTADO
    setTimeout(() => {
      navigate("/"); // ✅ REDIRECCIÓN AL LOGIN DESPUÉS DE ACTUALIZAR ESTADO
    }, 100); 
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

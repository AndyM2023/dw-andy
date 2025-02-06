import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");
    const id = localStorage.getItem("user_id");
    
    if (token) {
      setIsAuthenticated(true);
      setUserRole(role);
      setUserId(id);
    } else {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
      localStorage.removeItem("user_id");
      setIsAuthenticated(false);
      setUserRole(null);
      setUserId(null);
      navigate("/");
    }
  }, [navigate]);

  const login = (token, role, id) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("userRole", role);
    localStorage.setItem("user_id", id);
    setIsAuthenticated(true);
    setUserRole(role);
    setUserId(Number(id));
    navigate("/home");
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("user_id");
    setIsAuthenticated(false);
    setUserRole(null);
    setUserId(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      login, 
      logout, 
      userRole,
      userId 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

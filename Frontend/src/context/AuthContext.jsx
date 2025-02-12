import { createContext, useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
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

 
  const authContextValue = useMemo(() => ({
    isAuthenticated,
    login,
    logout,
    userRole,
    userId,
  }), [isAuthenticated, userRole, userId]);

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};


AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};


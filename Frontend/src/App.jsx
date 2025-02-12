import React, { useContext, useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { getProjects } from "./api/projectService";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Home from "./pages/Home";
import Statistics from "./pages/Statistics";
import ProjectDetails from "./components/projects/ProjectDetails";
import CompletedTasks from "./pages/CompletedTasks";
import Navbar from "./components/Navbar";

function App() {
  const { isAuthenticated, login } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects();
    }
  }, [isAuthenticated]);

  const fetchProjects = async () => {
    try {
      const userId = localStorage.getItem("user_id");
      if (!userId) return;
      const data = await getProjects(userId);
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Error al obtener proyectos:", err);
    }
  };

  return (
    <div>
      <Navbar showAuthLinks={isAuthenticated} />

      <Routes>
        {isAuthenticated ? (
          <>
            <Route path="/home" element={<Home />} />
            <Route
              path="/statistics"
              element={<Statistics projects={projects} />}
            />
            <Route
              path="/project/:id"
              element={<ProjectDetails projects={projects} />}
            />
            <Route
              path="/project/:projectId/completed-tasks"
              element={<CompletedTasks />}
            />
            <Route path="*" element={<Navigate to="/home" />} />
          </>
        ) : (
          <Route
            path="/"
            element={
              <section className="flex flex-col items-center min-h-screen bg-gradient-to-r from-gray-600 to-gray-900">
                <div className="w-full max-w-lg p-8 bg-white/20 rounded-lg shadow-lg mt-20">
                  <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-800">
                      {isLogin ? "Iniciar Sesión" : "Registrarse"}
                    </h2>
                  </div>
                  <div className="flex space-x-1 mb-6">
                    <button
                      className={`w-full py-2 rounded-md text-lg font-semibold ${isLogin ? "bg-blue-500 text-white" : "bg-gray-300"}`}
                      onClick={() => setIsLogin(true)}
                    >
                      Iniciar Sesión
                    </button>
                    <button
                      className={`w-full py-2 rounded-md text-lg font-semibold ${!isLogin ? "bg-blue-500 text-white" : "bg-gray-300"}`}
                      onClick={() => setIsLogin(false)}
                    >
                      Registrarse
                    </button>
                  </div>
                  {isLogin ? <Login onLogin={login} /> : <Register />}
                </div>
              </section>
            }
          />
        )}
      </Routes>
    </div>
  );
}

export default App;

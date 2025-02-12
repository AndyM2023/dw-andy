import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
//import { getProjects, createProject, updateProject, deleteProject } from "../api/projectService";
import ProjectList from "../components/projects/ProjectList";
import ProjectForm from "../components/projects/ProjectForm";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { isAuthenticated, userRole, userId } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    } else {
      fetchProjects();
      fetchUsername();
    }
    window.scrollTo(0, 0);
  }, [isAuthenticated]);

  const fetchUsername = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:3001/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setUsername(data.username);
    } catch (err) {
      console.error("Error al obtener el nombre de usuario:", err);
    }
  };

  const fetchProjects = async () => {
    if (!userId) return;
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:3001/api/projects`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Error al obtener proyectos:", err);
    }
  };

  const handleAddProject = () => {
    if (userRole !== "admin") {
      alert("Solo los administradores pueden crear proyectos");
      return;
    }
    setEditingProject(null);
    setShowForm(true);
  };

  const handleSaveProject = async (projectData) => {
    try {
      const token = localStorage.getItem("authToken");
      if (editingProject) {
        await fetch(`http://localhost:3001/api/projects/${editingProject.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(projectData),
        });
      } else {
        await fetch("http://localhost:3001/api/projects", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(projectData),
        });
      }
      fetchProjects();
      setShowForm(false);
    } catch (err) {
      console.error("❌ Error al guardar el proyecto:", err);
    }
  };

  const handleEditProject = (project) => {
    if (userRole !== "admin") {
      alert("Solo los administradores pueden editar proyectos");
      return;
    }
    setEditingProject(project);
    setShowForm(true);
  };

  const handleDeleteProject = async (id) => {
    if (userRole !== "admin") {
      alert("Solo los administradores pueden eliminar proyectos");
      return;
    }
    try {
      const token = localStorage.getItem("authToken");
      await fetch(`http://localhost:3001/api/projects/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchProjects();
    } catch (err) {
      console.error("❌ Error al eliminar el proyecto:", err);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900 min-h-screen text-white">
      <div className="max-w-7xl mx-auto p-4">
        <div className="text-center my-8">
          <h1
            className="text-4xl font-bold mb-3 
            bg-gradient-to-r from-gray-400 via-red-500 to-blue-600
            bg-clip-text text-transparent animate-gradient"
          >
            ¡ Hola {username}, bienvenido a Gestion-Proyect !
          </h1>

          <p className="text-lg text-gray-300">
            {userRole === "admin"
              ? "Gestiona y asigna proyectos"
              : "Visualiza tus proyectos asignados"}
          </p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Mis Proyectos</h1>

          {userRole === "admin" && (
            <button
              className="px-5 py-2 bg-green-700 text-white rounded-lg hover:bg-green-600 transition shadow-md"
              onClick={handleAddProject}
            >
              ➕ Nuevo Proyecto
            </button>
          )}
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <ProjectForm
              project={editingProject}
              onSave={handleSaveProject}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        <ProjectList
          projects={projects}
          onEdit={handleEditProject}
          onDelete={handleDeleteProject}
          userRole={userRole}
        />
      </div>
    </div>
  );
};

export default Home;

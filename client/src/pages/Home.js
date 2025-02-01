import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getProjects, createProject, updateProject, deleteProject } from "../api/projectService";
import ProjectList from "../components/projects/ProjectList";
import ProjectForm from "../components/projects/ProjectForm";
import { useNavigate } from "react-router-dom"; 

const Home = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const userId = localStorage.getItem("user_id");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/"); // ✅ Si el usuario no está autenticado, redirige al login
    } else {
      fetchProjects();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    if (!userId) return;
    try {
      const data = await getProjects(userId);
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Error al obtener proyectos:", err);
    }
  };

  const handleAddProject = () => {
    setEditingProject(null);
    setShowForm(true);
  };

  const handleSaveProject = async (projectData) => {
    try {
      if (editingProject) {
        await updateProject(editingProject.id, projectData);
      } else {
        await createProject(projectData);
      }
      fetchProjects();
      setShowForm(false);
    } catch (err) {
      console.error("❌ Error al guardar el proyecto:", err);
    }
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleDeleteProject = async (id) => {
    try {
      await deleteProject(id);
      fetchProjects();
    } catch (err) {
      console.error("❌ Error al eliminar el proyecto:", err);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen text-white">
      <nav className="bg-gray-800 text-white p-4 shadow-lg">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="text-lg font-semibold">Gestión de Proyectos</div>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            onClick={logout}
          >
            Cerrar Sesión
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Mis Proyectos</h1>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            onClick={handleAddProject}
          >
            Nuevo Proyecto
          </button>
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
        />
      </div>
    </div>
  );
};

export default Home;

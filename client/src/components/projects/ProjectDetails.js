import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTasksByProject } from "../../api/taskService"; // ✅ Importa la función correcta
import GanttChart from "../GanttChart";
import BurndownChart from "../BurndownChart";

function ProjectDetails({ projects }) {
  const { id } = useParams();
  const project = projects.find((p) => p.id === Number(id));
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (project) {
      fetchTasks(project.id);
    }
  }, [project]);

  const fetchTasks = async (projectId) => {
    try {
      console.log(`📡 Obteniendo tareas del proyecto ${projectId}`);
      const data = await getTasksByProject(projectId);
      console.log("📋 Tareas obtenidas:", data);
      setTasks(data);
    } catch (error) {
      console.error("❌ Error al obtener tareas del proyecto:", error);
    }
  };

  if (!project) {
    return <p className="text-red-500">❌ Proyecto no encontrado</p>;
  }

  return (
    <div className="p-6 bg-gray-800 text-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">📂 {project.name}</h2>
      <p>{project.description}</p>

      <div className="mt-6">
        <h3 className="text-xl font-semibold">📊 Gráfico de Burndown</h3>
        <BurndownChart tasks={tasks} startDate={project.start_date} endDate={project.end_date} />
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold">📅 Gráfico de Gantt</h3>
        <GanttChart tasks={tasks} />
      </div>
    </div>
  );
}

export default ProjectDetails;

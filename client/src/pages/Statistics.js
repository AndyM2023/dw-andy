import React, { useEffect, useState } from "react";
import BurndownChart from "../components/BurndownChart";
import GanttChart from "../components/GanttChart";
import { getTasksByProject } from "../api/taskService";

function Statistics({ projects }) {
  const [tasksByProject, setTasksByProject] = useState({});

  useEffect(() => {
    console.log("📊 Datos de proyectos en estadísticas:", projects);
    window.scrollTo(0, 0);
    
    if (!projects || projects.length === 0) {
      console.warn("⚠️ No hay proyectos disponibles en estadísticas.");
      return;
    }

    projects.forEach(async (project) => {
      console.log(`🔎 Obteniendo tareas del proyecto: ${project.name} (ID: ${project.id})`);

      try {
        const tasks = await getTasksByProject(project.id);
        setTasksByProject((prev) => ({
          ...prev,
          [project.id]: tasks,
        }));
      } catch (error) {
        console.error(`❌ Error al obtener tareas para el proyecto ${project.name}:`, error);
      }
    });
  }, [projects]);

  return (
    <div className="min-h-screen bg-gray-950 p-8"> 
      <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
        📊 Panel de Estadísticas
      </h2>

      {projects.length === 0 ? (
        <p className="text-gray-400 text-lg">No hay proyectos disponibles.</p>
      ) : (
        projects.map((project) => (
          <div 
            key={project.id} 
            className="bg-gray-900 p-6 rounded-lg shadow-xl mb-8 border border-gray-700"
          >
            <h3 className="text-2xl font-bold text-white mb-2">{project.name}</h3>
            <p className="text-gray-400">{project.description}</p>

            {tasksByProject[project.id] && tasksByProject[project.id].length > 0 ? (
              <div className="flex flex-col space-y-6 mt-4 p-6 bg-gray-800 rounded-lg shadow-md">
                
                {/* Burndown Chart */}
                <div className="p-6 bg-gray-900 rounded-lg shadow-lg">
                  <h4 className="text-xl font-bold text-white mb-3">📉 Burndown Chart</h4>
                  <BurndownChart 
                    tasks={tasksByProject[project.id]} 
                    startDate={project.start_date} 
                    endDate={project.end_date} 
                  />
                </div>

                {/* Gantt Chart ocupa TODO el ancho */}
                <div className="p-6 bg-gray-900 rounded-lg shadow-lg w-full">
                  <h4 className="text-xl font-bold text-white mb-3">📅 Diagrama de Gantt</h4>
                  <div className="w-full max-w-none">
                    <GanttChart tasks={tasksByProject[project.id] || []} />
                  </div>
                </div>

              </div>
            ) : (
              <p className="text-gray-400 mt-3">No hay tareas en este proyecto.</p>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Statistics;

import React, { useState, useEffect} from "react";
import BurndownChart from "../components/BurndownChart";
import GanttChart from "../components/GanttChart";
import PriorityFilter from "../components/PriorityFilter";
//import { AuthContext } from "../context/AuthContext";

function Statistics() {
  const [projects, setProjects] = useState([]);
  const [tasksByProject, setTasksByProject] = useState({});
  const [selectedPriority, setSelectedPriority] = useState("Todas");
  //const { userRole } = useContext(AuthContext);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:3001/api/projects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setProjects(Array.isArray(data) ? data : []);

      // Fetch tasks for each project
      data.forEach((project) => {
        fetchTasksForProject(project.id);
      });
    } catch (error) {
      console.error("Error al obtener proyectos:", error);
    }
  };

  const fetchTasksForProject = async (projectId) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `http://localhost:3001/api/tasks/project/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const tasks = await response.json();
      setTasksByProject((prev) => ({
        ...prev,
        [projectId]: tasks,
      }));
    } catch (error) {
      console.error(
        `Error al obtener tareas para el proyecto ${projectId}:`,
        error,
      );
    }
  };

  const handlePriorityChange = (priority) => {
    setSelectedPriority(priority);
  };

  const filterTasksByPriority = (tasks) => {
    if (!tasks) return [];
    if (selectedPriority === "Todas") return tasks;
    return tasks.filter((task) => task.priority === selectedPriority);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 p-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
          📊 Panel de Estadísticas
        </h2>

        <PriorityFilter
          selectedPriority={selectedPriority}
          onChange={handlePriorityChange}
        />

        {projects.length === 0 ? (
          <p className="text-gray-400 text-lg">No hay proyectos disponibles.</p>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className="bg-gray-900 p-6 rounded-lg shadow-xl  last:mb-0 border border-gray-700"
            >
              <h3 className="text-2xl font-bold text-white mb-2 text-center">
                Proyecto: {project.name}
              </h3>
              <p className="text-blue-400 text-center">{project.description}</p>

              {tasksByProject[project.id] &&
              tasksByProject[project.id].length > 0 ? (
                <div className="flex flex-col space-y-6 mt-4 p-6 bg-gray-800 rounded-lg shadow-md">
                  <div className="p-6 bg-gray-900 rounded-lg shadow-lg">
                    <h4 className="text-xl font-bold text-white mb-3">
                      📉 Burndown Chart
                    </h4>
                    <BurndownChart
                      tasks={filterTasksByPriority(tasksByProject[project.id])}
                      startDate={project.start_date}
                      endDate={project.end_date}
                    />
                  </div>

                  <div className="p-6 bg-gray-900 rounded-lg shadow-lg w-full">
                    <h4 className="text-xl font-bold text-white mb-3">
                      📅 Diagrama de Gantt
                    </h4>
                    <div className="w-full max-w-none">
                      <GanttChart
                        tasks={filterTasksByPriority(
                          tasksByProject[project.id],
                        )}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 mt-3">
                  No hay tareas en este proyecto.
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Statistics;

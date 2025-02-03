import React, { useEffect, useState } from "react";
import BurndownChart from "../BurndownChart";
import { getProjects } from "../../api/projectServices";
import { getTasks } from "../../api/taskService";

function StatisticsPanel() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const projectsData = await getProjects(localStorage.getItem("user_id"));
      setProjects(projectsData);

      const allTasks = [];
      for (const project of projectsData) {
        const projectTasks = await getTasks(project.id);
        allTasks.push(...projectTasks);
      }
      setTasks(allTasks);
    }
    fetchData();
  }, []);

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen text-white">
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-white">📊 Panel de Estadísticas</h2>
  

      <div className="mt-6">
        <BurndownChart tasks={tasks} startDate="2024-01-01" endDate="2024-12-31" />
      </div>
    </div>
    </div>
  );
}

export default StatisticsPanel;

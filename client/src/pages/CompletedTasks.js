import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function CompletedTasks() {
  const { projectId } = useParams();
  const [completedTasks, setCompletedTasks] = useState([]);
  const [project, setProject] = useState(null);

  useEffect(() => {
    fetchProject();
    fetchCompletedTasks();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3001/api/projects/${projectId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setProject(data);
    } catch (error) {
      console.error('Error al obtener el proyecto:', error);
    }
  };

  const fetchCompletedTasks = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3001/api/tasks/project/${projectId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      const completed = data.filter(task => task.status === 'Completada');
      setCompletedTasks(completed);
    } catch (error) {
      console.error('Error al obtener las tareas completadas:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            Tareas Completadas - {project?.name}
          </h1>
          <Link
            to="/home"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            ← Volver
          </Link>
        </div>

        <div className="space-y-4">
          {completedTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-8">
              <img 
                  src={process.env.PUBLIC_URL + '/images/tareanocompletada.png'} 
                alt="No hay tareas completadas" 
                className="mx-auto w-70 h-70 mb-4  "
              />
              <p className="text-gray-400 text-3xl">No hay tareas completadas</p>
            </div>
          ) : (
            
            completedTasks.map(task => (
                
                <div key={task.id} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between">
                  {/* Imagen a la izquierda */}
                  <img
                    src={process.env.PUBLIC_URL + '/images/tareacompletada.png'}
                    alt="No hay tareas activas"
                    className="w-40 h-40 opacity-70"
                  />
                  
                  {/* Contenedor del texto a la derecha */}
                  <div className="w-2/3">
                    <h3 className="text-xl font-bold text-white mb-2">{task.title}</h3>
                    <p className="text-gray-300 mb-4">{task.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                      <p>📅 Fecha de inicio: {new Date(task.start_date).toLocaleDateString()}</p>
                      <p>🏁 Fecha de finalización: {new Date(task.due_date).toLocaleDateString()}</p>
                      <p>📌 Prioridad: {task.priority}</p>
                      <p>👤 Completada por: {task.assigned_username}</p>
                      <p>✅ Fecha de completado: {new Date(task.updatedAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
              
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default CompletedTasks;
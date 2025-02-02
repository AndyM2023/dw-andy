import React, { useState, useEffect } from 'react';
import TaskForm from '../tasks/TaskForm';

function ProjectList({ projects = [], onEdit, onDelete }) {
  if (!Array.isArray(projects)) {
    console.error('El prop projects no es un array:', projects);
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <p>Error al cargar los proyectos. Por favor, intente nuevamente.</p>
      </div>
    );
  }

  const [tasks, setTasks] = useState({});
  const [showTaskForm, setShowTaskForm] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  // ✅ Función para obtener tareas por proyecto
  const fetchTasks = (projectId) => {
    fetch(`http://localhost:3001/api/tasks/project/${projectId}`)
      .then(response => response.json())
      .then(data => setTasks(prevTasks => ({ ...prevTasks, [projectId]: Array.isArray(data) ? data : [] })))
      .catch(error => {
        console.error(`❌ Error al obtener tareas para el proyecto ${projectId}:`, error);
        setTasks(prevTasks => ({ ...prevTasks, [projectId]: [] }));
      });
  };

  // ✅ Obtener tareas al cargar los proyectos
  useEffect(() => {
    projects.forEach(project => {
      fetchTasks(project.id);
    });
  }, [projects]);

  // ✅ Función para eliminar una tarea
  const handleDeleteTask = (taskId, projectId) => {
    console.log(`🗑️ Eliminando tarea ID: ${taskId} del Proyecto ID: ${projectId}`);
    fetch(`http://localhost:3001/api/tasks/${taskId}`, { method: "DELETE" })
      .then(response => {
        if (!response.ok) {
          throw new Error("❌ Error al eliminar la tarea");
        }
        fetchTasks(projectId); // ✅ Recargar solo las tareas de este proyecto
      })
      .catch(error => console.error("❌ Error al eliminar tarea:", error));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.length === 0 ? (
        <div className="col-span-full text-center p-4">
          <p className="text-gray-500">No hay proyectos disponibles.</p>
        </div>
      ) : (
        projects.map(project => (
          <div
            key={project.id}
            className="bg-gray-900 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow p-6 border border-gray-700"
          >
            <h3 className="text-2xl font-bold mb-3 text-white">{project.name}</h3>
            <p className="text-gray-400 mb-4 text-sm">{project.description}</p>
            
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex justify-between">
                <span>📅 Inicio:</span>
                <span>{new Date(project.start_date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span>🏁 Fin:</span>
                <span>{new Date(project.end_date).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="mt-5 flex space-x-3">
              <button
                onClick={() => onEdit(project)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                ✏️ Editar
              </button>
              <button
                onClick={() => onDelete(project.id)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                🗑️ Eliminar
              </button>
              <button
                onClick={() => {
                  setEditingTask(null);
                  setShowTaskForm(project.id);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                ➕ Tarea
              </button>
            </div>

            {(showTaskForm === project.id || editingTask) && (
              <TaskForm
                projectId={project.id}
                task={editingTask}
                onSave={() => {
                  setShowTaskForm(null);
                  setEditingTask(null);
                  fetchTasks(project.id);
                }}
                onCancel={() => {
                  setShowTaskForm(null);
                  setEditingTask(null);
                }}
              />
            )}

            {/* ✅ LISTA DE TAREAS DEL PROYECTO */}
            <div className="mt-6">
              <h4 className="text-xl font-bold text-white mb-3">📋 Tareas</h4>
              {Array.isArray(tasks[project.id]) && tasks[project.id].length === 0 ? (
                <p className="text-gray-400">No hay tareas asignadas.</p>
              ) : (
                <ul className="space-y-3">
                  {Array.isArray(tasks[project.id]) && tasks[project.id].map(task => (
                    <li key={task.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700 shadow-md">
                      <div className="mb-4">
                        <p className="text-white font-semibold">{task.title}</p>
                        <p className="text-gray-400 text-sm">{task.description}</p>
                        <p className="text-sm text-yellow-400">📌 Prioridad: {task.priority}</p>
                        <p className="text-sm text-green-400">📋 Estado: {task.status}</p>
                      </div>
                      <div className="flex justify-center space-x-3 mt-4">
                        {/* ✅ Botón Editar */}
                        <button
                          className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                          onClick={() => {
                            setEditingTask(task);
                            setShowTaskForm(project.id);
                          }}
                        >
                          ✏️ Editar
                        </button>

                        {/* ✅ Botón Eliminar */}
                        <button
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                          onClick={() => handleDeleteTask(task.id, project.id)}
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ProjectList;

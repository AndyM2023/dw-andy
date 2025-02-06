/*import React, { useState, useEffect } from 'react';
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {projects.length === 0 ? (
        <div className="col-span-full text-center p-4">
          <p className="text-gray-500">No hay proyectos disponibles.</p>
        </div>
      ) : (
        projects.map(project => (
          <div
            key={project.id}
            className="bg-gray-650 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow p-6 border border-blue-50"
          >
            <h3 className="text-2xl font-bold mb-2 text-white">{project.name}</h3>
            <p className="text-gray-400 text-sm">{project.description}</p>
            
            <div className="space-y-2 text-sm text-gray-400 mt-4">
              <div className="flex justify-between">
                <span>📅 Inicio:</span>
                <span>{new Date(project.start_date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span>🏁 Fin:</span>
                <span>{new Date(project.end_date).toLocaleDateString()}</span>
              </div>
            </div>


            <div className="mt-5 flex flex-col gap-3">
              <button
                onClick={() => onEdit(project)}
                className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition w-full"
              >
                ✏️ Editar Proyecto
              </button>
              <button
                onClick={() => onDelete(project.id)}
                className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition w-full"
              >
                🗑️ Eliminar Proyecto
              </button>
              <button
                onClick={() => {
                  setEditingTask(null);
                  setShowTaskForm(project.id);
                }}
                className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition w-full"
              >
                ➕ Añadir Tarea
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
                      <div className="flex gap-3 mt-4">
                        <button
                          className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition w-full"
                          onClick={() => {
                            setEditingTask(task);
                            setShowTaskForm(project.id);
                          }}
                        >
                          ✏️ Editar Tarea
                        </button>

                        <button
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition w-full"
                          onClick={() => handleDeleteTask(task.id, project.id)}
                        >
                          🗑️ Eliminar Tarea
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

export default ProjectList;*/
import React, { useState, useEffect, useContext } from 'react';
import TaskForm from '../tasks/TaskForm';
import { AuthContext } from '../../context/AuthContext';
import UserAssignmentForm from './UserAssignmentForm';
import Swal from 'sweetalert2';

function ProjectList({ projects = [], onEdit, onDelete }) {
  const { userRole, userId } = useContext(AuthContext);
  const [tasks, setTasks] = useState({});
  const [showTaskForm, setShowTaskForm] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [showAssignForm, setShowAssignForm] = useState(null);
  const [projectUsers, setProjectUsers] = useState({});

  useEffect(() => {
    if (projects.length > 0) {
      projects.forEach(project => {
        fetchTasks(project.id);
      });
    }
  }, [projects]);

  const fetchTasks = async (projectId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3001/api/tasks/project/${projectId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setTasks(prevTasks => ({ ...prevTasks, [projectId]: Array.isArray(data) ? data : [] }));
    } catch (error) {
      console.error(`❌ Error al obtener tareas para el proyecto ${projectId}:`, error);
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus, projectId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3001/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchTasks(projectId);
      }
    } catch (error) {
      console.error('Error al actualizar el estado de la tarea:', error);
    }
  };

  const handleDeleteTask = async (taskId, projectId) => {
    if (userRole !== 'admin') {
      Swal.fire({
        icon: 'error',
        title: 'Acceso denegado',
        text: 'Solo los administradores pueden eliminar tareas'
      });
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3001/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        fetchTasks(projectId);
      } else {
        throw new Error("Error al eliminar la tarea");
      }
    } catch (error) {
      console.error("❌ Error al eliminar tarea:", error);
    }
  };

  const handleAssignUsers = (projectId) => {
    setShowAssignForm(projectId);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {projects.length === 0 ? (
        <div className="col-span-full text-center p-4">
          <p className="text-gray-500">No hay proyectos disponibles.</p>
        </div>
      ) : (
        projects.map(project => (
          <div key={project.id} className="bg-gray-650 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow p-6 border border-blue-50">
            <h3 className="text-2xl font-bold mb-2 text-white">{project.name}</h3>
            <p className="text-gray-400 text-sm">{project.description}</p>
            
            <div className="space-y-2 text-sm text-gray-400 mt-4">
              <div className="flex justify-between">
                <span>📅 Inicio:</span>
                <span>{new Date(project.start_date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span>🏁 Fin:</span>
                <span>{new Date(project.end_date).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Mostrar usuarios asignados al proyecto */}
            <div className="mt-4">
              <h4 className="text-white font-semibold mb-2">👥 Usuarios Asignados:</h4>
              <div className="flex flex-wrap gap-2">
                {projectUsers[project.id]?.map(user => (
                  <span key={user.id} className="bg-blue-500 text-white px-2 py-1 rounded-full text-sm">
                    {user.username}
                  </span>
                ))}
              </div>
            </div>


            <div className="mt-5 flex flex-col gap-3">
              {userRole === 'admin' && (
                <>
                  <button
                    onClick={() => onEdit(project)}
                    className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition w-full"
                  >
                    ✏️ Editar Proyecto
                  </button>
                  <button
                    onClick={() => onDelete(project.id)}
                    className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition w-full"
                  >
                    🗑️ Eliminar Proyecto
                  </button>
                  <button
                    onClick={() => handleAssignUsers(project.id)}
                    className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition w-full"
                  >
                    👥 Asignar Usuarios
                  </button>
                  <button
                    onClick={() => {
                      setEditingTask(null);
                      setShowTaskForm(project.id);
                    }}
                    className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition w-full"
                  >
                    ➕ Añadir Tarea
                  </button>
                </>
              )}
            </div>

            {showAssignForm === project.id && (
              <UserAssignmentForm
                projectId={project.id}
                onClose={() => setShowAssignForm(null)}
                onAssign={() => {
                  setShowAssignForm(null);
                }}
              />
            )}

            {(showTaskForm === project.id || editingTask) && userRole === 'admin' && (
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
                        {task.assigned_to && (
                          <p className="text-sm text-blue-400">👤 Asignado a: {task.assigned_username}</p>
                        )}
                      </div>
                      <div className="flex gap-3 mt-4">
                        {(userRole === 'admin' || task.assigned_to === userId) && (
                          <select
                            value={task.status}
                            onChange={(e) => handleUpdateTaskStatus(task.id, e.target.value, project.id)}
                            className="px-4 py-2 bg-gray-700 text-white rounded-lg"
                          >
                            <option value="Pendiente">Pendiente</option>
                            <option value="En Progreso">En Progreso</option>
                            <option value="Completada">Completada</option>
                          </select>
                        )}
                        {userRole === 'admin' && (
                          <>
                            <button
                              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition flex-1"
                              onClick={() => {
                                setEditingTask(task);
                                setShowTaskForm(project.id);
                              }}
                            >
                              ✏️ Editar Tarea
                            </button>
                            <button
                              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex-1"
                              onClick={() => handleDeleteTask(task.id, project.id)}
                            >
                              🗑️ Eliminar Tarea
                            </button>
                          </>
                        )}
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
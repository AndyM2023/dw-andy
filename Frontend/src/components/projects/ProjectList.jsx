import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import TaskForm from "../tasks/TaskForm";
import { AuthContext } from "../../context/AuthContext";
import UserAssignmentForm from "./UserAssignmentForm";
import UserRemovalForm from "./UserRemovalForm";
import Swal from "sweetalert2";

function ProjectList({ projects = [], onEdit, onDelete }) {
  const { userRole, userId } = useContext(AuthContext);
  const [tasks, setTasks] = useState({});
  const [showTaskForm, setShowTaskForm] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [showAssignForm, setShowAssignForm] = useState(null);
  const isAdmin = userRole === "admin";
  const [showRemoveForm, setShowRemoveForm] = useState(null);

  useEffect(() => {
    if (projects.length > 0) {
      Promise.all(projects.map((project) => fetchTasks(project.id)));
    }
  }, [projects]);

  const fetchTasks = async (projectId) => {
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
      const data = await response.json();
      setTasks((prevTasks) => ({
        ...prevTasks,
        [projectId]: Array.isArray(data) ? data : [],
      }));
    } catch (error) {
      console.error(
        `❌ Error al obtener tareas para el proyecto ${projectId}:`,
        error,
      );
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus, projectId) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `http://localhost:3001/api/tasks/${taskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      if (response.ok) {
        fetchTasks(projectId);
      }
    } catch (error) {
      console.error("Error al actualizar el estado de la tarea:", error);
    }
  };

  const handleDeleteTask = async (taskId, projectId) => {
    if (userRole !== "admin") {
      Swal.fire({
        icon: "error",
        title: "Acceso denegado",
        text: "Solo los administradores pueden eliminar tareas",
      });
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `http://localhost:3001/api/tasks/${taskId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

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

  const handleRemoveUser = async (projectId, userId) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `http://localhost:3001/api/projects/${projectId}/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Usuario removido",
          text: "El usuario ha sido removido exitosamente del proyecto",
          timer: 3000,
        });
        window.location.reload();
      } else {
        Swal.fire({
          icon: "error",
          title: "No se puede remover el usuario",
          text:
            data.error || "El usuario tiene tareas pendientes o en progreso",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al remover el usuario del proyecto",
      });
    }
  };

  const getActiveTasks = (projectTasks) => {
    const active =
      projectTasks?.filter((task) => task.status !== "Completada") || [];
    return active.sort((a, b) => {
      const priorityOrder = { Alta: 1, Media: 2, Baja: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  };

  const calculateDaysLeft = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Vencida";
    if (diffDays === 0) return "Vence hoy";
    return `${diffDays} días restantes`;
  };

  const getCompletedTasks = (projectTasks) => {
    return projectTasks?.filter((task) => task.status === "Completada") || [];
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      {projects.length === 0 ? (
        <div className="col-span-full text-center p-4">
          <p className="text-gray-500 text-2xl mb-8">
            No hay proyectos disponibles.
          </p>
          <img
            src={process.env.PUBLIC_URL + "/images/noproject.png"}
            alt="No hay tareas activas"
            className="mx-auto w-60 h-60 mb-8 opacity-50"
          />
        </div>
      ) : (
        projects.map((project) => (
          <div key={project.id} className="flex gap-4">
            <div className="w-1/3 bg-gray-800 rounded-xl shadow-lg p-6 border-4 border-gray-700">
              <h3 className="text-2xl font-bold mb-2 text-white">
                {project.name}
              </h3>
              <p className="text-gray-400 text-sm">{project.description}</p>

              <div className="space-y-2 text-sm text-gray-400 mt-4">
                <div className="flex justify-between">
                  <span>📅 Inicio:</span>
                  <span>
                    {new Date(project.start_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>🏁 Fin:</span>
                  <span>{new Date(project.end_date).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-white font-semibold mb-2">
                  👥 Usuarios Asignados:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.Users?.map((user) => (
                    <div
                      key={user.id}
                      className="bg-blue-800 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {user.username}
                      {isAdmin && (
                        <button
                          onClick={() => handleRemoveUser(project.id, user.id)}
                          className="hover:text-red-400 transition-colors"
                          title="Remover usuario"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2 justify-center w-full">
                {isAdmin && (
                  <>
                    <button
                      onClick={() => onEdit(project)}
                      className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => onDelete(project.id)}
                      className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      🗑️
                    </button>
                    <button
                      onClick={() => handleAssignUsers(project.id)}
                      className="px-4 py-3 bg-purple-300 text-white rounded-lg hover:bg-purple-700 transition"
                    >
                      ➕👥
                    </button>
                    <button
                      onClick={() => {
                        setEditingTask(null);
                        setShowTaskForm(project.id);
                      }}
                      className="px-4 py-3 bg-green-200 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      ➕ 📝
                    </button>
                  </>
                )}
                <Link
                  to={`/project/${project.id}/completed-tasks`}
                  className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition col-span-full flex justify-center"
                >
                  📋✅ ({getCompletedTasks(tasks[project.id]).length})
                </Link>
              </div>
            </div>

            {/* Tareas Activas */}
            <div className="w-2/3 bg-gray-800 rounded-xl p-6 h-[500px] overflow-y-auto">
              <h4 className="text-xl font-bold text-white mb-4">
                📋 Tareas Activas
              </h4>
              <div className="space-y-4">
                {getActiveTasks(tasks[project.id]).map((task) => (
                  <div
                    key={task.id}
                    className="bg-gray-700 p-4 rounded-lg border border-gray-600"
                  >
                    <div className="mb-2">
                      <div className="flex justify-between items-center">
                        <h5 className="text-lg font-semibold text-white">
                          {task.title}
                        </h5>
                        <span
                          className={`px-2 py-1 rounded text-sm ${
                            task.priority === "Alta"
                              ? "bg-red-500"
                              : task.priority === "Media"
                                ? "bg-yellow-500"
                                : "bg-green-500"
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm">
                        {task.description}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-300 mb-3">
                      <p>
                        📅 Inicio:{" "}
                        {new Date(task.start_date).toLocaleDateString()}
                      </p>
                      <p>
                        🏁 Fin: {new Date(task.due_date).toLocaleDateString()}
                      </p>
                      <p>⏳ {calculateDaysLeft(task.due_date)}</p>
                      <p>📋 Estado: {task.status}</p>
                      {task.assigned_to && (
                        <p className="col-span-2">
                          👤 Asignado a: {task.assigned_username}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 justify-center items-center">
                      {(isAdmin ||
                        Number(userId) === Number(task.assigned_to)) && (
                        <select
                          value={task.status}
                          onChange={(e) =>
                            handleUpdateTaskStatus(
                              task.id,
                              e.target.value,
                              project.id,
                            )
                          }
                          className="px-3 py-1 bg-gray-600 text-white rounded"
                        >
                          <option value="Pendiente">Pendiente</option>
                          <option value="En Progreso">En Progreso</option>
                          <option value="Completada">Completada</option>
                        </select>
                      )}
                      {isAdmin && (
                        <>
                          <button
                            onClick={() => {
                              setEditingTask(task);
                              setShowTaskForm(project.id);
                            }}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteTask(task.id, project.id)
                            }
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            🗑️
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
                {getActiveTasks(tasks[project.id]).length === 0 && (
                  <div className="text-center py-8">
                    <img
                      src={
                        process.env.PUBLIC_URL + "/images/tareaspendientes.png"
                      }
                      alt="No hay tareas activas"
                      className="mx-auto w-50 h-60 mb-8 opacity-50"
                    />
                    <p className="text-2xl ">
                      No hay tareas activas por el momento{" "}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      )}

      {showAssignForm && (
        <UserAssignmentForm
          projectId={showAssignForm}
          onClose={() => setShowAssignForm(null)}
          onAssign={() => {
            setShowAssignForm(null);
          }}
        />
      )}

      {(showTaskForm || editingTask) && (
        <TaskForm
          projectId={showTaskForm}
          task={editingTask}
          onSave={() => {
            setShowTaskForm(null);
            setEditingTask(null);
            fetchTasks(showTaskForm);
          }}
          onCancel={() => {
            setShowTaskForm(null);
            setEditingTask(null);
          }}
        />
      )}

      {showRemoveForm && (
        <UserRemovalForm
          projectId={showRemoveForm}
          onClose={() => setShowRemoveForm(null)}
          onRemove={() => {
            setShowRemoveForm(null);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}

export default ProjectList;

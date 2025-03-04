import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

function TaskForm({ projectId, task, onSave, onCancel }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Media");
  const [status, setStatus] = useState("Pendiente");
  const [assignedUser, setAssignedUser] = useState("");
  const [users, setUsers] = useState([]);
  const [project, setProject] = useState(null);

  useEffect(() => {
    fetchProject();
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStartDate(task.start_date ? task.start_date.split("T")[0] : "");
      setDueDate(task.due_date ? task.due_date.split("T")[0] : "");
      setPriority(task.priority);
      setStatus(task.status);
      setAssignedUser(task.assigned_to || "");
    }
    fetchProjectUsers();
  }, [task, projectId]);

  const fetchProject = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `http://localhost:3001/api/projects/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.ok) {
        const data = await response.json();
        setProject(data);
        console.log("Proyecto obtenido:", data); // Para debug
      } else {
        throw new Error("Error al obtener el proyecto");
      }
    } catch (error) {
      console.error("Error al obtener el proyecto:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo obtener la información del proyecto",
      });
    }
  };

  const fetchProjectUsers = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `http://localhost:3001/api/projects/${projectId}/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Error al obtener usuarios del proyecto:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !startDate || !dueDate) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Todos los campos son obligatorios",
      });
      return;
    }

    if (!project) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo validar las fechas del proyecto",
      });
      return;
    }

    // Validar que las fechas estén dentro del rango del proyecto
    const taskStart = new Date(startDate);
    const taskEnd = new Date(dueDate);
    const projectStart = new Date(project.start_date);
    const projectEnd = new Date(project.end_date);

    if (taskStart < projectStart || taskStart > projectEnd) {
      Swal.fire({
        icon: "warning",
        title: "Fecha inválida",
        text: "La fecha de inicio debe estar dentro del período del proyecto",
      });
      return;
    }

    if (taskEnd < projectStart || taskEnd > projectEnd) {
      Swal.fire({
        icon: "warning",
        title: "Fecha inválida",
        text: "La fecha de finalización debe estar dentro del período del proyecto",
      });
      return;
    }

    if (taskStart >= taskEnd) {
      Swal.fire({
        icon: "warning",
        title: "Fechas inválidas",
        text: "La fecha de inicio debe ser anterior a la fecha de finalización",
      });
      return;
    }

    const taskData = {
      title,
      description,
      start_date: startDate,
      due_date: dueDate,
      priority,
      status,
      project_id: projectId,
      assigned_to: assignedUser,
    };

    try {
      const token = localStorage.getItem("authToken");
      const url = task
        ? `http://localhost:3001/api/tasks/${task.id}`
        : "http://localhost:3001/api/tasks";
      const method = task ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) throw new Error("Error al guardar la tarea");

      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: `Tarea ${task ? "actualizada" : "creada"} correctamente`,
      });

      onSave();
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo guardar la tarea",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-white">
          {task ? "Editar Tarea" : "Nueva Tarea"}
        </h2>

        {project && (
          <div className="mb-4 p-3 bg-gray-700 rounded-lg">
            <h3 className="text-sm font-medium text-gray-300 mb-2">
              Período del Proyecto:
            </h3>
            <div className="flex justify-between text-sm text-gray-400">
              <span>
                Inicio: {new Date(project.start_date).toLocaleDateString()}
              </span>
              <span>
                Fin: {new Date(project.end_date).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Título
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white "
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
              rows="3"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Asignar a
            </label>
            <select
              value={assignedUser}
              onChange={(e) => setAssignedUser(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
            >
              <option value="">Seleccionar usuario</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Fecha de Inicio
            </label>
            <input
              type="date"
              value={startDate}
              min={project?.start_date?.split("T")[0]}
              max={project?.end_date?.split("T")[0]}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Fecha de Vencimiento
            </label>
            <input
              type="date"
              value={dueDate}
              min={project?.start_date?.split("T")[0]}
              max={project?.end_date?.split("T")[0]}
              onChange={(e) => setDueDate(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Prioridad
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
            >
              <option value="Alta">Alta</option>
              <option value="Media">Media</option>
              <option value="Baja">Baja</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Estado
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
            >
              <option value="Pendiente">Pendiente</option>
              <option value="En Progreso">En Progreso</option>
              <option value="Completada">Completada</option>
            </select>
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskForm;

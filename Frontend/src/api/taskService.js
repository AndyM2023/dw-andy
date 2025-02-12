const API_URL = "http://localhost:3001/api/tasks";

export const getTasksByProject = async (projectId) => {
  try {
    console.log(`🔎 Buscando tareas para el proyecto ${projectId}`);
    const response = await fetch(
      `http://localhost:3001/api/tasks/project/${projectId}`,
    );
    if (!response.ok) {
      throw new Error(`Error al obtener tareas: ${response.status}`);
    }
    const tasks = await response.json();
    console.log(`✅ Tareas obtenidas (${tasks.length}):`, tasks);
    return tasks;
  } catch (error) {
    console.error("❌ Error en getTasksByProject:", error);
    return [];
  }
};

export const createTask = async (taskData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskData),
  });
  return response.json();
};

export const updateTask = async (id, taskData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskData),
  });
  return response.json();
};

export const deleteTask = async (id) => {
  return fetch(`${API_URL}/${id}`, { method: "DELETE" });
};

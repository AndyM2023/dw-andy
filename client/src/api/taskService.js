const API_URL = "http://localhost:3001/api/tasks";

export const getTasksByProject = async (projectId) => {
  const response = await fetch(`${API_URL}/project/${projectId}`);
  return response.json();
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
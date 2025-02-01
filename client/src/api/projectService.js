const API_URL = "http://localhost:3001/api/projects";

export const getProjects = async (userId) => {
  const response = await fetch(`${API_URL}?user_id=${userId}`);
  return response.json();
};

export const createProject = async (projectData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(projectData),
  });
  return response.json();
};

export const updateProject = async (id, projectData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(projectData),
  });
  return response.json();
};

export const deleteProject = async (id) => {
  return fetch(`${API_URL}/${id}`, { method: "DELETE" });
};

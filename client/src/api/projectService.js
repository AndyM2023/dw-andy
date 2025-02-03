const API_URL = "http://localhost:3001/api/projects";

export const getProjects = async (userId) => {
  try {
    const response = await fetch(`http://localhost:3001/api/projects?user_id=${userId}`);
    const data = await response.json();
    console.log("📊 Proyectos obtenidos desde el backend:", data);
    return data;
  } catch (error) {
    console.error("❌ Error al obtener proyectos:", error);
    return [];
  }
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
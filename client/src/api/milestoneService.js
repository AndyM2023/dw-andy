const API_URL = "http://localhost:3001/api/milestones";

export const getMilestonesByProject = async (projectId) => {
  const response = await fetch(`${API_URL}/project/${projectId}`);
  return response.json();
};

export const createMilestone = async (milestoneData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(milestoneData),
  });
  return response.json();
};

export const updateMilestone = async (id, milestoneData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(milestoneData),
  });
  return response.json();
};

export const deleteMilestone = async (id) => {
  return fetch(`${API_URL}/${id}`, { method: "DELETE" });
};

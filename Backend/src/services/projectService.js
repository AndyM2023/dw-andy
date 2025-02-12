const Project = require("../models/Project");

const createProject = async (projectData) => {
  return await Project.create(projectData);
};

const getProjectsByUser = async (userId) => {
  return await Project.findAll({
    where: { user_id: userId },
    order: [["created_at", "DESC"]],
  });
};

const getProjectById = async (projectId) => {
  return await Project.findByPk(projectId);
};

const updateProject = async (projectId, projectData) => {
  const project = await Project.findByPk(projectId);
  if (!project) throw new Error("Proyecto no encontrado.");
  await project.update(projectData);
  return project;
};

const deleteProject = async (projectId) => {
  const project = await Project.findByPk(projectId);
  if (!project) throw new Error("Proyecto no encontrado.");
  await project.destroy();
};

module.exports = {
  createProject,
  getProjectsByUser,
  getProjectById,
  updateProject,
  deleteProject,
};

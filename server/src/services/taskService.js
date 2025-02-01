const Task = require('../models/Task');

const createTask = async (taskData) => {
  return await Task.create(taskData);
};

const getTasksByProject = async (projectId) => {
  return await Task.findAll({ where: { project_id: projectId }, order: [['createdAt', 'DESC']] });
};

const getTaskById = async (taskId) => {
  return await Task.findByPk(taskId);
};

const updateTask = async (taskId, taskData) => {
  const task = await Task.findByPk(taskId);
  if (!task) throw new Error('Tarea no encontrada.');
  await task.update(taskData);
  return task;
};

const deleteTask = async (taskId) => {
  const task = await Task.findByPk(taskId);
  if (!task) throw new Error('Tarea no encontrada.');
  await task.destroy();
};

module.exports = {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  deleteTask,
};

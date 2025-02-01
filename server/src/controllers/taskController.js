const Task = require('../models/Task');

const createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la tarea' });
  }
};

const getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const tasks = await Task.findAll({ where: { project_id: projectId } });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las tareas' });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ error: 'Tarea no encontrada' });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la tarea' });
  }
};

const updateTask = async (req, res) => {
  try {
    const [updated] = await Task.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: 'Tarea no encontrada' });
    res.status(200).json({ message: 'Tarea actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la tarea' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const deleted = await Task.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Tarea no encontrada' });
    res.status(200).json({ message: 'Tarea eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la tarea' });
  }
};

module.exports = { createTask, getProjectTasks, getTaskById, updateTask, deleteTask };


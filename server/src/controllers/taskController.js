const Task = require('../models/Task');
const TaskUser = require('../models/TaskUser');
const User = require('../models/User');

const assignUserToTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { userId } = req.body;

    const task = await Task.findByPk(taskId);
    const user = await User.findByPk(userId);

    if (!task || !user) {
      return res.status(404).json({ error: 'Tarea o usuario no encontrado' });
    }

    // Verificar si ya está asignado
    const existingAssignment = await TaskUser.findOne({
      where: {
        task_id: taskId,
        user_id: userId
      }
    });

    if (existingAssignment) {
      return res.status(400).json({ error: 'El usuario ya está asignado a esta tarea' });
    }

    // Asignar usuario a tarea
    await TaskUser.create({
      task_id: taskId,
      user_id: userId
    });

    res.status(200).json({ message: 'Usuario asignado a la tarea correctamente' });
  } catch (error) {
    console.error('❌ Error al asignar usuario a tarea:', error);
    res.status(500).json({ error: 'Error al asignar usuario a tarea' });
  }
};
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
const removeUserFromTask = async (req, res) => {
  try {
    const { taskId, userId } = req.params;

    const deleted = await TaskUser.destroy({
      where: {
        task_id: taskId,
        user_id: userId
      }
    });

    if (!deleted) {
      return res.status(404).json({ error: 'El usuario no estaba asignado a esta tarea' });
    }

    res.status(200).json({ message: 'Usuario eliminado de la tarea correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar usuario de la tarea' });
  }
};


module.exports = { createTask, getProjectTasks, getTaskById, updateTask, deleteTask, assignUserToTask, removeUserFromTask };


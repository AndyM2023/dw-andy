const Task = require("../models/Task");
const TaskUser = require("../models/TaskUser");
const User = require("../models/User");

const createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);

    // Si se proporciona un usuario asignado, crear la asignación
    if (req.body.assigned_to) {
      await TaskUser.create({
        task_id: task.id,
        user_id: req.body.assigned_to,
      });
    }

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: "Error al crear la tarea" });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id, {
      include: [
        {
          model: User,
          through: { attributes: [] },
          attributes: ["id", "username"],
        },
      ],
    });

    if (!task) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

    const formattedTask = {
      ...task.toJSON(),
      assigned_to: task.Users[0]?.id || null,
      assigned_username: task.Users[0]?.username || null,
    };

    res.status(200).json(formattedTask);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la tarea" });
  }
};

const getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const tasks = await Task.findAll({
      where: { project_id: projectId },
      include: [
        {
          model: User,
          through: { attributes: [] },
          attributes: ["id", "username"],
        },
      ],
    });

    // Formatear las tareas para incluir la información del usuario asignado
    const formattedTasks = tasks.map((task) => ({
      ...task.toJSON(),
      assigned_to: task.Users[0]?.id ? Number(task.Users[0].id) : null,
      assigned_username: task.Users[0]?.username || null,
    }));
    console.log("Tasks being sent:", formattedTasks); // Debug log

    res.status(200).json(formattedTasks);
  } catch (error) {
    console.error("Error al obtener tareas:", error);
    res.status(500).json({ error: "Error al obtener las tareas" });
  }
};

const updateTask = async (req, res) => {
  try {
    const [updated] = await Task.update(req.body, {
      where: { id: req.params.id },
    });

    if (!updated) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

    // Si se actualiza el usuario asignado
    if (req.body.assigned_to !== undefined) {
      await TaskUser.destroy({ where: { task_id: req.params.id } });
      if (req.body.assigned_to) {
        await TaskUser.create({
          task_id: req.params.id,
          user_id: req.body.assigned_to,
        });
      }
    }

    res.status(200).json({ message: "Tarea actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la tarea" });
  }
};

const deleteTask = async (req, res) => {
  try {
    const deleted = await Task.destroy({ where: { id: req.params.id } });
    if (!deleted) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }
    res.status(200).json({ message: "Tarea eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la tarea" });
  }
};

const assignUserToTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { userId } = req.body;

    const task = await Task.findByPk(taskId);
    const user = await User.findByPk(userId);

    if (!task || !user) {
      return res.status(404).json({ error: "Tarea o usuario no encontrado" });
    }

    // Eliminar asignaciones previas
    await TaskUser.destroy({ where: { task_id: taskId } });

    // Crear nueva asignación
    await TaskUser.create({
      task_id: taskId,
      user_id: userId,
    });

    res
      .status(200)
      .json({ message: "Usuario asignado a la tarea correctamente" });
  } catch (error) {
    console.error("Error al asignar usuario a tarea:", error);
    res.status(500).json({ error: "Error al asignar usuario a tarea" });
  }
};

const removeUserFromTask = async (req, res) => {
  try {
    const { taskId, userId } = req.params;
    const deleted = await TaskUser.destroy({
      where: {
        task_id: taskId,
        user_id: userId,
      },
    });

    if (!deleted) {
      return res.status(404).json({ error: "Asignación no encontrada" });
    }

    res
      .status(200)
      .json({ message: "Usuario removido de la tarea correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al remover usuario de la tarea" });
  }
};

module.exports = {
  createTask,
  getTaskById,
  getProjectTasks,
  updateTask,
  deleteTask,
  assignUserToTask,
  removeUserFromTask,
};

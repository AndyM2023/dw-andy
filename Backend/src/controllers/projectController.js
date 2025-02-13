const Project = require("../models/Project");
const ProjectUser = require("../models/ProjectUser");
const User = require("../models/User");
const Task = require("../models/Task");
const TaskUser = require('../models/TaskUser');
const { Op } = require("sequelize");

const getUnassignedUsers = async (req, res) => {
  try {
    const { projectId } = req.params;

    const assignedUsers = await ProjectUser.findAll({
      where: { project_id: projectId },
      attributes: ["user_id"],
    });

    const assignedUserIds = assignedUsers.map((u) => u.user_id);

    const unassignedUsers = await User.findAll({
      where: {
        id: {
          [Op.notIn]: assignedUserIds,
        },
      },
      attributes: ["id", "username"],
    });

    res.status(200).json(unassignedUsers);
  } catch (error) {
    console.error("Error al obtener usuarios no asignados:", error);
    res.status(500).json({ error: "Error al obtener usuarios no asignados" });
  }
};

const removeUserFromProject = async (req, res) => {
  try {
    const { projectId, userId } = req.params;

    // Verificar si el usuario tiene tareas no completadas usando TaskUser
    const incompleteTasks = await Task.findOne({
      include: [{
        model: User,
        where: { id: userId },
        through: TaskUser
      }],
      where: {
        project_id: projectId,
        status: {
          [Op.notIn]: ['Completada']
        }
      }
    });

    if (incompleteTasks) {
      return res.status(400).json({
        error: 'No se puede remover el usuario porque tiene tareas pendientes o en progreso'
      });
    }

    // Primero eliminar las asignaciones de tareas
    await TaskUser.destroy({
      where: {
        user_id: userId
      }
    });

    // Luego eliminar la relación usuario-proyecto
    const deleted = await ProjectUser.destroy({
      where: {
        project_id: projectId,
        user_id: userId
      }
    });

    if (!deleted) {
      return res.status(404).json({ error: 'Asignación no encontrada' });
    }

    res.status(200).json({ message: 'Usuario removido exitosamente del proyecto' });
  } catch (error) {
    console.error('Error al remover usuario:', error);
    res.status(500).json({ error: 'Error al remover usuario del proyecto' });
  }
};


const createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);

    await ProjectUser.create({
      project_id: project.id,
      user_id: req.user.id,
      assigned_by: req.user.id,
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el proyecto" });
  }
};

const getProjects = async (req, res) => {
  try {
    let projects;

    if (req.user.role === "admin") {
      projects = await Project.findAll({
        include: [
          {
            model: User,
            through: { attributes: [] },
          },
        ],
      });
    } else {
      projects = await Project.findAll({
        include: [
          {
            model: User,
            where: { id: req.user.id },
            through: { attributes: [] },
          },
        ],
      });
    }

    res.json(projects);
  } catch (error) {
    console.error("❌ Error al obtener proyectos:", error);
    res.status(500).json({ error: "Error al obtener proyectos" });
  }
};

const assignUserToProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { userId } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ error: "Proyecto no encontrado" });
    }

    const existingAssignment = await ProjectUser.findOne({
      where: {
        project_id: projectId,
        user_id: userId,
      },
    });

    if (existingAssignment) {
      return res
        .status(400)
        .json({ error: "Usuario ya asignado a este proyecto" });
    }

    await ProjectUser.create({
      project_id: projectId,
      user_id: userId,
      assigned_by: req.user.id,
    });

    res
      .status(200)
      .json({ message: "Usuario asignado exitosamente al proyecto" });
  } catch (error) {
    res.status(500).json({ error: "Error al asignar usuario al proyecto" });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Project.update(req.body, {
      where: { id },
    });

    if (!updated) {
      return res.status(404).json({ error: "Proyecto no encontrado" });
    }

    const updatedProject = await Project.findByPk(id);
    res.status(200).json(updatedProject);
  } catch (error) {
    console.error("❌ Error al actualizar proyecto:", error);
    res.status(500).json({ error: "Error al actualizar el proyecto" });
  }
};

const getProjectUsers = async (req, res) => {
  try {
    const { projectId } = req.params;
    const users = await User.findAll({
      include: [
        {
          model: Project,
          where: { id: projectId },
          through: { attributes: [] },
        },
      ],
    });

    res.status(200).json(users);
  } catch (error) {
    console.error("Error al obtener usuarios del proyecto:", error);
    res.status(500).json({ error: "Error al obtener usuarios del proyecto" });
  }
};

const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id, {
      include: [
        {
          model: User,
          through: { attributes: [] },
        },
      ],
    });

    if (!project) {
      return res.status(404).json({ error: "Proyecto no encontrado" });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error("Error al obtener el proyecto:", error);
    res.status(500).json({ error: "Error al obtener el proyecto" });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`🔍 Intentando eliminar el proyecto con ID: ${id}`);

    // Verificar si hay tareas pendientes o en progreso
    const incompleteTasks = await Task.findOne({
      where: {
        project_id: id,
        status: {
          [Op.notIn]: ["Completada"],
        },
      },
    });

    if (incompleteTasks) {
      return res.status(400).json({
        error:
          "❌ No se puede eliminar el proyecto porque tiene tareas pendientes o en progreso",
      });
    }

    console.log(
      "✅ Todas las tareas están completadas, procediendo a eliminar...",
    );

    // ELIMINAR TODAS LAS TAREAS DEL PROYECTO
    const deletedTasks = await Task.destroy({ where: { project_id: id } });
    console.log(`📌 ${deletedTasks} tareas eliminadas del proyecto.`);

    // Eliminar relaciones en la tabla intermedia
    const deletedProjectUsers = await ProjectUser.destroy({
      where: { project_id: id },
    });
    console.log(
      `👥 ${deletedProjectUsers} relaciones usuario-proyecto eliminadas.`,
    );

    // Ahora eliminar el proyecto
    const deletedProject = await Project.destroy({ where: { id } });

    if (!deletedProject) {
      console.log("❌ Proyecto no encontrado.");
      return res.status(404).json({ error: "Proyecto no encontrado" });
    }

    console.log("✅ Proyecto eliminado correctamente.");
    res.status(200).json({ message: "✅ Proyecto eliminado correctamente" });
  } catch (error) {
    console.error("🔥 Error en deleteProject:", error.message, error.stack);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createProject,
  getProjects,
  assignUserToProject,
  removeUserFromProject,
  getProjectUsers,
  getProjectById,
  updateProject,
  deleteProject,
  getUnassignedUsers,
};

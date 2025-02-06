const Project = require('../models/Project');
const ProjectUser = require('../models/ProjectUser');
const User = require('../models/User');

//nuevo
const { Op } = require('sequelize');


// Nueva función para obtener usuarios no asignados
const getUnassignedUsers = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    // Obtener IDs de usuarios ya asignados al proyecto
    const assignedUsers = await ProjectUser.findAll({
      where: { project_id: projectId },
      attributes: ['user_id']
    });
    
    const assignedUserIds = assignedUsers.map(u => u.user_id);

    // Obtener usuarios no asignados
    const unassignedUsers = await User.findAll({
      where: {
        id: {
          [Op.notIn]: assignedUserIds
        }
      },
      attributes: ['id', 'username']
    });

    res.status(200).json(unassignedUsers);
  } catch (error) {
    console.error('Error al obtener usuarios no asignados:', error);
    res.status(500).json({ error: 'Error al obtener usuarios no asignados' });
  }
};

//----------------------------------------------------------------

const createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);
    
    // Asignar automáticamente al creador del proyecto
    await ProjectUser.create({
      project_id: project.id,
      user_id: req.user.id,
      assigned_by: req.user.id
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el proyecto' });
  }
};

const getProjects = async (req, res) => {
  try {
    let projects;
    
    if (req.user.role === 'admin') {
      // Administradores ven todos los proyectos
      projects = await Project.findAll({
        include: [{
          model: User,
          through: { attributes: [] }
        }]
      });
    } else {
      // Usuarios normales solo ven sus proyectos asignados
      projects = await Project.findAll({
        include: [{
          model: User,
          where: { id: req.user.id },
          through: { attributes: [] }
        }]
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

    // Verificar si el usuario existe
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar si el proyecto existe
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    // Verificar si ya está asignado
    const existingAssignment = await ProjectUser.findOne({
      where: {
        project_id: projectId,
        user_id: userId
      }
    });

    if (existingAssignment) {
      return res.status(400).json({ error: 'Usuario ya asignado a este proyecto' });
    }

    // Crear la asignación
    await ProjectUser.create({
      project_id: projectId,
      user_id: userId,
      assigned_by: req.user.id
    });

    res.status(200).json({ message: 'Usuario asignado exitosamente al proyecto' });
  } catch (error) {
    res.status(500).json({ error: 'Error al asignar usuario al proyecto' });
  }
};

const removeUserFromProject = async (req, res) => {
  try {
    const { projectId, userId } = req.params;

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
    res.status(500).json({ error: 'Error al remover usuario del proyecto' });
  }
};
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Project.update(req.body, {
      where: { id },
    });

    if (!updated) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    const updatedProject = await Project.findByPk(id);
    res.status(200).json(updatedProject);
  } catch (error) {
    console.error("❌ Error al actualizar proyecto:", error);
    res.status(500).json({ error: 'Error al actualizar el proyecto' });
  }
};



const getProjectUsers = async (req, res) => {
  try {
    const { projectId } = req.params;
    const users = await User.findAll({
      include: [{
        model: Project,
        where: { id: projectId },
        through: { attributes: [] }
      }]
    });

    res.status(200).json(users);
  } catch (error) {
    console.error('Error al obtener usuarios del proyecto:', error);
    res.status(500).json({ error: 'Error al obtener usuarios del proyecto' });
  }
};


const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id, {
      include: [
        {
          model: User,
          through: { attributes: [] }, // Para no mostrar los datos intermedios
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

    const deleted = await Project.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ error: "Proyecto no encontrado" });
    }

    res.status(200).json({ message: "Proyecto eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar el proyecto:", error);
    res.status(500).json({ error: "Error al eliminar el proyecto" });
  }
};
module.exports = { 
  createProject, 
  getProjects, 
  assignUserToProject, 
  removeUserFromProject, 
  getProjectUsers ,
  getProjectById ,
  updateProject ,
  deleteProject  ,
  getProjectUsers,
  getUnassignedUsers
};
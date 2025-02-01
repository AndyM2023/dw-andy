const Project = require('../models/Project');

const createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el proyecto' });
  }
};

const getProjects = async (req, res) => {
  try {
    const { user_id } = req.query; // Tomamos el user_id de la consulta
    
    let projects;
    if (user_id) {
      // Si se envía user_id, devolver solo los proyectos del usuario
      projects = await Project.findAll({ where: { user_id } });
    } else {
      // Si NO se envía user_id, devolver todos los proyectos
      projects = await Project.findAll();
    }

    res.json(projects); // ✅ Asegurar que siempre se devuelve un array
  } catch (error) {
    console.error("❌ Error al obtener proyectos:", error);
    res.status(500).json({ error: "Error al obtener proyectos" });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el proyecto' });
  }
};

const updateProject = async (req, res) => {
  try {
    const [updated] = await Project.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: 'Proyecto no encontrado' });
    res.status(200).json({ message: 'Proyecto actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el proyecto' });
  }
};

const deleteProject = async (req, res) => {
  try {
    const deleted = await Project.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Proyecto no encontrado' });
    res.status(200).json({ message: 'Proyecto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el proyecto' });
  }
};

module.exports = { createProject, getProjects, getProjectById, updateProject, deleteProject };

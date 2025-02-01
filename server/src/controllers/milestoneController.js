const Milestone = require('../models/Milestone');

const createMilestone = async (req, res) => {
  try {
    const milestone = await Milestone.create(req.body);
    res.status(201).json(milestone);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el hito' });
  }
};

const getProjectMilestones = async (req, res) => {
  try {
    const { projectId } = req.params;
    const milestones = await Milestone.findAll({ where: { project_id: projectId } });
    res.status(200).json(milestones);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los hitos' });
  }
};

const updateMilestone = async (req, res) => {
  try {
    const [updated] = await Milestone.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: 'Hito no encontrado' });
    res.status(200).json({ message: 'Hito actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el hito' });
  }
};

const deleteMilestone = async (req, res) => {
  try {
    const deleted = await Milestone.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Hito no encontrado' });
    res.status(200).json({ message: 'Hito eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el hito' });
  }
};

module.exports = { createMilestone, getProjectMilestones, updateMilestone, deleteMilestone };

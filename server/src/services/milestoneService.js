const Milestone = require('../models/Milestone');

const createMilestone = async (milestoneData) => {
  return await Milestone.create(milestoneData);
};

const getMilestonesByProject = async (projectId) => {
  return await Milestone.findAll({ where: { project_id: projectId }, order: [['due_date', 'ASC']] });
};

const updateMilestone = async (milestoneId, milestoneData) => {
  const milestone = await Milestone.findByPk(milestoneId);
  if (!milestone) throw new Error('Hito no encontrado.');
  await milestone.update(milestoneData);
  return milestone;
};

const deleteMilestone = async (milestoneId) => {
  const milestone = await Milestone.findByPk(milestoneId);
  if (!milestone) throw new Error('Hito no encontrado.');
  await milestone.destroy();
};

module.exports = {
  createMilestone,
  getMilestonesByProject,
  updateMilestone,
  deleteMilestone,
};

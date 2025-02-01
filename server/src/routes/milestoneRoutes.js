const express = require('express');
const {
  createMilestone,
  getProjectMilestones,
  updateMilestone,
  deleteMilestone
} = require('../controllers/milestoneController');

const router = express.Router();

// Rutas de hitos
router.post('/', createMilestone); // Crear un hito
router.get('/project/:projectId', getProjectMilestones); // Obtener hitos de un proyecto
router.put('/:id', updateMilestone); // Actualizar un hito
router.delete('/:id', deleteMilestone); // Eliminar un hito

module.exports = router;

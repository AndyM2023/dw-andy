const express = require('express');
const {
  createProject,
  getProjects,
  assignUserToProject,
  removeUserFromProject,
  getProjectUsers,
  updateProject,
  getProjectById,
  deleteProject,
  getUnassignedUsers,


} = require('../controllers/projectController');
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();


router.use(authMiddleware);

// Rutas básicas de proyectos
router.post('/', isAdmin, createProject); // Solo admin puede crear proyectos
router.get('/', getProjects); // Filtrado por rol en el controlador
router.get("/:id", authMiddleware, getProjectById);
router.put('/:id', updateProject); 
// Rutas de gestión de usuarios en proyectos
router.post('/:projectId/users', isAdmin, assignUserToProject); // Solo admin puede asignar usuarios
router.delete('/:projectId/users/:userId', isAdmin, removeUserFromProject); // Solo admin puede remover usuarios
router.get('/:projectId/users', getProjectUsers); // Todos pueden ver los usuarios de un proyecto
router.delete('/:id', authMiddleware, deleteProject);
router.get('/:projectId/unassigned-users', getUnassignedUsers);

module.exports = router;
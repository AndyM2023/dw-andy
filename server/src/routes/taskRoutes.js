const express = require('express');
const {
  createTask,
  getProjectTasks,
  getTaskById,
  updateTask,
  deleteTask,
  assignUserToTask,
  removeUserFromTask,
} = require('../controllers/taskController');// Asegúrate de que están bien importadas

const { authMiddleware } = require('../middleware/authMiddleware');
const router = express.Router();

// Definir las rutas de tareas
router.post('/', createTask); // Crear una nueva tarea
router.get('/project/:projectId', getProjectTasks); // Obtener todas las tareas de un proyecto
router.get('/:id', getTaskById); // Obtener una tarea específica
router.put('/:id', updateTask); // Actualizar una tarea
router.delete('/:id', deleteTask); // Eliminar una tarea
router.post('/:taskId/assign', authMiddleware, assignUserToTask);
router.delete('/:taskId/users/:userId', authMiddleware, removeUserFromTask);

module.exports = router;

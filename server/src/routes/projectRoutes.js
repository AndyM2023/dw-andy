const express = require('express');
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require('../controllers/projectController'); // Todas las funciones deben estar aquí

const router = express.Router();

// Definir las rutas de proyectos
router.post('/', createProject); // Crear un proyecto
router.get('/', getProjects); // Obtener todos los proyectos
router.get('/:id', getProjectById); // Obtener un proyecto específico
router.put('/:id', updateProject); // Actualizar un proyecto
router.delete('/:id', deleteProject); // Eliminar un proyecto

module.exports = router;

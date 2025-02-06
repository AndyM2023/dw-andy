import React, { useState } from 'react';
import TaskForm from '../tasks/TaskForm';

function ProjectCard({ project, onEdit, onDelete }) {
  const [showTaskForm, setShowTaskForm] = useState(false);

  return (
    <div className="bg-gray-700 p-4 rounded-lg shadow-lg text-white w-full max-w-md">
      <h3 className="text-lg font-bold">{project.name}</h3>
      <p className="text-sm text-gray-400">{project.description}</p>
      <p className="text-sm">📅 Inicio: {project.start_date}</p>
      <p className="text-sm">📅 Fin: {project.end_date}</p>

      <div className="mt-3 flex space-x-2">
        <button
          onClick={() => onEdit(project)}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(project.id)}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Eliminar
        </button>
        <button
          onClick={() => setShowTaskForm(!showTaskForm)}
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {showTaskForm ? "Cancelar" : "Agregar Tarea"}
        </button>
      </div>

      {showTaskForm && (
        <TaskForm
          projectId={project.id}
          onSave={() => setShowTaskForm(false)} // Cierra el formulario después de guardar
          onCancel={() => setShowTaskForm(false)} // Cierra si el usuario cancela
        />
      )}
    </div>
  );
}

export default ProjectCard;
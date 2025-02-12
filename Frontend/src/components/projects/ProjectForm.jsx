import React, { useState } from 'react';
import Swal from 'sweetalert2';

function ProjectForm({ project, onSave, onCancel }) {
  const [name, setName] = useState(project?.name || '');
  const [description, setDescription] = useState(project?.description || '');
  const [startDate, setStartDate] = useState(project?.start_date ? project.start_date.split("T")[0] : "");
  const [endDate, setEndDate] = useState(project?.end_date ? project.end_date.split("T")[0] : "");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !description.trim() || !startDate || !endDate) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Todos los campos son obligatorios'
      });
      return;
    }

    if (new Date(startDate) >= new Date(endDate)) {
      Swal.fire({
        icon: 'warning',
        title: 'Fechas inválidas',
        text: 'La fecha de inicio debe ser anterior a la fecha de finalización'
      });
      return;
    }

    const projectData = {
      name,
      description,
      start_date: startDate,
      end_date: endDate
    };

    try {
      await onSave(projectData);
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: `Proyecto ${project ? 'actualizado' : 'creado'} correctamente`
      });
    } catch (error) {
      console.error('Error al guardar el proyecto:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo guardar el proyecto'
      });
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
      <h2 className="text-xl font-bold mb-4 text-white">
        {project ? 'Editar Proyecto' : 'Nuevo Proyecto'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Nombre del Proyecto
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">
            Descripción
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
            rows="3"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">
            Fecha de Inicio
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">
            Fecha de Finalización
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
            required
          />
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Guardar
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProjectForm;
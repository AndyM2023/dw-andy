import React, { useState } from 'react';

function MilestoneForm({ milestone, projectId, onSave, onCancel }) {
  const [title, setTitle] = useState(milestone?.title || '');
  const [description, setDescription] = useState(milestone?.description || '');
  const [dueDate, setDueDate] = useState(milestone?.due_date || '');
  const [status, setStatus] = useState(milestone?.status || 'pending');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      title,
      description,
      due_date: dueDate,
      status,
      project_id: projectId
    });
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">
        {milestone ? 'Editar Hito' : 'Nuevo Hito'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Título
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">
            Fecha límite
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">
            Estado
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
          >
            <option value="pending">Pendiente</option>
            <option value="completed">Completado</option>
          </select>
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

export default MilestoneForm;
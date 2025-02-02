

import React, { useState } from 'react';

function ProjectForm({ project, onSave, onCancel }) {
  const [name, setName] = useState(project?.name || '');
  const [description, setDescription] = useState(project?.description || '');
  const [startDate, setStartDate] = useState(project?.start_date ? project.start_date.split("T")[0] : "");
  const [endDate, setEndDate] = useState(project?.end_date ? project.end_date.split("T")[0] : "");


  const handleSubmit = (e) => {
    e.preventDefault();
  
    const userId = localStorage.getItem('user_id');
  

    if (!userId || userId === "undefined" || userId === "null") {
      console.error("❌ user_id no está definido en localStorage");
      return;
    }

    if (new Date(startDate) >= new Date(endDate)) {
      alert("⚠️ La fecha de inicio debe ser menor a la fecha de finalización.");
      return;
    }

    if (!name.trim() || !description.trim() || !startDate || !endDate) {
      alert("⚠️ Todos los campos son obligatorios.");
      return;
    }

    const today = new Date().toISOString().split("T")[0]; // Fecha actual en formato "YYYY-MM-DD"

    if (startDate < today) {
      alert("⚠️ La fecha de inicio no puede ser en el pasado.");
      return;
    }

    
    const projectData = {
      name,
      description,
      start_date: startDate,
      end_date: endDate,
      user_id: Number(userId)
    };
  
    const API_BASE_URL = "http://localhost:3001/api/projects";
    const url = project ? `${API_BASE_URL}/${project.id}` : API_BASE_URL;
    const method = project ? 'PUT' : 'POST';
  
    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(projectData)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`❌ Error en el servidor: ${response.status} ${response.statusText}`);
      }
      return response.json().catch(() => {
        throw new Error("❌ La respuesta del servidor no es JSON válido");
      });
    })
    .then(data => {
      console.log("✅ Proyecto guardado:", data);
      alert(project ? "✅ Proyecto actualizado correctamente!" : "✅ Proyecto creado correctamente!");
      window.location.reload(); // ✅ Recargar la página
    })
    .catch(error => console.error("❌ Error al guardar el proyecto:", error.message));
  };
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">
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
import React from 'react';

function MilestoneList({ milestones, onEdit, onDelete }) {
  const statusColors = {
    pending: 'bg-yellow-500',
    completed: 'bg-green-500'
  };

  return (
    <div className="space-y-4">
      {milestones.map((milestone) => (
        <div
          key={milestone.id}
          className="bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-lg font-semibold">{milestone.title}</h4>
            <span className={`px-2 py-1 rounded text-sm ${statusColors[milestone.status]}`}>
              {milestone.status}
            </span>
          </div>
          <p className="text-gray-300 text-sm mb-3">{milestone.description}</p>
          <div className="text-sm mb-3">
            <span className="text-gray-400">Fecha límite: </span>
            <span>{new Date(milestone.due_date).toLocaleDateString()}</span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(milestone)}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Editar
            </button>
            <button
              onClick={() => onDelete(milestone.id)}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MilestoneList;
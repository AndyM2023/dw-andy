import React from 'react';

function TaskList({ tasks, onEdit, onDelete, onStatusChange }) {
  const statusColors = {
    Pendiente: 'bg-yellow-500',
    'En Progreso': 'bg-blue-500',
    Completada: 'bg-green-500'
  };

  const priorityColors = {
    Alta: 'text-red-400',
    Media: 'text-yellow-400',
    Baja: 'text-green-400'
  };

  return (
    <div className="space-y-4">
      {tasks.length === 0 ? (
        <p className="text-gray-400">No hay tareas disponibles.</p>
      ) : (
        tasks.map((task) => (
          <div
            key={task.id}
            className="bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-lg font-semibold">{task.title}</h4>
              <span className={`px-2 py-1 rounded text-sm ${statusColors[task.status]}`}>
                {task.status}
              </span>
            </div>
            <p className="text-gray-300 text-sm mb-3">{task.description}</p>
            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
              <div>
                <span className="text-gray-400">📅 Inicio: </span>
                <span>{new Date(task.start_date).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-gray-400">🏁 Vencimiento: </span>
                <span>{new Date(task.due_date).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-gray-400">📌 Prioridad: </span>
                <span className={priorityColors[task.priority]}>{task.priority}</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <select
                value={task.status}
                onChange={(e) => onStatusChange(task.id, e.target.value)}
                className="bg-gray-700 text-white rounded px-2 py-1 text-sm"
              >
                <option value="Pendiente">Pendiente</option>
                <option value="En Progreso">En Progreso</option>
                <option value="Completada">Completada</option>
              </select>
              <button
                onClick={() => onEdit(task)}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                ✏️ Editar
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                🗑️ Eliminar
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default TaskList;

import React from "react";

function PriorityFilter({ selectedPriority, onChange }) {
  const handlePriorityChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <div className="mb-4">
      <label htmlFor="priority-filter" className="mr-2 text-white text-2xl">
        Prioridad:
      </label>
      <select
        id="priority-filter"
        value={selectedPriority}
        onChange={handlePriorityChange}
        className="px-3 py-2 bg-gray-700 text-white rounded"
      >
        <option value="Todas">Todas</option>
        <option value="Alta">Alta</option>
        <option value="Media">Media</option>
        <option value="Baja">Baja</option>
      </select>
    </div>
  );
}

export default PriorityFilter;

import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

function UserRemovalForm({ projectId, onClose, onRemove }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjectUsers();
  }, []);

  const fetchProjectUsers = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `http://localhost:3001/api/projects/${projectId}/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) {
        throw new Error("Error al obtener usuarios");
      }
      const data = await response.json();
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los usuarios",
      });
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser) {
      Swal.fire({
        icon: "warning",
        title: "Seleccione un usuario",
        text: "Debe seleccionar un usuario para removerlo del proyecto",
      });
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `http://localhost:3001/api/projects/${projectId}/users/${selectedUser}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Usuario removido",
          text: "El usuario ha sido removido exitosamente del proyecto",
        });
        onRemove();
      } else {
        Swal.fire({
          icon: "error",
          title: "No se puede remover el usuario",
          text:
            data.error || "El usuario tiene tareas pendientes o en progreso",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al remover el usuario del proyecto",
      });
    }
  };

  if (loading) {
    return <div className="text-white">Cargando usuarios...</div>;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-white">
          Remover Usuario del Proyecto
        </h2>
        {users.length === 0 ? (
          <p className="text-white">No hay usuarios asignados al proyecto</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Seleccionar Usuario a Remover
              </label>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                required
              >
                <option value="">Seleccione un usuario</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-sm text-gray-400">
                Nota: Solo se pueden remover usuarios que no tengan tareas
                pendientes o en progreso
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Remover
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default UserRemovalForm;

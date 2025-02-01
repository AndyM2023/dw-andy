import React, { useEffect, useState } from 'react';
import ProjectList from './ProjectList';

const ProjectContainer = () => {
  const [projects, setProjects] = useState([]); // Estado para los proyectos
  const [error, setError] = useState(''); // Estado para manejar errores

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const userId = localStorage.getItem('user_id'); // Obtener user_id del localStorage
        console.log("🔑 Valor REAL de user_id en localStorage:", userId);
        if (!userId || userId === "undefined" || userId === "null") {
          console.error("❌ user_id inválido:", userId);
          setError('Usuario no autenticado. Redirigiendo...');
          return;
        }
        
        const url = `http://localhost:3001/api/projects?user_id=${encodeURIComponent(userId)}`;
        console.log("🔍 URL generada en frontend:", url); // 👀 Para verificar
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log("📦 Respuesta del backend:", data); // 👀 Verifica qué llega del backend

        if (Array.isArray(data)) {
          setProjects(data); // Almacenar los proyectos en el estado
        } else {
          setError('No se pudieron cargar los proyectos.');
        }
      } catch (err) {
        console.error('❌ Error al obtener los proyectos:', err);
        setError('Error al obtener los proyectos.');
      }
    };

    fetchProjects();
  }, []);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Lista de Proyectos</h1>
      <ProjectList
        projects={projects}
        onEdit={(project) => console.log('Editar proyecto:', project)}
        onDelete={(id) => console.log('Eliminar proyecto con ID:', id)}
      />
    </div>
  );
};

export default ProjectContainer;

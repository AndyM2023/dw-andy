import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

function BurndownChart({ tasks, startDate, endDate }) {
  const chartRef = useRef();
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');

    // Calcular datos para el gráfico
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    const daysTotal = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
    const daysElapsed = Math.ceil((new Date() - new Date(startDate)) / (1000 * 60 * 60 * 24));

    // Línea ideal
    const idealBurndown = Array.from({ length: daysTotal + 1 }, (_, i) => ({
      x: i,
      y: totalTasks * (1 - i / daysTotal)
    }));

    // Línea actual
    const actualBurndown = Array.from({ length: daysElapsed + 1 }, (_, i) => ({
      x: i,
      y: totalTasks - (completedTasks * (i / daysElapsed))
    }));

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'Ideal',
            data: idealBurndown,
            borderColor: '#3B82F6',
            borderDash: [5, 5],
            fill: false
          },
          {
            label: 'Actual',
            data: actualBurndown,
            borderColor: '#EF4444',
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            type: 'linear',
            title: {
              display: true,
              text: 'Días'
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Tareas Pendientes'
            }
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Gráfico de Burndown'
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [tasks, startDate, endDate]);

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <canvas ref={chartRef}></canvas>
    </div>
  );
}

export default BurndownChart;
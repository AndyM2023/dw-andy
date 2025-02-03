import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const GanttChart = ({ tasks }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!tasks || tasks.length === 0) return;

    const margin = { top: 50, right: 30, bottom: 50, left: 120 };
    const width = 800 - margin.left - margin.right;
    const height = tasks.length * 40;

    // Limpiar SVG antes de renderizar
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Convertir fechas
    const parseDate = d3.timeParse("%Y-%m-%dT%H:%M:%S.%LZ");

    const today = new Date(); // 📅 Obtener la fecha actual

    // Modificar estados para marcar tareas atrasadas
    const updatedTasks = tasks.map((task) => {
      const dueDate = new Date(task.due_date);
      if (task.status !== "Completada" && dueDate < today) {
        return { ...task, status: "Atrasada" };
      }
      return task;
    });

    // Escala de tiempo
    const minDate = d3.min(updatedTasks, (d) => parseDate(d.start_date));
    const maxDate = d3.max(updatedTasks, (d) => parseDate(d.due_date));
    const xScale = d3.scaleTime().domain([minDate, maxDate]).range([0, width]);

    // Escala de posición vertical (tareas)
    const yScale = d3
      .scaleBand()
      .domain(updatedTasks.map((d) => d.title))
      .range([0, height])
      .padding(0.3);

    // Eje X (fechas)
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(xScale).ticks(6).tickFormat(d3.timeFormat("%b %d")))
      .selectAll("text")
      .style("fill", "#ccc");

    // Eje Y (nombres de tareas)
    svg
      .append("g")
      .call(d3.axisLeft(yScale))
      .selectAll("text")
      .style("fill", "#ccc");

    // Colores según estado (Incluye "Atrasada")
    const colorMap = {
      "Completada": "#4CAF50",
      "Pendiente": "#FFC107",
      "En Progreso": "#2196F3",
      "Atrasada": "#F44336",
    };

    // Agregar barras de tareas
    svg
      .selectAll(".bar")
      .data(updatedTasks)
      .enter()
      .append("rect")
      .attr("x", (d) => xScale(parseDate(d.start_date)))
      .attr("y", (d) => yScale(d.title))
      .attr("width", (d) => xScale(parseDate(d.due_date)) - xScale(parseDate(d.start_date)))
      .attr("height", yScale.bandwidth())
      .attr("fill", (d) => colorMap[d.status] || "#ccc")
      .attr("rx", 5)
      .attr("ry", 5)
      .on("mouseover", (event, d) => {
        tooltip
          .style("visibility", "visible")
          .html(
            `<strong>${d.title}</strong><br>
            📅 Inicio: ${new Date(d.start_date).toLocaleDateString()}<br>
            🏁 Fin: ${new Date(d.due_date).toLocaleDateString()}<br>
            🔹 Estado: ${d.status === "Atrasada" ? "❌ Atrasada" : d.status}`
          );
      })
      .on("mousemove", (event) => {
        tooltip
          .style("top", `${event.pageY - 20}px`)
          .style("left", `${event.pageX + 10}px`);
      })
      .on("mouseout", () => tooltip.style("visibility", "hidden"));

    // Tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("background", "rgba(0,0,0,0.8)")
      .style("color", "white")
      .style("padding", "8px")
      .style("border-radius", "5px")
      .style("visibility", "hidden");

  }, [tasks]);

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-md text-center">
      <h2 className="text-white text-xl font-bold mb-3">📊 Diagrama de Gantt</h2>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default GanttChart;

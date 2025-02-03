import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

function BurndownChart({ tasks, startDate, endDate }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!tasks || tasks.length === 0) return;

    const margin = { top: 40, right: 50, bottom: 60, left: 80 };
    const width = 700 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Convertir fechas
    const parseDate = d3.timeParse("%Y-%m-%dT%H:%M:%S.%LZ");
    const projectStart = new Date(startDate);
    const projectEnd = new Date(endDate);
    const today = new Date();

    const totalTasks = tasks.length;

    // Escalas
    const xScale = d3.scaleTime().domain([projectStart, projectEnd]).range([0, width]);
    const yScale = d3.scaleLinear().domain([0, totalTasks]).range([height, 0]);

    // Ejes
    const xAxis = d3.axisBottom(xScale).ticks(8).tickFormat(d3.timeFormat("%b %d"));
    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .selectAll("text")
      .style("fill", "#ccc");

    svg.append("g").call(yAxis).selectAll("text").style("fill", "#ccc");

    // Etiquetas de ejes
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height + 40)
      .attr("fill", "#ccc")
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .text("📆 Días del Proyecto");

    svg.append("text")
      .attr("x", -height / 2)
      .attr("y", -50)
      .attr("fill", "#ccc")
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .attr("transform", "rotate(-90)")
      .text("📌 Tareas Pendientes");

    // Línea ideal (Burndown)
    const idealBurndown = [
      { date: projectStart, tasksLeft: totalTasks },
      { date: projectEnd, tasksLeft: 0 },
    ];

    const lineGenerator = d3.line()
      .x(d => xScale(d.date))
      .y(d => yScale(d.tasksLeft))
      .curve(d3.curveMonotoneX);

    svg.append("path")
      .datum(idealBurndown)
      .attr("fill", "none")
      .attr("stroke", "#00bcd4")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "5,5")
      .attr("d", lineGenerator);

    // Línea real (Burndown Actual)
    const actualBurndown = [];
    let remainingTasks = totalTasks;

    const sortedTasks = tasks
      .map(task => ({
        ...task,
        date: parseDate(task.due_date),
      }))
      .sort((a, b) => a.date - b.date);

    sortedTasks.forEach(task => {
      if (task.status === "Completada") {
        remainingTasks -= 1;
      }
      actualBurndown.push({ date: task.date, tasksLeft: remainingTasks });
    });

    const pathActual = svg.append("path")
      .datum(actualBurndown)
      .attr("fill", "none")
      .attr("stroke", "#00ff88")
      .attr("stroke-width", 3)
      .attr("d", lineGenerator);

    const totalLength = pathActual.node().getTotalLength();
    pathActual
      .attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(2000)
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0);

    // Puntos de la línea real con colores según estado
    svg.selectAll("circle")
      .data(actualBurndown)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d.date))
      .attr("cy", d => yScale(d.tasksLeft))
      .attr("r", 5)
      .attr("fill", d => {
        const task = tasks.find(task => parseDate(task.due_date).getTime() === d.date.getTime());
        if (!task) return "#ccc";
        if (task.status === "Completada") return "#10B981"; // Verde
        if (d.date < today) return "#EF4444"; // Rojo (Atrasada)
        return "#3B82F6"; // Azul (En progreso)
      })
      .attr("stroke", "white");

    // Tooltip con estado de la tarea
    const tooltip = d3.select("body")
      .append("div")
      .style("position", "absolute")
      .style("background", "rgba(0,0,0,0.8)")
      .style("color", "white")
      .style("padding", "8px")
      .style("border-radius", "5px")
      .style("visibility", "hidden");

    svg.selectAll("circle")
      .on("mouseover", (event, d) => {
        const task = tasks.find(task => parseDate(task.due_date).getTime() === d.date.getTime());
        let estado = "⏳ En progreso";
        if (task) {
          if (task.status === "Completada") estado = "✅ Completada a tiempo";
          else if (d.date < today) estado = "❌ Atrasada";
        }
        tooltip.style("visibility", "visible")
          .html(`
            📅 ${d3.timeFormat("%b %d")(d.date)}<br>
            📌 ${d.tasksLeft} tareas restantes <br>
            ⚠️ Estado: <strong>${estado}</strong>
          `);
      })
      .on("mousemove", event => {
        tooltip.style("top", `${event.pageY - 20}px`).style("left", `${event.pageX + 10}px`);
      })
      .on("mouseout", () => tooltip.style("visibility", "hidden"));
  }, [tasks, startDate, endDate]);

  return (
    <div className="flex justify-center">
      <div className="bg-gray-900 p-6 rounded-lg shadow-md text-center">
        <h2 className="text-white text-xl font-bold mb-3">📉 Burndown Chart</h2>
        <svg ref={svgRef}></svg>
      </div>
    </div>
  );
}

export default BurndownChart;

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

    const parseDate = d3.timeParse("%Y-%m-%dT%H:%M:%S.%LZ");
    const projectStart = new Date(startDate);
    const projectEnd = new Date(endDate);
    const today = new Date();

    const totalTasks = tasks.length;

    const xScale = d3.scaleTime().domain([projectStart, projectEnd]).range([0, width]);
    const yScale = d3.scaleLinear().domain([0, totalTasks]).range([height, 0]);

    const xAxis = d3.axisBottom(xScale).ticks(8).tickFormat(d3.timeFormat("%b %d"));
    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .selectAll("text")
      .style("fill", "#ccc");

    svg.append("g").call(yAxis).selectAll("text").style("fill", "#ccc");

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

    const actualBurndown = [];
    let remainingTasks = totalTasks;

    const sortedTasks = tasks
      .map(task => ({
        ...task,
        date: task.status === "Completada" ? 
          new Date(task.updatedAt) : 
          parseDate(task.due_date),   
        isCompleted: task.status === "Completada"
      }))
      .sort((a, b) => a.date - b.date);

    sortedTasks.forEach(task => {
      if (task.isCompleted) {
        remainingTasks -= 1;
      }
      actualBurndown.push({
        date: task.date,
        tasksLeft: remainingTasks,
        task: task
      });
    });

    if (actualBurndown.length > 0) {
      const lastPoint = actualBurndown[actualBurndown.length - 1];
      if (today > lastPoint.date) {
        actualBurndown.push({
          date: today,
          tasksLeft: remainingTasks
        });
      }
    }

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

    svg.selectAll("circle")
      .data(actualBurndown)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d.date))
      .attr("cy", d => yScale(d.tasksLeft))
      .attr("r", 5)
      .attr("fill", d => {
        if (!d.task) return "#ccc";
        if (d.task.status === "Completada") return "#10B981";
        if (d.date < today) return "#EF4444";
        return "#3B82F6";
      })
      .attr("stroke", "white");

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
        let tooltipContent = `
          📅 ${d3.timeFormat("%b %d")(d.date)}<br>
          📌 ${d.tasksLeft} tareas restantes<br>
        `;
        
        if (d.task) {
          let estado = d.task.status === "Completada" ? "✅ Completada" :
                      d.date < today ? "❌ Atrasada" : "⏳ En progreso";
          tooltipContent += `⚠️ Estado: <strong>${estado}</strong><br>`;
          
          if (d.task.status === "Completada" && d.task.updatedAt) {
            const completionDate = new Date(d.task.updatedAt);
            tooltipContent += `🗓️ Completada el: ${d3.timeFormat("%b %d, %Y")(completionDate)}<br>`;
          }

          // **NUEVO: Agregar nombre y prioridad de la tarea**
          tooltipContent += `📝 Tarea: <strong>${d.task.title}</strong><br>`;
          tooltipContent += `🔺 Prioridad: <strong>${d.task.priority}</strong>`;
        }
        
        tooltip
          .style("visibility", "visible")
          .html(tooltipContent);
      })
      .on("mousemove", event => {
        tooltip
          .style("top", `${event.pageY - 20}px`)
          .style("left", `${event.pageX + 10}px`);
      })
      .on("mouseout", () => tooltip.style("visibility", "hidden"));

    return () => {
      d3.select("body").selectAll("div.tooltip").remove();
    };
  }, [tasks, startDate, endDate]);

  return (
    <div className="flex justify-center">
      <div className="bg-gray-900 p-6 rounded-lg shadow-md text-center">
        <svg ref={svgRef}></svg>
      </div>
    </div>
  );
}

export default BurndownChart;




import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function GanttChart({ tasks, milestones }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!tasks.length) return;

    const margin = { top: 20, right: 30, bottom: 30, left: 100 };
    const width = 800 - margin.left - margin.right;
    const height = tasks.length * 40;

    // Limpiar SVG existente
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Escala temporal
    const timeScale = d3.scaleTime()
      .domain([
        d3.min(tasks, d => new Date(d.start_date)),
        d3.max(tasks, d => new Date(d.due_date))
      ])
      .range([0, width]);

    // Escala vertical para tareas
    const taskScale = d3.scaleBand()
      .domain(tasks.map(d => d.title))
      .range([0, height])
      .padding(0.1);

    // Ejes
    const xAxis = d3.axisBottom(timeScale);
    const yAxis = d3.axisLeft(taskScale);

    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis);

    svg.append("g")
      .call(yAxis);

    // Barras de tareas
    svg.selectAll("rect")
      .data(tasks)
      .enter()
      .append("rect")
      .attr("y", d => taskScale(d.title))
      .attr("x", d => timeScale(new Date(d.start_date)))
      .attr("width", d => {
        const start = timeScale(new Date(d.start_date));
        const end = timeScale(new Date(d.due_date));
        return end - start;
      })
      .attr("height", taskScale.bandwidth())
      .attr("fill", d => {
        switch(d.status) {
          case 'completed': return '#10B981';
          case 'in-progress': return '#3B82F6';
          default: return '#F59E0B';
        }
      })
      .attr("rx", 6)
      .attr("ry", 6);

    // Hitos
    if (milestones && milestones.length > 0) {
      svg.selectAll(".milestone")
        .data(milestones)
        .enter()
        .append("path")
        .attr("class", "milestone")
        .attr("d", d3.symbol().type(d3.symbolDiamond).size(100))
        .attr("transform", d => `translate(${timeScale(new Date(d.due_date))},${height + 10})`)
        .attr("fill", d => d.status === 'completed' ? '#10B981' : '#F59E0B');
    }
  }, [tasks, milestones]);

  return (
    <div className="overflow-x-auto">
      <svg ref={svgRef}></svg>
    </div>
  );
}

export default GanttChart;
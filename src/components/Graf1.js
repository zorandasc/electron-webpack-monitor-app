import React, { useRef, useEffect } from "react";
import { SmoothieChart } from "../tools/smoothie";

const Graf1 = ({ series1, series2 }) => {
  // Create the chart
  const myCanvas = useRef(null);

  useEffect(() => {
    var chart = new SmoothieChart({
      labels: { fontSize: 15 },
      tooltip: true,
      minValue: 0,
      timestampFormatter: SmoothieChart.timeFormatter,
      maxValueScale: 1.2,
    });
    chart.addTimeSeries(series1, {
      lineWidth: 3,
      strokeStyle: "#00ff00",
      fillStyle: "rgba(0, 255, 0, 0.4)",
    });
    chart.addTimeSeries(series2, {
      lineWidth: 3,
      strokeStyle: "rgb(250,38,0)",
      fillStyle: "rgba(250,38,0, 0.3)",
    });
    chart.streamTo(myCanvas.current, 500);
  }, [series1, series2]);

  return (
    <canvas id="mycanvas" ref={myCanvas} width="600" height="150"></canvas>
  );
};

export default Graf1;

import React, { useRef, useEffect } from "react";
import { SmoothieChart, TimeSeries } from "../tools/smoothie";

const Graf1 = ({ resultDown, resultUp }) => {
  // Create the chart
  const myCanvas = useRef(null);
  // Create a time series
  var series1 = useRef(new TimeSeries());
  var series2 = useRef(new TimeSeries());

  useEffect(() => {
    var chart = new SmoothieChart({
      labels: { fontSize: 15 },
      tooltip: true,
      minValue: 0,
      timestampFormatter: SmoothieChart.timeFormatter,
      maxValueScale: 1.2,
    });
    chart.addTimeSeries(series1.current, {
      lineWidth: 3,
      strokeStyle: "#00ff00",
      fillStyle: "rgba(0, 255, 0, 0.4)",
    });
    chart.addTimeSeries(series2.current, {
      lineWidth: 3,
      strokeStyle: "rgb(250,38,0)",
      fillStyle: "rgba(250,38,0, 0.3)",
    });
    chart.streamTo(myCanvas.current, 500);
    return () => {};
  }, []);

  useEffect(() => {
    series1.current.append(Date.now(), resultDown);
    series2.current.append(Date.now(), resultUp);
  }, [resultDown, resultUp]);

  return (
    <canvas id="mycanvas" ref={myCanvas}  width="600" height="250"></canvas>
  );
};

export default Graf1;

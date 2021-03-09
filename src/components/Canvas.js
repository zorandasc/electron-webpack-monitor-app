import React, {useRef, useEffect} from 'react';
import {TimeSeries, SmoothieChart} from "../tools/smoothie"

const Canvas = ({resultDown, resultUp}) => {
    const myCanvas=useRef(null)
    console.log("inside canvas resultDown, resultUp", resultDown, resultUp)
   
    
   

    useEffect(()=>{
         // Create a time series
        var series1 = new TimeSeries();
        var series2 = new TimeSeries();

        // Create the chart
        var chart = new SmoothieChart({ 
            labels: { fontSize: 15 },
            tooltip: true, 
            minValue: 0, 
            timestampFormatter: SmoothieChart.timeFormatter,
            maxValueScale: 1.2 
        });

        chart.addTimeSeries(series1, { 
            lineWidth: 3, 
            strokeStyle: '#00ff00', 
            fillStyle: 'rgba(0, 255, 0, 0.4)' 
        });
        chart.addTimeSeries(series2, { 
            lineWidth: 3, 
            strokeStyle: 'rgb(255, 0, 255)', 
            fillStyle: 'rgba(255, 0, 255, 0.3)' 
        });
    
        chart.streamTo(myCanvas.current, 500);
   
    
        series1.append(Date.now(), resultDown);
        series2.append(Date.now(), resultUp);
        console.log("update")
    },[resultDown, resultUp])
    
    console.log(myCanvas)

    return (
        <canvas ref={myCanvas} id="mycanvas"  width="600" height="250"></canvas>   
    );
};

export default Canvas;
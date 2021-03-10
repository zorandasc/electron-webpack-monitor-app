import React, { useEffect } from "react";
import SmoothieComponent, { TimeSeries } from "react-smoothie";

const Graf = ({ resultDown, resultUp }) => {
  const ts1 = new TimeSeries({});
  const ts2 = new TimeSeries({});

 
  setInterval(() => {
    var time = new Date().getTime();
    ts1.append(time, Math.random());
    ts2.append(time, Math.random());
  }, 500);

  const toolTiponja = (props) => {
    if (!props.display) return <div />;

    return (
      <div
      className="smoothie-chart-tooltip"
      >
        <strong>{new Date(props.time).toLocaleTimeString('en-IT', { hour12: false }) }</strong>
        {props.data ? (
          <ul>
            {props.data.map((data, i) => (
              <li key={i} 
                style={{ color: data.series.options.strokeStyle }}>
                {data.value.toFixed(2)}
              </li>
            ))}
          </ul>
        ) : (
          <div />
        )}
      </div>
    );
  };

  return (
    <SmoothieComponent
      labels={{fontSize:15}}
      minValue={0} 
      maxValueScale= {1.2}
      timestampFormatter={(time)=>time.toLocaleTimeString('en-IT', { hour12: false })}
    
      height={250}
      width={600}
      nonRealtimeData={false}
      tooltip={toolTiponja}
      series={[
        {
          data: ts1,
          strokeStyle: { g: 255 },
          fillStyle: { r:144, g:238, b:144, a:0.4 },
          lineWidth: 2,
        },
        {
          data: ts2,
          strokeStyle: { r: 255 },
          fillStyle: { r:250, g:38, b:0,a:0.4  },
          lineWidth: 2,
        },
      ]}
    />
  );
};

export default Graf;

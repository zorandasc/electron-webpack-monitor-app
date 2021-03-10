import React, { useEffect, useRef } from "react";
import SmoothieComponent, { TimeSeries } from "react-smoothie";

const Graf = ({ resultDown, resultUp }) => {
  //pretvorio sam ih u refove jer omogucuhju
  //da se ts1 i ts2 ne resetuju na nulu nakon
  //svakog rerenderovanja, sto bi bilo
  //da nema ref, vec da zadrze prethodnu 
  //iu samo apewndujes novu
  let ts1 =useRef(new TimeSeries({}));
  let ts2=useRef(new TimeSeries({})) 
 
  var time = new Date().getTime();
  ts1.current.append(time, resultDown);
  ts2.current.append(time, resultUp);
 

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
      interpolation="bezier"
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
          data: ts1.current,
          strokeStyle: { g: 255 },
          fillStyle: { r:144, g:238, b:144, a:0.4 },
          lineWidth: 2,
        },
        {
          data: ts2.current,
          strokeStyle: { r: 255 },
          fillStyle: { r:250, g:38, b:0,a:0.4  },
          lineWidth: 2,
        },
      ]}
    />
  );
};

export default Graf;

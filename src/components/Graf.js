import React from "react";
import SmoothieComponent, { TimeSeries } from "react-smoothie";

const Graf = ({ resultDown, resultUp }) => {
  const ts1 = new TimeSeries({});
  const ts2 = new TimeSeries({});

  setInterval(() => {
    var time = new Date().getTime();
    let mts1 = Math.random();
    let mts2 = Math.random();
    ts1.append(time, mts1);
    ts2.append(time, mts2);
  }, 500);

  const toolTiponja = (props) => {
    if (!props.display) return <div />;

    return (
      <div
        style={{
          userSelect: "none",
          background: "rgba(0,0,0,0.5)",
          padding: "1em",
          marginLeft: "20px",
          fontFamily: "consolas",
          color: "white",
          fontSize: "10px",
          pointerEvents: "none",
        }}
      >
        <strong>{props.time}</strong>
        {props.data ? (
          <ul>
            {props.data.map((data, i) => (
              <li key={i} style={{ color: data.series.options.strokeStyle }}>
                {data.value}
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
      style={{ display: "none" }}
      height={250}
      width={600}
      nonRealtimeData={false}
      tooltip={toolTiponja}
      series={[
        {
          data: ts1,
          strokeStyle: { g: 255 },
          fillStyle: { g: 255 },
          lineWidth: 4,
        },
        {
          data: ts2,
          strokeStyle: { r: 255 },
          fillStyle: { r: 255 },
          lineWidth: 4,
        },
      ]}
    />
  );
};

export default Graf;

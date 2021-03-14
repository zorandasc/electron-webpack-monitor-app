import React from "react";

const Ssid = ({ ssid }) => {
  const style = ssid ? "translateY(4px)" : "translateY(-50px)";
  return (
    <div id="ssid" style={{ transform: `${style}` }}>
      SSID: {ssid}
    </div>
  );
};

export default Ssid;

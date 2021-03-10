import React, { useState } from "react";
import { ipcRenderer, remote } from "electron";
const { dialog } = remote;

const customTitlebar = require("custom-electron-titlebar");

import "../static/css/photon.min.css";
import "./index.css";

import imgWifi from "../assets/wifi.png";
import imgEther from "../assets/ether.png";

import ConBtn from "../components/ConBtn";
import TextArea from "../components/TextArea";
import Interfaces from "../components/Interfaces";
import Graf from "../components/Graf";
import Graf1 from "../components/Graf1";
import Legend from "../components/Legend";
import Krugovi from "../components/Krugovi";
import Dialog from "../components/Dialog";
import Ssid from "../components/Ssid";
import Recorder from "../components/Recorder";

var titleBar = new customTitlebar.Titlebar({
  backgroundColor: customTitlebar.Color.fromHex("#e46425"),
  overflow: "hidden",
});

const portovi = [
  { id: 5, label: "Wifi", img: imgWifi },
  { id: 1, label: "Ethernet 1", img: imgEther },
  { id: 2, label: "Ethernet 2", img: imgEther },
  { id: 3, label: "Ethernet 3", img: imgEther },
  { id: 4, label: "Ethernet 4", img: imgEther },
];

const App = () => {
  //for selected port
  const [selected, setSelected] = useState(5);

  //enable disable down/up
  const [down, setDown] = useState(true);
  const [up, setUp] = useState(true);

  //is conection started
  const [connOpen, setConnOpen] = useState(false);

  //textarea
  const [textarea, setTextarea] = useState({ msg: "", color: "lightblue" });

  //is graf started
  const [grafStarted, setGrafStarted] = useState(false);

  //text for Mydialog
  const [showDialog, setShowDialog] = useState("");

  //for setting wifi ssid
  const [ssid, setSsid] = useState("");

  const [resultDown, setResultDown] = useState(0);
  const [resultUp, setResultUp] = useState(0);

  const connect = () => {
    ipcRenderer.invoke("connect");
  };

  const disConnect = () => {
    setConnOpen(false);
    stopGraf();
    ipcRenderer.invoke("disconnect");
  };

  const setDownUp = (direction) => {
    //CHECK IF GRAF STARTED
    if (!grafStarted) {
      direction === "down" ? setDown(!down) : setUp(!up);
    }
  };

  const startGraf = () => {
    if (connOpen) {
      //SETUJ GRAF STARTED
      setGrafStarted(true);
      //POSALJI MAINU SELECTED PORT, DOWN, UP
      ipcRenderer.invoke("startGraf", selected, down, up);

      //SHOW DIALOG STARTED
      setShowDialog("Graf Started.");
    } else {
      //elese pokazi dijalog
      setShowDialog("Sorry. Connection is closed.");
    }
  };

  const stopGraf = () => {
    if (grafStarted) {
      //OBRISI SSID
      setSsid("");

      //ZAUSTAVI GRAF
      setGrafStarted(false);

      ipcRenderer.invoke("stopGraf");

      setShowDialog("Graf Stoped.");
    }
  };

  //status dobijen od mejna tokom i konektovanja
  ipcRenderer.on("connect-result", function (event, arg) {
    let message = arg.toString();
    let colorMsg = "whitesmoke";
    switch (message) {
      case "Connection open.":
        setConnOpen(true);
        colorMsg = "lightgreen";
        break;
      case "Connection closed." || "Conecting....":
        colorMsg = "lightblue";
        break;
      default:
        setConnOpen(false);
        colorMsg = "rgb(245, 87, 111)";
    }
    setTextarea({ msg: message, color: colorMsg });
  });

  //rezultati dobijeni od maina unutar koje imaintervalna petlja
  ipcRenderer.on("resultValDown", function (event, arg) {
    setResultDown(Number(arg));
    //console.log("resuldown",resultDown)
    //series1.append(Date.now(), resultDown);
  });

  //rezultati dobijeni od maina unutar koje imaintervalna petlja
  ipcRenderer.on("resultValUp", function (event, arg) {
    setResultUp(Number(arg));
    //console.log("resultup",resultUp)
    //series2.append(Date.now(), resultUp);
  });

  //za dobijanje ssid name ali samo jednom tokomp prvog
  ipcRenderer.on("ssid", function (event, arg) {
    //console.log(arg)
    setSsid(arg.toString());
  });

  return (
    <div className="window">
      <header className="toolbar toolbar-header">
        <div className="toolbar-actions">
          <ConBtn connect={connect} disConnect={disConnect}></ConBtn>
          <TextArea value={textarea}></TextArea>
        </div>
        <a href="/?route=settings" style={{ color: "wheat" }}>
          KURCINA PALCIAN
        </a>
      </header>
      <Interfaces
        data={portovi}
        selected={selected}
        //if grafstrted you canot change
        setPort={(arg) => !grafStarted && setSelected(arg)}
      ></Interfaces>
      <Dialog show={showDialog} onClose={() => setShowDialog("")}></Dialog>
      <div className="window-content">
        <Ssid ssid={ssid}></Ssid>
        <Legend
          //if grafstrted you canot change
          setDirection={(arg) => !grafStarted && setDownUp(arg)}
          down={down}
          up={up}
        ></Legend>
        <Graf1 resultDown={resultDown} resultUp={resultUp}></Graf1>
        <Krugovi resultDown={resultDown} resultUp={resultUp}></Krugovi>
      </div>

      <div className="tab-group control">
        <div
          className={grafStarted ? "tab-item" : "tab-item active"}
          id="stop"
          onClick={stopGraf}
          data-tooltip="STOP GRAF"
        >
          <span className="icon icon-stop"></span>
        </div>
        <div
          className={grafStarted ? "tab-item active" : "tab-item"}
          id="start"
          onClick={startGraf}
          data-tooltip="START GRAF"
        >
          <span className="icon icon-play"></span>
        </div>
        <Recorder></Recorder>
      </div>
    </div>
  );
};

export default App;

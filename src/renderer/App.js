import React, { useState, useRef, useEffect } from "react";
import { ipcRenderer, remote } from "electron";
const { Menu, MenuItem } = remote;
import { SmoothieChart, TimeSeries } from "./tools/smoothie.js";

const customTitlebar = require("custom-electron-titlebar");

import "./css/photon.min.css";
import "./index.css";

import imgWifi from "./assets/wifiWhite.png";
import imgEther from "./assets/etherWhite.png";

import ConBtn from "./components/ConBtn.js";
import TextArea from "./components/TextArea.js";
import Interfaces from "./components/Interfaces.js";

import Legend from "./components/Legend.js";
//import Krugovi from "./components/Krugovi";
import Dialog from "./components/Dialog.js";
import Ssid from "./components/Ssid.js";
import Recorder from "./components/Recorder.js";
import Settings from "./components/SettingsWin.js";

var titleBar = new customTitlebar.Titlebar({
  backgroundColor: customTitlebar.Color.fromHex("#e46425"),
  overflow: "hidden",
});

const menu = new Menu();
//OVDIJE JE JAKO VAZNO DA KAD SE MIJENJA
//TITTLE OF WINDOW DA SE MIJENJA I ZA RECORDER
const title = "Huawei ONT Bandwidth Utilization Monitor";

menu.append(
  new MenuItem({
    label: " ",
    //accelerator: process.platform == "darwin" ? "Command+I" : "Ctrl+I",
    //click: (item, focusedWindow) => {
    //  focusedWindow.toggleDevTools();
    //},
  })
);

titleBar.updateMenu(menu);

titleBar.updateTitle(title);

const portovi = [
  { id: 5, label: "Wifi", img: imgWifi },
  { id: 1, label: "Ethernet 1", img: imgEther },
  { id: 2, label: "Ethernet 2", img: imgEther },
  { id: 3, label: "Ethernet 3", img: imgEther },
  { id: 4, label: "Ethernet 4", img: imgEther },
];

const App = () => {
  //console.log("apprerender")
  //THIS REF IS FOR CATHINH UNDERLAINH HTML CANVAS ELEMENT
  const myCanvas = useRef(null);

  //THIS REFS AR FOR MUTABLE VALUES, WHIC DOESNOT RE-RENDER
  var series1 = useRef(new TimeSeries());
  var series2 = useRef(new TimeSeries());

  //const [resDown, setResDown] = useState(0);
  //const [resUp, setResUp] = useState(0);

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

  //for displaying setting window
  const [setti, setSetti] = useState(false);

  //INICIALIZING SMOOTHIE CHAR, BUT OOLY ONCE
  useEffect(() => {
    var chart = new SmoothieChart({
      labels: { fontSize: 15 },
      interpolation: "bezier",
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
  }, []);

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
      //SETUJ GRAF STARTED if not started
      if(!grafStarted){
        setGrafStarted(true);
        
        //POSALJI MAINU SELECTED PORT, DOWN, UP
        ipcRenderer.invoke("startGraf", selected, down, up);

        //SHOW DIALOG STARTED
        setShowDialog("Graf Started.");
      }
      
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

  const showSettings = () => {
    //ako je konekcija open true
    //diseejbluj
    if (!connOpen) {
      setSetti(true);
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
    series1.current.append(new Date().getTime(), Number(arg));
    //setResDown(Number(arg));
  });

  //rezultati dobijeni od maina unutar koje imaintervalna petlja
  ipcRenderer.on("resultValUp", function (event, arg) {
    series2.current.append(new Date().getTime(), Number(arg));
    //setResUp(Number(arg));
  });

  //za dobijanje ssid name ali samo jednom tokomp prvog
  ipcRenderer.on("ssid", function (event, arg) {
    setSsid(arg.toString());
  });

  return (
    <div className="window">
      {setti && <Settings onClick={() => setSetti(false)}></Settings>}
      <header className="toolbar toolbar-header">
        <div className="toolbar-actions">
          <ConBtn connect={connect} disConnect={disConnect}></ConBtn>
          <TextArea value={textarea}></TextArea>
          <a
            onClick={showSettings}
            className="btn btn-default"
            data-title="SETTINGS"
          >
            <span
              className="icon icon-cog"
              style={connOpen ? { color: "gray" } : null}
            ></span>
          </a>
        </div>
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
        <canvas ref={myCanvas} id="mycanvas" width="650" height="250"></canvas>

        <p className="mjerna">[Mbit/s]</p>
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
        <Recorder title={title}></Recorder>
      </div>
    </div>
  );
};

export default App;

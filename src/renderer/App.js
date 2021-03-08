import React, {useRef, useState} from 'react';
import { ipcRenderer, remote } from 'electron'
const { dialog } = remote;


import '../static/css/photon.min.css'
import './index.css'

import imgWifi from '../assets/wifi.png'
import imgEther from '../assets/ether.png'
import ConBtn from "../components/ConBtn"
import Interfaces from "../components/Interfaces"
import Legend from "../components/Legend"
import Krugovi from "../components/Krugovi"
import Recorder from "../components/Recorder"
import Dialog from "../components/Dialog"
import Ssid from "../components/Ssid"

const portovi=[
    {id:1,label:'Wifi',img:imgWifi },
    {id:2, label:'Ethernet 2', img:imgEther},
    {id:3, label:'Ethernet 3', img:imgEther},
    {id:4, label:'Ethernet 4', img:imgEther},
    {id:5, label:'Ethernet 1', img:imgEther},

]

const App = () => {
    
    //for selected port
    const [selected, setSelected]=useState(1)

    //enable disable down/up
    const [down, setDown]=useState(true)
    const [up, setUp]=useState(true)
    
    //is conection started
    const [connectionOpen, setConnectionOpen]=useState(false)

    //is graf started
    const [grafStarted, setGrafStarted]=useState(false)
    
    //text for Mydialog
    const [showDialog, setShowDialog]=useState("")

    //for setting wifi ssid
    const [ssid, setSsid]=useState("")

    //var canvas = document.getElementById("mycanvas");
    const canvas=useRef(null)
   
    //var textarea= document.getElementById("ta")
    const textarea=useRef(null)   

    const connect=()=>{
        ipcRenderer.invoke('connect')  
    }

    const disConnect=()=>{
        setConnectionOpen(false)
        stopGraf()
        ipcRenderer.invoke('disconnect') 
    }

    const setDownUp=(direction)=>{
        //console.log(direction)
        if(!grafStarted){
            direction==="down"?setDown(!down):setUp(!up)
        }
    }

    const startGraf=()=>{
        if(connectionOpen){
            start.current.classList.add("active") 
            stop.current.classList.remove("active") 

            //SETUJ GRAF STARTED
            setGrafStarted(true)

            //POSALJI MAINU PORT, DOWN, UP
            ipcRenderer.invoke('startGraf', selected, down,up) 
            
            //SHOW DIALOG STARTED
            setShowDialog("Graf Started.")
           
        } else {
            //elese pokazi dijalog
            setShowDialog("Sorry. Connection is closed.")
        }
    }

    const stopGraf=()=>{
        if(grafStarted){
            stop.current.classList.add("active")
            start.current.classList.remove("active")

            //OBRISI SSID
            setSsid("")

            //ZAUSTAVI GRAF
            setGrafStarted(false)

            ipcRenderer.invoke('stopGraf') 

            setShowDialog("Graf Stoped.")
        }
    }

    //status dobijen od mejna tokom i konektovanja
    ipcRenderer.on('connect-result', function (event, arg) {

        if (arg.toString() == "Connection open.") {
            setConnectionOpen(true)
            textarea.style.color = "lightgreen"

        } else if (arg.toString() == "Connection closed." || arg.toString() == "Conecting....") {
            setConnectionOpen(false)
            textarea.style.color = "lightblue"
        } else {
            //ENYTHING ELSE including ERROR OCURED
            setConnectionOpen(false)
            textarea.style.color = "rgb(245, 87, 111)"
        }

        textarea.innerHTML = arg;

    })

    //rezultati dobijeni od maina unutar koje imaintervalna petlja
    ipcRenderer.on('resultValDown', function (event, arg) {              
        var resultDown = Number(arg);
        series1.append(Date.now(), resultDown);
    })

    //rezultati dobijeni od maina unutar koje imaintervalna petlja
    ipcRenderer.on('resultValUp', function (event, arg) {
        var resultUp = Number(arg);
        series2.append(Date.now(), resultUp);
    })

    //za dobijanje ssid name ali samo jednom tokomp prvog
    ipcRenderer.on('ssid', function (event, arg) {
        //console.log(arg)
        setSsid(arg.toString())
    })

    
   


    return (
        <div className="window">
            <header className="toolbar toolbar-header">  
                <div className="toolbar-actions">
                    <ConBtn 
                        connectionOpen={connectionOpen} 
                        connect={connect} 
                        disConnect={disConnect}>
                    </ConBtn>
                    <textarea 
                        className="form-control" 
                        ref={textarea}
                        id="ta" name="ta" rows="3" cols="10"
                        placeholder={process.env.ELECTRON_WEBPACK_APP_KUREC}
                        readOnly>
                    </textarea>
                </div>
            </header>
            <Interfaces 
                data={portovi} 
                selected={selected} 
                setPort={(arg)=>setSelected(arg)}>
            </Interfaces>
            <Dialog 
                show={showDialog} 
                onClose={()=>setShowDialog("")}>
            </Dialog>
            <div className="window-content"> 
                <Ssid ssid={ssid}></Ssid>
                <Legend 
                    setDirection={(arg)=>setDownUp(arg)} 
                    down={down} 
                    up={up}>
                </Legend>
                
                <canvas ref={canvas} id="mycanvas"  width="600" height="250"></canvas>   
                <Krugovi resultDown resultUp></Krugovi>
            </div>
            
            <div className="tab-group control">           
                <div 
                    className={grafStarted?"tab-item active":"tab-item"} 
                    id="stop" 
                    onClick={stopGraf} 
                    data-tooltip="STOP GRAF">
                    <span className="icon icon-stop"></span>
                </div>
                <div 
                    className={grafStarted?"tab-item":"tab-item active"}
                    id="start" 
                    onClick={startGraf} 
                    data-tooltip="START GRAF">
                    <span className="icon icon-play"></span>
                </div>
               <Recorder></Recorder>
            </div>
        </div>
    );
};

export default App;
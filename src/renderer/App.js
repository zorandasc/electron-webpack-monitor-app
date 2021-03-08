import React, {useRef, useState} from 'react';
import { ipcRenderer, desktopCapturer, remote } from 'electron'
const { dialog } = remote;
import { writeFile } from 'fs'

import '../static/css/photon.min.css'
import './index.css'

import imgWifi from '../assets/wifi.png'
import imgEther from '../assets/ether.png'
import ConBtn from "../components/ConBtn"
import Interfaces from "../components/Interfaces"
import Legend from "../components/Legend"



const portovi=[
    {id:1,label:'Wifi',img:imgWifi },
    {id:2, label:'Ethernet 2', img:imgEther},
    {id:3, label:'Ethernet 3', img:imgEther},
    {id:4, label:'Ethernet 4', img:imgEther},
    {id:5, label:'Ethernet 1', img:imgEther},

]

const App = () => {
    //browser build in mediarecorder, to record 
    // MediaRecorder instance to capture footage
    let mediaRecorder; 
    let recordedChunks=[];
    let stream;
    let inputSources=[]
    let buffer=[]

    //for selected port
    const [selected, setSelected]=useState(1)
    const [down, setDown]=useState(true)
    const [up, setUp]=useState(true)
    
    const [grafStarted, setGrafStarted]=useState(false)
    const [connectionOpen, setConnectionOpen]=useState(false)
   
    
    var maxDown=0;
    var maxUp=0;

    // Find the element
    //var canvas = document.getElementById("mycanvas");
    const canvas=useRef(null)
   
    //var textarea= document.getElementById("ta")
    const textarea=useRef(null)
    //var start = document.getElementById("start")
    const start=useRef(null)
    //var stop = document.getElementById("stop")
    const stop=useRef(null)
    //var startRec = document.getElementById("startRec")
    const startRec=useRef(null)
    //var stopRec = document.getElementById("stopRec")
    const stopRec=useRef(null)
    
    
    //var myDialog = document.getElementById("dialog")
    const myDialog=useRef(null)
    //var ssid = document.getElementById("ssid")
    const ssid=useRef(null)
    //clear max values
    //var downMax=document.getElementById("downMax")
    const downMax=useRef(null)
    //var upMax = document.getElementById("upMax")
    const upMax=useRef(null)
    


    const connect=()=>{
        ipcRenderer.invoke('connect')  
    }

    const disConnect=()=>{
        setConnectionOpen(false)
        stopGraf()
        ipcRenderer.invoke('disconnect') 
    }


    const clearMax=(direction)=>{
        console.log(direction)
         if(direction === "down"){
            maxDown=0
            downMax.current.innerHTML = maxDown.toFixed(2)
        }else{
            maxUp=0
            upMax.current.innerHTML = maxUp.toFixed(2)
        }
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
            grafStarted=true
            ipcRenderer.invoke('startGraf', choosenPort, down,up) 
            showDialog("Graf Started.")
        } else {
            //elese pokazi dijalog
            showDialog("Sorry. Connection is closed.")
            
        }
    }

    const stopGraf=()=>{
        if(grafStarted){
            stop.current.classList.add("active")
            start.current.classList.remove("active")
            maxDown = 0;
            maxUp = 0

            ssid.current.style.transform = "translateY(-50px)"

            grafStarted = false

            ipcRenderer.invoke('stopGraf') 
            showDialog("Graf Stoped.")
        }
    }

    const showDialog=(text)=>{
        myDialog.current.firstElementChild.innerHTML=text
        myDialog.current.style.transform = "translateX(1rem)"
        setTimeout(()=>{
            myDialog.current.style.transform= "translateX(-12rem)"
        }, 3000)
    }
    
    const startReco=()=>{
        mediaRecorder.start();
        startRec.current.style.display='none'
        stopRec.current.style.display='flex'
    }

    const stopReco=()=>{
         mediaRecorder.stop();

        inputSources = []
        recordedChunks=[]
        buffer=[]

        startRec.current.style.display = 'flex'
        stopRec.current.style.display = 'none'    
    }

    async function getVideoSource(){
        inputSources = await desktopCapturer.getSources({
            types: ['window', 'screen']
        });
        //capture only this window
        inputSources.map(source => {
            if(source.name ==="RGW Traffic Monitoring"){
                selectSource(source)
            }
        })
    
    }
    
// Change the videoSource window to record
    async function selectSource(source){
        const constraints = {
            audio: false,
            video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: source.id
                }
            }
        };
        // Create a Stream
        stream = await navigator.mediaDevices
            .getUserMedia(constraints);

            // Create the Media Recorder
        const options = { mimeType: 'video/webm; codecs=vp9' };
        mediaRecorder = new MediaRecorder(stream, options);

        // Register Event Handlers
        mediaRecorder.ondataavailable = handleDataAvailable;
        mediaRecorder.onstop = handleStop;
    }
    
    function handleDataAvailable(e){
        console.log('video data available');
        recordedChunks.push(e.data);      
    }

    async function handleStop(){
        const blob = new Blob(recordedChunks, {
            type: 'video/webm; codecs=vp9'
        });

        buffer = Buffer.from(await blob.arrayBuffer());
        
        const { filePath } = await dialog.showSaveDialog({
            buttonLabel: 'Save video',
            defaultPath: `vid-${Date.now()}.webm`
        });

        if (filePath) {
            writeFile(filePath, buffer, () => console.log('video saved successfully!'));
        }
    }

    
    //PRIPREMI SVE U STARTU, capture descop stream, 
    //create media recorder, creatae hendlers
    getVideoSource()


   
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
            <div className="dialog" ref={myDialog} id="dialog">
                <p></p>
            </div>
            <div className="window-content"> 
                <div ref={ssid} id="ssid">
                </div>
                <Legend 
                    setDirection={(arg)=>setDownUp(arg)} 
                    down={down} 
                    up={up}>
                </Legend>
                
                <canvas ref={canvas} id="mycanvas"  width="600" height="250"></canvas>   
                <div className="krugovi">
                    <p className="mjerna">[Mbit/s]</p>
                    <p className="max">Max Values.</p>
                    <div className="svg-wrapper"  onClick={()=>clearMax('down')} data-tooltip="CLEAR">
                        <svg height="80" width="80" stroke="lightgreen" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="38" cy="38" r="25" className="shape"  height="166" width="166"></circle>
                            <div className="textCircleDown" ref={downMax} id="downMax">Down</div>
                        </svg>
                    </div>
                    
                    <div className="svg-wrapper"  onClick={()=>clearMax('up')}  data-tooltip="CLEAR">
                        <svg height="80" width="80" stroke="rgb(255, 0, 255)" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="38" cy="38" r="25" className="shape" height="166" width="166"></circle>
                            <div className="textCircleUp" ref={upMax} id="upMax">Up</div>
                        </svg>
                    </div>
                
                </div>
            </div>
            <div className="tab-group control">           
                <div className="tab-item active" ref={stop} id="stop" onClick={stopGraf} data-tooltip="STOP GRAF">
                    <span className="icon icon-stop"></span>
                
                </div>
                <div className="tab-item" ref={start} id="start" onClick={startGraf} data-tooltip="START GRAF">
                    <span className="icon icon-play"></span>
                </div>
                <div className="tab-item" ref={startRec} id="startRec" onClick={startReco} data-tooltip="START RECORDING">   
                    <span className="icon icon-record"></span>
                </div>
                <div className="tab-item active2" ref={stopRec} id="stopRec" onClick={stopReco} data-tooltip="RECORDING">
                    <span className="icon icon-record"></span>
                </div>
            </div>
        </div>
    );
};

export default App;
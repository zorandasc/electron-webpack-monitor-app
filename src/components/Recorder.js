import React, {useState, useEffect} from 'react';
import { desktopCapturer } from 'electron'
import { writeFile } from 'fs'

const Recorder = () => {
    const [recording, setRecording]=useState(false)

    //browser build in mediarecorder, to record 
// MediaRecorder instance to capture footage
    let mediaRecorder; 
    let recordedChunks=[];
    let stream;
    let inputSources=[]
    let buffer=[]

    useEffect(()=>{
        //PRIPREMI SVE U STARTU, capture descop stream, 
        //create media recorder, creatae hendlers
        getVideoSource()
    },[])

    function startReco(){
        mediaRecorder.start();
        setRecording(true)
    }

    function stopReco() {
        mediaRecorder.stop();
        inputSources = []
        recordedChunks=[]
        buffer=[]
        setRecording(false)             
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

   
    return (
        <>
        {recording ?
            <div 
                className="tab-item active2" 
                id="stopRec" 
                onClick={stopReco} 
                data-tooltip="RECORDING">
                <span className="icon icon-record"></span>
            </div>:
             <div 
                className="tab-item" 
                id="startRec" 
                onClick={startReco} 
                data-tooltip="START RECORDING">   
                <span className="icon icon-record"></span>
            </div>    
            }
        </>
    );
};

export default Recorder;
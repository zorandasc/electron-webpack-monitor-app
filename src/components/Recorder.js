import React, { useState, useEffect, useRef } from "react";
import { desktopCapturer, remote } from "electron";
import { writeFile } from "fs";

const { dialog } = remote;

const Recorder = ({ title }) => {
  const [recording, setRecording] = useState(false);

  //koristiom ref da bi sacuvakli mediaoRecorder
  //during lifecicle of revorder componente
  //npr. during rerender when changing buttons
  let mediaRecorder = useRef(null);
  let recordedChunks = [];
  let stream;
  let inputSources = [];
  let buffer = [];

  //PRIPREMI SVE U STARTU, capture descop stream,
  //create media recorder, creatae hendlers
  useEffect(async () => {
    console.log("STRAT USEEFEVT");
    inputSources = await desktopCapturer.getSources({
      types: ["window", "screen"],
    });
    //capture only this window
    inputSources.map((source) => {
      if (source.name === title) {
        selectSource(source);
      }
    });
  }, []);

  // Change the videoSource window to record
  async function selectSource(source) {
    const constraints = {
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: "desktop",
          chromeMediaSourceId: source.id,
        },
      },
    };
    // Create a Stream
    stream = await navigator.mediaDevices.getUserMedia(constraints);

    // Create the Media Recorder
    //browser build in mediarecorder, to record
    // MediaRecorder instance to capture footage
    const options = { mimeType: "video/webm; codecs=vp9" };

    mediaRecorder.current = new MediaRecorder(stream, options);

    // Register Event Handlers
    mediaRecorder.current.ondataavailable = handleDataAvailable;
    mediaRecorder.current.onstop = handleStop;
  }

  function handleDataAvailable(e) {
    //console.log("video data available");
    recordedChunks.push(e.data);
  }

  async function handleStop() {
    const blob = new Blob(recordedChunks, {
      type: "video/webm; codecs=vp9",
    });

    buffer = Buffer.from(await blob.arrayBuffer());

    const { filePath } = await dialog.showSaveDialog({
      buttonLabel: "Save video",
      defaultPath: `vid-${Date.now()}.webm`,
    });

    if (filePath) {
      writeFile(filePath, buffer, () =>
        console.log("video saved successfully!")
      );
    }
    //clear everything
    inputSources = [];
    recordedChunks = [];
    buffer = [];
  }

  function startReco() {
    mediaRecorder.current.start();
    setRecording(true);
  }

  function stopReco() {
    mediaRecorder.current.stop();
    setRecording(false);
  }

  return (
    <>
      {recording ? (
        <div
          className="tab-item active2"
          id="stopRec"
          onClick={stopReco}
          data-tooltip="CAPTURING"
        >
          <span className="icon icon-record"></span>
        </div>
      ) : (
        <div
          className="tab-item"
          id="startRec"
          onClick={startReco}
          data-tooltip="SCREEN CAPTURE"
        >
          <span className="icon icon-record"></span>
        </div>
      )}
    </>
  );
};

export default Recorder;

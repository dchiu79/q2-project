import React, { useEffect, useRef, useState } from 'react';
import MultiRangeSlider from "multi-range-slider-react";
import ReactPlayer from 'react-player';



function App() {

  const [videoDuration, setVideoDuration] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [videoSrc, setVideoSrc] = useState('');
  const [videoFileValue, setVideoFileValue] = useState('');
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [videoTrimmedUrl, setVideoTrimmedUrl] = useState('');
  const videoRef = useRef();
  let initialSliderValue = 0;

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const blobURL = URL.createObjectURL(file);
    setVideoFileValue(file);
    setVideoSrc(blobURL);
  };
  const convertToHHMMSS = (val) => {
    const secNum = parseInt(val, 10);
    let hours = Math.floor(secNum / 3600);
    let minutes = Math.floor((secNum - hours * 3600) / 60);
    let seconds = secNum - hours * 3600 - minutes * 60;

    if (hours < 10) {
      hours = '0' + hours;
    }
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    if (seconds < 10) {
      seconds = '0' + seconds;
    }
    let time;
    // only mm:ss
    if (hours === '00') {
      time = minutes + ':' + seconds;
    } else {
      time = hours + ':' + minutes + ':' + seconds;
    }
    return time;
  };

  useEffect(() => {
    if (videoRef && videoRef.current) {
      const currentVideo = videoRef.current;
      currentVideo.onloadedmetadata = () => {
        setVideoDuration(currentVideo.duration);
        setEndTime(currentVideo.duration);
      };
    }
  }, [videoSrc]);
  const updateOnSliderChange = (values, handle) => {

    let readValue;
    // if (handle) {
    //   readValue = values[handle] | 0;
    //   if (endTime !== readValue) {
    //     setEndTime(readValue);
    //   }
    // } else {
    //   readValue = values[handle] | 0;
    //   if (initialSliderValue !== readValue) {
    //     initialSliderValue = readValue;
    //     if (videoRef && videoRef.current) {
    //       videoRef.current.currentTime = readValue;
    //       setStartTime(readValue);
    //     }
    //   }
    // }
    if (initialSliderValue !== readValue) {
      initialSliderValue = readValue;
      if (videoRef && videoRef.current) {
        videoRef.current.currentTime = readValue;
        setStartTime(readValue);
      }
    }
  };
  const handlePlay = () => {
    if (videoRef && videoRef.current) {
      videoRef.current.play();
    }
  };

  //Pause the video when then the endTime matches the currentTime of the playing video
  const handlePauseVideo = (e) => {
    const currentTime = Math.floor(e.currentTarget.currentTime);

    if (currentTime === endTime) {
      e.currentTarget.pause();
    }
  };

  const [minValue, set_minValue] = useState(25);
  const [maxValue, set_maxValue] = useState(75);
  const handleInput = (e) => {
    set_minValue(e.startTime);
    set_maxValue(e.endTime);
  };


  return (
    <div className="App">
      <input type="file" onChange={handleFileUpload} />
      <br />
      <video src={videoSrc} ref={videoRef} >
        <source src={videoSrc} type={videoFileValue.type} />
      </video>
      <MultiRangeSlider
        min={0}
        max={videoDuration}
        step={1}
        minValue={startTime}
        maxValue={videoDuration}
        onInput={handleInput}
      />
      <br />
      Start point: {convertToHHMMSS(startTime)} &nbsp; End duration:{' '}
      {convertToHHMMSS(endTime)}
      <br />
      <button onClick={handlePlay}>Play</button> &nbsp;
      <ReactPlayer>
      
      
    {/* <input type="file" onChange={handleFileUpload} />
    <ReactPlayer url={videoFilePath} width="100%" height="100%" controls={true} /> */}

      <br />
      </ReactPlayer>
      
    </div>
  );
}

export default App;

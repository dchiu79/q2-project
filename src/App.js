import React, { useEffect, useRef, useState } from 'react';

import MultiRangeSlider from "multi-range-slider-react";
import AWS from 'aws-sdk'
import './App.css';
window.Buffer = window.Buffer || require("buffer").Buffer;


function App() {
  const [videoDuration, setVideoDuration] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [videoSrc, setVideoSrc] = useState('');
  const [videoFileValue, setVideoFileValue] = useState('');
  const videoRef = useRef();
  let initialSliderValue = 0;



  const [minValue, set_minValue] = useState(25);
const [maxValue, set_maxValue] = useState(75);
const handleInput = (e) => {
  
	set_minValue(e.minValue);
	set_maxValue(e.maxValue);
};


  //Created to load script by passing the required script and append in head tag
  const loadScript = (src) => {
    return new Promise((onFulfilled, _) => {
      const script = document.createElement('script');
      let loaded;
      script.async = 'async';
      script.defer = 'defer';
      script.setAttribute('src', src);
      script.onreadystatechange = script.onload = () => {
        if (!loaded) {
          onFulfilled(script);
        }
        loaded = true;
      };
      script.onerror = function () {
        console.log('Script failed to load');
      };
      document.getElementsByTagName('head')[0].appendChild(script);
    });
  };

  //Handle Upload of the video
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const blobURL = URL.createObjectURL(file);
    setVideoFileValue(file);
    setVideoSrc(blobURL);
  };


  //Convert the time obtained from the video to HH:MM:SS format
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
    // if (hours === '00') {
    //   time = minutes + ':' + seconds;
    // } else {
    //   time = hours + ':' + minutes + ':' + seconds;
    // }
    time = hours + '-' + minutes + '-' + seconds;
    return time;
  };

  

  //Get the duration of the video using videoRef
  useEffect(() => {
    if (videoRef && videoRef.current) {
      const currentVideo = videoRef.current;
      currentVideo.onloadedmetadata = () => {
        setVideoDuration(currentVideo.duration);
        setEndTime(currentVideo.duration);
      };
    }
  }, [videoSrc]);

  //Called when handle of the nouislider is being dragged
  // const updateOnSliderChange = (values, handle) => {
  //   setVideoTrimmedUrl('');
  //   let readValue;
  //   if (handle) {
  //     readValue = values[handle] | 0;
  //     if (endTime !== readValue) {
  //       setEndTime(readValue);
  //     }
  //   } else {
  //     readValue = values[handle] | 0;
  //     if (initialSliderValue !== readValue) {
  //       initialSliderValue = readValue;
  //       if (videoRef && videoRef.current) {
  //         videoRef.current.currentTime = readValue;
  //         setStartTime(readValue);
  //       }
  //     }
  //   }
  // };

  //Play the video when the button is clicked
  const handlePlay = () => {
    if (videoRef && videoRef.current) {
      videoRef.current.play();
    }
  };
  const S3_BUCKET ='test-bucketvid';
  const REGION ='us-east-1';
  
  AWS.config.update({
    accessKeyId: '',
    secretAccessKey: ''
})

const myBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET},
    region: REGION,
})
const [progress , setProgress] = useState(0);
// const [selectedFile, setSelectedFile] = useState(null);
const uploadFile = (file, textone, texttwo) => {

  const params = {
      ACL: 'public-read',
      Body: file,
      Bucket: S3_BUCKET,
      Key: textone + " " + texttwo + " " + file.name
  };

  myBucket.putObject(params)
      .on('httpUploadProgress', (evt) => {
          setProgress(Math.round((evt.loaded / evt.total) * 100))
      })
      .send((err) => {
          if (err) console.log(err)
      })
}

  
  return (
    <div className="App">
      <input type="file" onChange={handleFileUpload} />
      <br />
      {videoSrc.length ? (
        <React.Fragment>
          <video src={videoSrc} ref={videoRef}  controls={true}>
            <source src={videoSrc} type={videoFileValue.type} />
          </video>
          <br />
          <MultiRangeSlider
          
        min={0}
        max={Math.floor(videoDuration)}
        step={1}
        minValue={startTime}
        maxValue={videoDuration}
        onInput={handleInput}
      />
          <br />
          <div>Start Point:{convertToHHMMSS(minValue)}&nbsp; End Point:{convertToHHMMSS(maxValue)} </div>
          Start duration: {convertToHHMMSS(startTime)} &nbsp; Video duration:{' '}
          {convertToHHMMSS(endTime)}
          <br />
          <button onClick={handlePlay}>Play</button> &nbsp;
          
          <div>File Upload Progress is {progress}%</div>
        
        <button onClick={() => uploadFile(videoFileValue, convertToHHMMSS(minValue), convertToHHMMSS(maxValue))}> Upload to S3</button>
        
        </React.Fragment>
      ) : (
        ''
      )}
    </div>
  );
}

export default App;

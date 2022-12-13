import React, { useEffect, useRef, useState } from 'react';
import MultiRangeSlider from "multi-range-slider-react";
import AWS from 'aws-sdk'
import 'bootstrap/dist/css/bootstrap.css';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import '../App.css';
import { NavbarComp } from './NavbarComp'
import { useNavigate, useHistory } from 'react-router-dom';
window.Buffer = window.Buffer || require("buffer").Buffer;


export function Home() {

  const [videoDuration, setVideoDuration] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [videoSrc, setVideoSrc] = useState('');
  const [videoFileValue, setVideoFileValue] = useState('');
  const [imgSrc, setImgSrc] = useState('');
  const [imgFileValue, setImgFileValue] = useState('');
  const [imgSrcTwo, setImgSrcTwo] = useState('');
  const [imgFileValueTwo, setImgFileValueTwo] = useState('');
  const videoRef = useRef();
  const vid = document.getElementById("myvid");
  let initialSliderValue = 0;
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageTwo, setSelectedImageTwo] = useState(null);
  const [startTimeValue, setStartTimeValue] = useState(0);
  const [endTimeValue, setEndTimeValue] = useState(0);
  const navigate = useNavigate();
  const [nameFile, setNameFile] = useState('');
  const [imgFile, setImgFile] = useState('');
  const [imgFileTwo, setImgFileTwo] = useState('');



  // const [minValue, set_minValue] = useState(25);
  // const [maxValue, set_maxValue] = useState(75);
  // const handleInput = (e) => {

  //   set_minValue(e.minValue);
  //   set_maxValue(e.maxValue);
  // };


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
    setNameFile(file.name);
    setVideoSrc(blobURL);
  };

  const handleImgUpload = (event) => {
    const img = event.target.files[0];
    const blobURL = URL.createObjectURL(img);
    setImgFileValue(img);
    setImgFile(img.name);
    setImgSrc(blobURL);
  };
  const handleImgUploadTwo = (event) => {
    const img = event.target.files[0];
    const blobURL = URL.createObjectURL(img);
    setImgFileValueTwo(img);
    setImgFileTwo(img.name);
    setImgSrcTwo(blobURL);
  };


  //Convert the time obtained from the video to HH:MM:SS format
  const convertToHMS = (val) => {
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
    time = hours + ':' + minutes + ':' + seconds;
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

  const S3_BUCKET = 'test-bucketvid';
  const REGION = 'us-east-1';

  AWS.config.update({
    accessKeyId: `${process.env.REACT_APP_API_KEY}`,
    secretAccessKey: `${process.env.REACT_APP_API_SECRET_KEY}`
  })

  const myBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET },
    region: REGION,
  })
  const [progress, setProgress] = useState(0);
  // const [selectedFile, setSelectedFile] = useState(null);
  const uploadFile = (file, start, end) => {

    const imgNameFile = imgFile.replaceAll("100", "").replaceAll("_", "");
    const imgNameFileTwo = imgFileTwo.replaceAll("100", "").replaceAll("_", "");

    const params = {
      ACL: 'public-read',
      Body: file,
      Bucket: S3_BUCKET,
      Key: "100" + imgNameFile + "100" + imgNameFileTwo + "_" + start + "_" + end + "_" + file.name
    };

    myBucket.putObject(params)
      .on('httpUploadProgress', (evt) => {
        setProgress(Math.round((evt.loaded / evt.total) * 100))
      })
      .send((err) => {
        if (err) console.log(err)
      })
  }


  const uploadFileImg = (imgOne) => {

    const imgnameFile = imgFile.replaceAll("100", "").replaceAll("_", "");
    const params = {
      ACL: 'public-read',
      Body: imgOne,
      Bucket: S3_BUCKET,
      Key: "100" + imgnameFile
    };

    myBucket.putObject(params)
      .on('httpUploadProgress', (evt) => {
        setProgress(Math.round((evt.loaded / evt.total) * 100))
      })
      .send((err) => {
        if (err) console.log(err)
      })


  }
  const uploadFileImgTwo = (imgTwo) => {
    const imgnameFile = imgFileTwo.replaceAll("100", "").replace("_", "");
    const params = {
      ACL: 'public-read',
      Body: imgTwo,
      Bucket: S3_BUCKET,
      Key: "100" + imgnameFile
    };

    myBucket.putObject(params)
      .on('httpUploadProgress', (evt) => {
        setProgress(Math.round((evt.loaded / evt.total) * 100))
      })
      .send((err) => {
        if (err) console.log(err)
      })
  }

  const handleStartChange = () => {
    setStartTimeValue(document.getElementById("sp").innerHTML = (convertToHMS(vid.currentTime)))
  }

  const handleEndChange = () => {
    setEndTimeValue(document.getElementById("ep").innerHTML = (convertToHMS(vid.currentTime)))

  }

  const navigateToVideo = (progress) => {

    navigate('/Video', { state: { id: nameFile, start: startTimeValue, end: endTimeValue } })

  };


  return (
    <div className="App">

      <NavbarComp />
      <Form.Group controlId="formFile" className='fileForm'>
        <Form.Control type="file" size='sm' onChange={handleFileUpload} />
      </Form.Group>
      {/* <input type="file" onChange={handleFileUpload} /> */}
      <br />
      {videoSrc.length ? (
        <React.Fragment>
          <video id="myvid" src={videoSrc} ref={videoRef} controls={true}>
            <source src={videoSrc} type={videoFileValue.type} />
          </video>
          <br />
          {/* <MultiRangeSlider
          
        min={0}
        max={Math.floor(videoDuration)}
        step={1}
        minValue={startTime}
        maxValue={videoDuration}
        onInput={handleInput}
        style={{barLeftColor:'purple'}}
      /> */}



          {/* <div>Start Point:{convertToHMS(minValue)}&nbsp; End Point:{convertToHMS(maxValue)} Video duration:{' '}
          {convertToHMS(endTime)} </div> */}
          <div>Start Point: <span id="sp"></span> End Point: <span id="ep"></span></div>
          {/* <Button id="spt" variant="outline-primary" onClick={()=>getStartTime()}>Get start time</Button>
          <Button id="ept" variant="outline-primary" onClick={()=>getEndTime()}>Get end time</Button> */}
          {/* <button onClick={handlePlay}>Play</button> &nbsp; */}

          {/* <div>File Upload Progress is {progress}%</div> */}
          <Button id="spt" variant="outline-primary" onClick={handleStartChange}>Get start time</Button>
          <Button id="ept" variant="outline-primary" onClick={handleEndChange}>Get end time</Button>



          <Form>
            <Row>
              <Col>
                <Form.Group controlId="formFile" className="mb-3">
                  <Form.Control type="file" size='sm' onChange={handleImgUpload} />
                  <Form.Text className="text-muted">
                    Upload First Image
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formFile" className="mb-3">
                  <Form.Control type="file" size='sm' onChange={handleImgUploadTwo} />
                  <Form.Text className="text-muted">
                    Upload second Image
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
          </Form>

          <div id='imgDiv'>
            <img src={imgSrc} type={imgFileValue.type} className="firstImg" >
            </img>
            <span> <img src={imgSrcTwo} type={imgFileValueTwo.type} className="secondImg">
            </img></span>
          </div>





          {/* {selectedImage && (
            <div>
              <img alt="not fount" width={"250px"} src={URL.createObjectURL(selectedImage)} />
              <br />
              <Button variant='outline-danger' onClick={() => setSelectedImage(null)}>Remove</Button>
            </div>
          )}
          <br />

          <br />
          <Button variant='dark'>
            <input
              type="file"
              name="myImage"
              onChange={(event) => {
                console.log(event.target.files[0]);
                setSelectedImage(event.target.files[0]);
              }}
            />
          </Button>


          {selectedImageTwo && (
            <div>
              <img alt="not found" width={"250px"} src={URL.createObjectURL(selectedImageTwo)} />
              <br />
              <Button variant='outline-danger' onClick={() => setSelectedImageTwo(null)}>Remove</Button>
            </div>
          )}
          <br />

          <br />
          <Button variant='dark'>
            <input
              type="file"
              name="myImage"
              onChange={(event) => {
                console.log(event.target.files[0])
                setSelectedImageTwo(event.target.files[0]);
              }}
            />

          </Button> */}

          <div>
            <ProgressBar variant='pb' now={progress} label={`File Upload Progress ${progress}%`}></ProgressBar>
          </div>


          {/* <button onClick={() => uploadFile(videoFileValue, convertToHMS(minValue), convertToHMS(maxValue))}> Upload to S3</button> */}
          {/* <Button id="bt" variant="outline-light" onClick={() => uploadFile(videoFileValue, convertToHMS(minValue), convertToHMS(maxValue))}>Upload</Button>{' '} */}
          <Button id="bt" variant="outline-light" onClick={() => { uploadFile(videoFileValue, startTimeValue, endTimeValue); uploadFileImg(imgFileValue); uploadFileImgTwo(imgFileValueTwo); }} onSubmit={() => navigateToVideo(progress)}>Trim</Button>{' '}


          <Button id="bt" variant="outline-light" onClick={() => navigateToVideo(progress)}>Get Trim Video</Button>

        </React.Fragment>
      ) : (
        ''
      )}

    </div>
  );
}
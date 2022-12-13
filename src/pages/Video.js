import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
// Helper function that creates an Amazon S3 service client module.
import React, { useState, useEffect } from "react"
import AWS from "aws-sdk"
import { useLocation } from 'react-router-dom';
import { NavbarComp } from './NavbarComp'
import './page.css'


export function Video() {

  const location = useLocation();



  // useEffect( () => {

  //         try {
  //             // Get the object} from the Amazon S3 bucket. It is returned as a ReadableStream.
  //             const data = s3Client.send(new GetObjectCommand(bucketParams));
  //             // Convert the ReadableStream to a string.
  //              setPosts(data.Body.transformToBuffer());
  //         } catch (err) {
  //             console.log("Error", err);
  //         }

  // }, []);

  // const [listFiles, setListFiles] = useState([]);

  // useEffect(() => {
  //   s3.listObjectsV2(params, (err, data) => {
  //     if (err) {
  //       console.log(err, err.stack);
  //     } else {
  //       setListFiles(data.Contents);
  //       console.log(data.Contents);
  //     }
  //   });
  // }, []);



  // const [message, setMessage] = useState("");

  // useEffect(() => {
  //   fetch("http://localhost:8000/message")
  //     .then((res) => res.json())
  //     .then((data) => setMessage(data.message));
  // }, []);

  const [vidUrl, setVidUrl] = useState(null);
  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`https://trimmed-video-tests3.s3.amazonaws.com/output_${location.state.start}_${location.state.end}_${location.state.id}`)
        .then(response => response.blob())
        .then(blob => {
          const vid = URL.createObjectURL(blob);
          setVidUrl(vid);
        });
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  return (

    <div >
      <NavbarComp></NavbarComp>
      <div className="tx">Please wait up to a minute for video to show up</div>
      {/* <div className='card-header'>Files from s3 bucket</div>
      <ul className='list-group'>
        {listFiles &&
          listFiles.map((name, index) => (
            <li className='list-group-item' key={index}>
              {name.Key}
            </li>
          ))}
      </ul> */}

      <video className="vidSize" src={vidUrl} controls={true}>
        <source src={vidUrl} />
      </video>
    </div>

  );
};

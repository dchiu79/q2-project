import React, { useState, useEffect } from "react"
import { useLocation } from 'react-router-dom';
import { NavbarComp } from './NavbarComp'
import './page.css'


export function Video() {

  const location = useLocation();



  const [vidUrl, setVidUrl] = useState(null);
  useEffect(() => {
    const interval = setInterval(() => {

      fetch(`https://trimmed-video-tests3.s3.amazonaws.com/output_${location.state.start.replaceAll(':','-')}_${location.state.end.replaceAll(':','-')}_${location.state.id}`)
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
      <video className="vidSize" src={vidUrl} controls={true}>
        <source src={vidUrl} />
      </video>
      <div style={{ textAlign: 'center'}}> File Name: {location.state.id} TimeStamp Trimmed: {location.state.start.replaceAll(':','-')} {location.state.end.replaceAll(':','-')}</div>
    </div>

  );
};

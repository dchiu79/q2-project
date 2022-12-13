import React, { useEffect, useRef, useState } from 'react';
import MultiRangeSlider from "multi-range-slider-react";
import AWS from 'aws-sdk'
import 'bootstrap/dist/css/bootstrap.css';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { Home } from "./pages/Home"
import { Video } from "./pages/Video"
import { Welcome } from "./pages/Welcome"

window.Buffer = window.Buffer || require("buffer").Buffer;

<link rel="stylesheet" href="/css/video-react.css" />

function App() {


  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/home" element={<Home />} />
      <Route path="/video" element={<Video />} />
    </Routes>
  );
}






export default App;

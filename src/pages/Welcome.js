import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import jotto from './jotto.jpg';
import { NavbarComp } from './NavbarComp'
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import './page.css'

export function Welcome() {

    const navigate = useNavigate();

    const navigateToHome = () => {

        navigate('/home')

    };

    return (
        <div>
            <NavbarComp />
            <div className='time'>
                <p> Welcome to Jotto Video Trimmer</p>
            </div>
            <div className='timeTwo'> <strong>Instructions on how to use Video Trimmer</strong> <br></br> Upload a video. Set two time stamps. Set two image as thumbnails.
                Upload the files and  Get trim video. <br></br>
                <Button className='bt' variant="dark" onClick={() => navigateToHome()}>Upload</Button>{' '}
            </div>
        </div>
    );

};
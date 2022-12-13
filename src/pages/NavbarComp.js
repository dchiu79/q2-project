import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import jotto from './jotto.jpg';
import './page.css'

export function NavbarComp() {

    return (
        <Navbar className='navb' collapseOnSelect expand="lg" variant="dark">
            <Container >
                <Navbar.Brand href="/">
                    <img src={jotto} width="50" height="50" className="d-inline-block align-top" alt='Jotto Logo'></img>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/">Welcome</Nav.Link>
                        <Nav.Link href="/home">Video</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );

};
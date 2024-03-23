

import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import {  Navbar,Container, Nav, Button,  Row, Col, Card, Pagination } from 'react-bootstrap';
import SignUpModal from './SignupForm';
import LoginModal from './LoginForm';
import { Link } from 'react-router-dom';
import logo from './logo_smarttutor.svg';
const LNavbar = () => {


  return (
  
    <div >
      {/* Navbar */}
      <Navbar  expand="lg" fixed="top"style={{backgroundColor:'#e1efff'}}>
        <Container>
          <Navbar.Brand href="#">
            <img
              src={logo}
              height="32"
              alt=""
              loading="lazy"
              style={{ marginTop: '-3px' }}
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarExample01" />
          <Navbar.Collapse id="navbarExample01">
            <Nav className="me-auto">
            <Link to="/landingpage" className="me-3" style={{textDecoration: 'none', color:'#1f5692',fontWeight:'bold',fontSize:'20px',fontFamily:'italic'}}>Home</Link>

<Link to="/quiz" className="me-3" style={{textDecoration: 'none', color:'#1f5692',fontWeight:'bold',fontSize:'20px',fontFamily:'italic'}}>
  About us
</Link>

<Link to="/summary" className="me-3" style={{textDecoration: 'none',color:'#1f5692',fontWeight:'bold',fontSize:'20px',fontFamily:'italic'}}>
  Contact us
</Link>
            </Nav>
            <Nav className="d-flex flex-row">
   
              <Nav.Link>
      <SignUpModal />
    </Nav.Link>
    <Nav.Link>
      <LoginModal />
    </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default LNavbar;
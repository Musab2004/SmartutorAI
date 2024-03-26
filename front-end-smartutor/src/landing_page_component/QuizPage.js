import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Navbar from "./Navbar";
const AboutUs = () => {
    return (
      <>
      <style>
      {`
    body {
      background-color: #e1efff; /* Set the background color to blue */
      margin: 0; /* Reset margin for the body */
      padding: 0; /* Reset padding for the body */
    }
  `}
    </style>
    <Navbar/>
        <Container style={{marginTop:'100px'}}>
            <Row className="my-5">
                <Col>
                    <h1>About Us</h1>
                    <p>
                        We are a dedicated team of developers passionate about creating 
                        engaging and effective learning experiences. Our mission is to 
                        make learning accessible and enjoyable for everyone.
                    </p>
                </Col>
            </Row>
            <Row>
                <Col md={6}>
                    <h2>Our Story</h2>
                    <p>
                        We started as a small team in 2020, and have since grown into a 
                        diverse group of developers and educators committed to transforming 
                        the way people learn.
                    </p>
                </Col>
                <Col md={6}>
                    <h2>Our Vision</h2>
                    <p>
                        Our vision is to empower individuals to reach their full potential 
                        through innovative and engaging learning experiences.
                    </p>
                </Col>
            </Row>
        </Container>
        </>
    );
};

export default AboutUs;
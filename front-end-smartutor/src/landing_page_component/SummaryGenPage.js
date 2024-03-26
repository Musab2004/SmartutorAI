import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import Navbar from "./Navbar";
const ContactUs = () => {
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
                    <h1>Contact Us</h1>
                    <p>
                        We'd love to hear from you! Please fill out the form below and 
                        we'll get back to you as soon as possible.
                    </p>
                </Col>
            </Row>
            <Row>
                <Col md={6}>
                    <Form>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" />
                        </Form.Group>

                        <Form.Group controlId="formBasicSubject">
                            <Form.Label>Subject</Form.Label>
                            <Form.Control type="text" placeholder="Subject" />
                        </Form.Group>

                        <Form.Group controlId="formBasicMessage">
                            <Form.Label>Message</Form.Label>
                            <Form.Control as="textarea" rows={3} />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
        </>
    );
};

export default ContactUs;
import React, { useState } from 'react';
import { Form, Button, Tab, Tabs, Col, Row, Container } from 'react-bootstrap';
import Navbar from "./Navbar";

function YourComponent() {
  const [documentFile, setDocumentFile] = useState(null);
  const [difficultyLevel, setDifficultyLevel] = useState('easy');
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);

  const handleFileChange = (e) => {
    // Handle file change here
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
  };


  return (
    <>
      <Navbar />
      <div style={{ marginTop: '80px' }}>
        <Container>
          <Row>
            <Col md={6}>
              <Tabs defaultActiveKey="upload" id="tabs">
                <Tab eventKey="upload" title="Upload Document">
                  <Form onSubmit={handleFormSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Choose PDF File</Form.Label>
                      <Form.Control type="file" id="documentFile" accept=".pdf" onChange={handleFileChange} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Type of Summary</Form.Label>
                      <Form.Control as="select">
                        <option value="Extractive">Extractive</option>
                        <option value="Abstractive">Abstractive</option>
                      </Form.Control>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                    Generate Summary
                    </Button>
                  </Form>
                </Tab>

                <Tab eventKey="other" title="Other Tab">
                  {/* Your content for the other tab goes here */}
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>Textarea</Form.Label>
                      <Form.Control as="textarea" placeholder="Enter text here" />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Type of Summary</Form.Label>
                      <Form.Control as="select">
                        <option value="Extractive">Extractive</option>
                        <option value="Abstractive">Abstractive</option>
                      </Form.Control>
                    </Form.Group>


                    <Button variant="primary" type="submit">
                      Generate Summary
                    </Button>
                  </Form>
                </Tab>
              </Tabs>
            </Col>
            <Col md={6} style={{ border: '1px solid #ccc',borderRadius:'2%', padding: '10px', maxHeight: '400px', overflowY: 'auto' }}>
              <b>Summary generated</b>
          <p>ksandjbsakjdbsahvahdvashdv</p>
            
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default YourComponent;

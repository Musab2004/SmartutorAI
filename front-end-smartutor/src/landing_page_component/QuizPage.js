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
  const quizzes = [
    {
      statement: "What is the capital of France?",
      options: ["London", "Berlin", "Madrid", "Paris"],
    },
    {
      statement: "Which planet is known as the Red Planet?",
      options: ["Earth", "Mars", "Venus", "Jupiter"],
    },
    {
        statement: "What is the capital of France?",
        options: ["London", "Berlin", "Madrid", "Paris"],
      },
      {
        statement: "Which planet is known as the Red Planet?",
        options: ["Earth", "Mars", "Venus", "Jupiter"],
      },
      {
        statement: "What is the capital of France?",
        options: ["London", "Berlin", "Madrid", "Paris"],
      },
      {
        statement: "Which planet is known as the Red Planet?",
        options: ["Earth", "Mars", "Venus", "Jupiter"],
      },
      {
        statement: "What is the capital of France?",
        options: ["London", "Berlin", "Madrid", "Paris"],
      },
      {
        statement: "Which planet is known as the Red Planet?",
        options: ["Earth", "Mars", "Venus", "Jupiter"],
      },
      {
        statement: "What is the capital of France?",
        options: ["London", "Berlin", "Madrid", "Paris"],
      },
      {
        statement: "Which planet is known as the Red Planet?",
        options: ["Earth", "Mars", "Venus", "Jupiter"],
      },
    // Add more quiz statements as needed
  ];

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
                      <Form.Label>Difficulty Level</Form.Label>
                      <Form.Control as="select" id="difficultyLevel" value={difficultyLevel} onChange={(e) => setDifficultyLevel(e.target.value)}>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </Form.Control>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Number of Questions</Form.Label>
                      <Form.Control as="select" id="numberOfQuestions" value={numberOfQuestions} onChange={(e) => setNumberOfQuestions(parseInt(e.target.value))}>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                        <option value={20}>20</option>
                      </Form.Control>
                    </Form.Group>

                    <Button variant="primary" type="submit">
                      Generate Quiz
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
                      <Form.Label>Difficulty Level</Form.Label>
                      <Form.Control as="select">
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </Form.Control>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Number of Questions</Form.Label>
                      <Form.Control as="select">
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                        <option value={20}>20</option>
                      </Form.Control>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                      Generate Quiz
                    </Button>
                  </Form>
                </Tab>
              </Tabs>
            </Col>
            <Col md={6} style={{ border: '1px solid #ccc',borderRadius:'2%', padding: '10px', maxHeight: '400px', overflowY: 'auto' }}>
              <b>Quiz generated</b>
              {quizzes.map((quiz, index) => (
                <div key={index}>
                  <p>{quiz.statement}</p>
                  <ul>
                    {quiz.options.map((option, optionIndex) => (
                      <li key={optionIndex}>{option}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default YourComponent;

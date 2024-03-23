// App.js
import React, { useState } from 'react';
import { Container, Button, Card, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const questions = [
  {
    id: 1,
    question: 'What is the capital of France?',
    options: ['Berlin', 'Madrid', 'Paris', 'Rome'],
    correctAnswer: 'Paris',
  },
  {
    id: 2,
    question: 'What is the capital of France?',
    options: ['Berlin', 'Madrid', 'Paris', 'Rome'],
    correctAnswer: 'Paris',
  },
  {
    id: 3,
    question: 'What is the capital of France?',
    options: ['Berlin', 'Madrid', 'Paris', 'Rome'],
    correctAnswer: 'Paris',
  },
  {
    id: 4,
    question: 'What is the capital of France?',
    options: ['Berlin', 'Madrid', 'Paris', 'Rome'],
    correctAnswer: 'Paris',
  },
  // Add more questions as needed
];

const App = () => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [timer, setTimer] = useState(60);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const handleOptionSelect = (questionId, option) => {
    if (!quizSubmitted) {
      setSelectedAnswers((prev) => ({ ...prev, [questionId]: option }));
    }
  };

  const handleFinishQuiz = () => {
    setQuizSubmitted(true);

    questions.forEach((question) => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        setCorrectAnswers((prev) => prev + 1);
      }
    });
  };

  const startTimer = () => {
    const interval = setInterval(() => {
      if (timer > 0 && !quizSubmitted) {
        setTimer((prev) => prev - 1);
      } else {
        clearInterval(interval);
        handleFinishQuiz();
      }
    }, 1000);
  };

  return (
    <Container>
      <Card>
        <Card.Body>
          <Card.Title>Multiple Choice Quiz</Card.Title>

          {questions.map((question) => (
            <div key={question.id}>
              <Card.Text>{question.question}</Card.Text>
              <div>
                <Form>
                  {question.options.map((option, index) => (
                    <div key={index}>
                      <Form.Check
                        type="radio"
                        id={`option-${index}`}
                        label={option}
                        name={`question-${question.id}`}
                        checked={selectedAnswers[question.id] === option}
                        onChange={() => handleOptionSelect(question.id, option)}
                        disabled={quizSubmitted}
                      />
                  
                    </div>
                  ))}
                </Form>
                {quizSubmitted && (
                        <p>
                          {selectedAnswers[question.id] === question.correctAnswer
                            ? 'Correct!'
                            : `Wrong! Correct Answer: ${question.correctAnswer}`}
                        </p>
                      )}
              </div>
            </div>
          ))}

          <p>Time remaining: {timer} seconds</p>

          <Button variant="primary" onClick={startTimer}>
            Start Timer
          </Button>

          <Button variant="success" onClick={handleFinishQuiz}>
            Finish Quiz
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default App;

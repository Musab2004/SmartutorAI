// App.js
import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Button, Card, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import userService from '../landing_page_component/UserSerive';
import { UserContext } from '../landing_page_component/UserContext';

const App = () => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [timer, setTimer] = useState(10);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState({});
  const [results, setResults] = useState({});
  const { userData } = useContext(UserContext);
  const location = useLocation();
  const [questions, setQuestions] = useState([]);
  const { quizes, numQuestions, quizType, is_mcq, studyPlan } = location.state;
  const navigate = useNavigate();
  function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  }

  const handleOptionSelect = (questionId, option) => {
    if (!quizSubmitted) {
      setSelectedAnswers((prev) => ({ ...prev, [questionId]: option }));
    }
  };

  const handleFinishQuiz = async () => {
    let correct = [];
    let wrong = [];
    setQuizSubmitted(true);
    setTimer(0);
    const resultTemp = {};

    for (let question of quizes) {
      const isCorrect = await checkAnswer(selectedAnswers[question.Id], question.correct_answer);
      resultTemp[question.Id] = isCorrect;
      if (isCorrect) {
        correct.push(question.Id);
        setCorrectAnswers((prev) => prev + 1);
      } else {
        wrong.push(question.Id);
      }
    }
    setResults(resultTemp);
    console.log("correct ones: ", correct);
    console.log("wrong ones: ", wrong);
  };

  const startTimer = () => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev > 0) {
          console.log('Timer:', prev - 1);
          return prev - 1;
        } else {
          console.log('Timer finished!');
          clearInterval(interval);
          handleFinishQuiz();
          return 0;
        }
      });
    }, 1000);
  };

  async function checkAnswer(correct_answer, selectedAnswer) {
    if (is_mcq) {
      return correct_answer === selectedAnswer;
    }
    try {
      const response = await userService.post('api/check-answer/', { correct_answer, selected_answer: selectedAnswer });
      console.log(response.data);
      if (response.data.similarity_score > 0.6) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  }

  return (
    <div>
      <style>
        {`
      body {
        background-color: #e1efff; /* Set the background color to blue */
        margin: 0; /* Reset margin for the body */
        padding: 0; /* Reset padding for the body */
      }
    `}
      </style>
      <div style={{ 
        position: 'fixed', 
        right: '50px', 
        top: '50px', 
        padding: '10px', 
        backgroundColor: '#f0f0f0', 
        borderRadius: '5px',
        fontSize: '20px' 
      }}>
        Time remaining: {formatTime(timer)}
      </div>
      <Container style={{ width: '50%', margin: 'auto' }}>
        <Card style={{ width: '100%', margin: 'auto' }}>
          <Card.Body>
            <Card.Title>Multiple Choice Quiz</Card.Title>

            {quizSubmitted && (
              <div style={{ marginLeft: '50%' }}>
                <p style={{ fontSize: '20px', color: 'orange', fontWeight: 'bold' }}>
                  You have <span style={{ color: correctAnswers > 0 ? 'green' : 'red' }}>{correctAnswers}</span> out of {quizes.length} MCQs correct!
                </p>
              </div>
            )}

            {quizes && quizes.map((question) => (
              <div key={question.Id}>
                <Card.Text>{question.question}</Card.Text>
                <div>
                  {is_mcq ? (
                    <Form>
                      {question.distractors.map((option, index) => (
                        <div key={index}>
                          <Form.Check
                            type="radio"
                            id={`option-${index}`}
                            label={option}
                            name={`question-${question.Id}`}
                            checked={selectedAnswers[question.Id] === option}
                            onChange={() => handleOptionSelect(question.Id, option)}
                            disabled={quizSubmitted}
                          />
                        </div>
                      ))}
                    </Form>
                  ) : (
                    <Form.Control
                      type="text"
                      value={selectedAnswers[question.Id] || ''}
                      onChange={(e) => handleOptionSelect(question.Id, e.target.value)}
                      disabled={quizSubmitted}
                    />
                  )}

                  {quizSubmitted && (
                    <div>
                      <p>
                        {results[question.Id] !== undefined ? (
                          results[question.Id] ? (
                            <span style={{ color: 'green' }}>Correct!</span>
                          ) : (
                            <span style={{ color: 'red' }}>Wrong! Correct Answer: {question.correct_answer}</span>
                          )
                        ) : null}
                      </p>
                      <p>
                        <Button onClick={() => setShowExplanation((prevState) => ({ ...prevState, [question.id]: !prevState[question.id] }))}>
                          See Explanation {showExplanation[question.id] ? '▲' : '▼'}
                        </Button>
                      </p>
                      {showExplanation[question.id] && (
                        <div style={{ borderRadius: '10px', backgroundColor: '#f0f0f0', padding: '10px', marginTop: '10px' }}>
                          <p><span role="img" aria-label="info">ℹ️</span> {question.feedback}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            <p>Time remaining: {timer} seconds</p>
            {!quizSubmitted && (
              <>
                <Button variant="primary" onClick={startTimer}>
                  Start Timer
                </Button>
                <Button variant="success" onClick={handleFinishQuiz}>
                  Finish Quiz
                </Button>
              </>
            )}
            {quizSubmitted && (
              <>
                <Button variant="primary" onClick={() => navigate('/dashboard', { state: { studyPlan } })}>
                  Go back to Dashboard
                </Button>
              </>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default App;

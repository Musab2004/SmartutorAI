import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Button, Card, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import userService from '../landing_page_component/UserSerive';
import { UserContext } from '../landing_page_component/UserContext';

const App = () => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [results, setResults] = useState({});
  const [timer, setTimer] = useState(15 * 60);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState({});
  const { userData } = useContext(UserContext);
  const location = useLocation();
  const [questions, setQuestions] = useState([]);

  const { quizId, quizes, numQuestions, quizType, weekid, studyPlan, is_mcq } = location.state;

  function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  }

  useEffect(() => {
    localStorage.setItem('timer', timer);
  }, [timer]);

  const handleOptionSelect = (questionId, option) => {
    if (!quizSubmitted) {
      setSelectedAnswers((prev) => ({ ...prev, [questionId]: option }));
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await userService.get(`api/quizzes/${quizId}/`);
      setQuestions(response.data.questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  useEffect(() => {
    fetchQuestions();
    startTimer();
  }, []);

  const handleFinishQuiz = async () => {
    setQuizSubmitted(true);
    let correct = [];
    let wrong = [];
    const resultTemp = {};

    const answerCheckPromises = quizes.map(async (question) => {
      const isCorrect = await checkAnswer(question.correct_answer, selectedAnswers[question.id]);
      resultTemp[question.id] = isCorrect;
      if (isCorrect) {
        correct.push(question.id);
      } else {
        wrong.push(question.id);
      }
    });

    await Promise.all(answerCheckPromises);

    setResults(resultTemp);
    setCorrectAnswers(correct.length);

    console.log("correct ones: ", correct);
    console.log("wrong ones: ", wrong);

    try {
      await userService.post('api/quiz-submission/', { correct, wrong, user_id: userData.id, weekly_goal_id: weekid, quiz_id: quizId });
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  async function checkAnswer(correct_answer, selectedAnswer) {
    if (is_mcq) {
      return correct_answer === selectedAnswer;
    }
    try {
      console.log(correct_answer,selectedAnswer)
      const response = await userService.post('api/check-answer/', { correct_answer, selected_answer: selectedAnswer });
      console.log(response.data);
      return response.data.similarity_score > 0.6;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  }

  const startTimer = () => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev > 0) {
          return prev - 1;
        } else {
          clearInterval(interval);
          handleFinishQuiz();
          return 0;
        }
      });
    }, 1000);
  };

  const navigate = useNavigate();

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
                  You have <span style={{ color: correctAnswers > 0 ? 'green' : 'red' }}>{correctAnswers}</span> out of {questions.length} MCQs correct!
                </p>
              </div>
            )}

            {questions.map((question) => (
              <div key={question.id}>
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
                            name={`question-${question.id}`}
                            checked={selectedAnswers[question.id] === option}
                            onChange={() => handleOptionSelect(question.id, option)}
                            disabled={quizSubmitted}
                          />
                        </div>
                      ))}
                    </Form>
                  ) : (
                    <Form.Control
                      type="text"
                      value={selectedAnswers[question.id] || ''}
                      onChange={(e) => handleOptionSelect(question.id, e.target.value)}
                      disabled={quizSubmitted}
                    />
                  )}

                  {quizSubmitted && (
                    <div>
                      <p>
                        {selectedAnswers[question.id] === question.answer ? (
                          <span style={{ color: 'green' }}>Correct!</span>
                        ) : (
                          <span style={{ color: 'red' }}>Wrong! Correct Answer: {question.answer}</span>
                        )}
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

            {!quizSubmitted && (
              <>
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

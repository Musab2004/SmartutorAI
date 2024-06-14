import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Button, Card, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import userService from '../landing_page_component/UserSerive';
import { UserContext } from '../landing_page_component/UserContext';
import LoaderScreen from '../HomePage/LoaderScreen';
import { FaArrowLeft } from 'react-icons/fa';
import moment from 'moment';

const App = () => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [timer, setTimer] = useState(10 * 60);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState({});
  const [results, setResults] = useState({});
  const [showtimer, setShowTimer] = useState(true);
  const [loading, setLoading] = useState(false);
  const { userData } = useContext(UserContext);
  const location = useLocation();
  const [questions, setQuestions] = useState([]);
  const { quizes, numQuestions, quizType, is_mcq, studyPlan } = location.state;

  console.log(results);
  const navigate = useNavigate();
  console.log(questions);
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
    setLoading(true);
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

    setLoading(false);
  };

  useEffect(() => {
    let interval;
    const startTimer = () => {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev > 0) {

            return prev - 1;
          } else {
            clearInterval(interval);
            return 0;
          }
        });
      }, 1000);
    };

    startTimer();

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  async function checkAnswer(correct_answer, selectedAnswer) {
    if (is_mcq) {
      return correct_answer === selectedAnswer;
    }
    try {
      console.log('not suppose to be here');
      const response = await userService.post('api/check-answer/', { correct_answer, selected_answer: selectedAnswer });
      console.log(response.data);
      return response.data.similarity_score > 0.9;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  }
  const blurStyle = loading ? { filter: 'blur(5px)', pointerEvents: 'none' } : {};
  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999
  };
  return (
    <div>
      <style>
       {`
      body {
        background-color: white; /* Set the background color to blue */
        margin: 0; /* Reset margin for the body */
        padding: 0; /* Reset padding for the body */
      }
    `}
      </style>
      {loading &&   <div style={overlayStyle}>
    <LoaderScreen mesg="It may take 1-2 min to evaluate quiz" />
  </div>}
      <div style={blurStyle}>
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
    
        <Card style={{ width: '100%' }}>
          <Card.Header className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center" style={{ color: 'blue', cursor: 'pointer' }}>
              <FaArrowLeft style={{ fontSize: '20px' }} onClick={() => navigate('/dashboard-quiz-generation', { state: { studyPlan } })} /> 
              <span className="ml-2" style={{marginLeft:'8px',fontSize: '20px'}}>Go Back</span>
              <div style={{marginLeft:'20px' ,color:'grey'}}>
                <Card.Title style={{color:'black'}}>Weekly Quiz</Card.Title>
                <div>Number of Questions: {numQuestions}</div>
              </div>
            </div>
            <div style={{marginRight:'20%'}}>
              {showtimer && (
                <div>
                  Time remaining: {formatTime(timer)}
                </div>
              )}
              <div>Date: {moment().format('MMMM Do, YYYY')}</div>
            </div>
          </Card.Header>
          <Card.Body style={{marginLeft:'20%'}}>
            <Card.Title>Multiple Choice Quiz</Card.Title>

            {quizSubmitted && (
              <div style={{ marginLeft: '50%' }}>
                <p style={{ fontSize: '20px', color: 'orange', fontWeight: 'bold' }}>
                  You have <span style={{ color: correctAnswers > 0 ? 'green' : 'red' }}>{correctAnswers}</span> out of {quizes.length} MCQs correct!
                </p>
              </div>
            )}

            {quizes && quizes.map((question) => (
              <div key={question.Id} style={{fontSize:'20px',marginBottom:'3%',marginTop:'3%'}}>
                <Card.Text>{question.question}</Card.Text>
                <div>
                  {is_mcq ? (
                    <Form>
                      {question.distractors.map((option, index) => (
                        <div key={index} >
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
                        <Button onClick={() => setShowExplanation((prevState) => ({ ...prevState, [question.Id]: !prevState[question.Id] }))}>
                          See Explanation {showExplanation[question.Id] ? '▲' : '▼'}
                        </Button>
                      </p>
                      {showExplanation[question.Id] && (
                        <div style={{ borderRadius: '10px', backgroundColor: '#f0f0f0', padding: '10px', marginTop: '10px' }}>
                          <p><span role="img" aria-label="info">ℹ️</span> {question.explanation}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {!quizSubmitted && (
              <>
                <Button variant="success" style={{marginBottom:'15%'}} onClick={handleFinishQuiz}>
                  Finish Quiz
                </Button>
              </>
            )}
            {quizSubmitted && (
              <>
                <Button variant="primary" style={{marginBottom:'15%'}}  onClick={() => navigate('/dashboard-quiz-generation', { state: { studyPlan } })}>
                  Go back to Dashboard
                </Button>
              </>
            )}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default App;

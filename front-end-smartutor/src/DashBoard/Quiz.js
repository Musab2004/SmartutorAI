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
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [showtimer, setShowTimer] = useState(true);
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
  fetchQuestions();
  useEffect(() => {
    fetchQuestions();
    startTimer();
  }, [questions]);

  const handleFinishQuiz = async () => {
    setQuizSubmitted(true);
    // setTimer(0);
    setShowTimer(false);
    let correct = [];
    let wrong = [];
    const resultTemp = {};

    const answerCheckPromises = questions.map(async (question) => {
      const isCorrect = await checkAnswer(question.answer, selectedAnswers[question.id]);
      resultTemp[question.id] = isCorrect;
      if (isCorrect) {
        correct.push(question.id);
      } else {
        wrong.push(question.id);
      }
    });
    if (!is_mcq){
      setLoading(true);
    }
    console.log("waiting for responses");
    await Promise.all(answerCheckPromises);
    console.log("got all the response ")
    setResults(resultTemp);
    setCorrectAnswers(correct.length);
    setLoading(false);
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
      
      const response = await userService.post('api/check-answer/', { correct_answer, selected_answer: selectedAnswer });
      console.log(response.data);
      return response.data.similarity_score > 0.9;
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
            background-color: grey; /* Set the background color to blue */
            margin: 0; /* Reset margin for the body */
            padding: 0; /* Reset padding for the body */
          }
        `}
      </style>
      {loading && (<LoaderScreen />)}
      {!questions && (<LoaderScreen />) }
      {!loading && questions && <div>
     
     
      <div style={{alignItems:'center'}}>
        <Card style={{ width: '100%' }}>
        <Card.Header className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center" style={{ color: 'blue', cursor: 'pointer' }}>
            <FaArrowLeft style={{ fontSize: '20px' }} /> 
            <span className="ml-2" style={{marginLeft:'8px',fontSize: '20px'}}>Go Back</span>
            <div style={{marginLeft:'20px' ,color:'grey'}}>
                <Card.Title style={{color:'black'}}>Weekly Quiz</Card.Title>
                <div>Number of Questions: 10</div>
                
            </div>
            </div>
            <div style={{marginRight:'20%'}}>
            {showtimer &&  <div>
        Time remaining: {formatTime(timer)}
      </div>}
      <div>Date: {moment().format('MMMM Do, YYYY')}</div>
               
          
            </div>
        </Card.Header>
          <Card.Body style={{marginLeft:'20%'}}>
            

            {quizSubmitted && (
              <div style={{ marginLeft: '50%' }}>
                <p style={{ fontSize: '20px', color: 'black', fontWeight: 'bold' }}>
                  You have <span style={{ color: correctAnswers > 0 ? 'green' : 'red' }}>{correctAnswers}</span> out of {questions.length} MCQs correct!
                </p>
              </div>
            )}
            <ol>
            {questions.map((question) => (
              <div key={question.id} style={{fontSize:'20px',marginBottom:'3%',marginTop:'3%'}}>
                <li>
                <Card.Text>{question.question}</Card.Text>
                </li>
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
                        {results[question.id] !== undefined ? (
                          results[question.id] ? (
                            <span style={{ color: 'green' }}>Correct!</span>
                          ) : (
                            <span style={{ color: 'red' }}>Wrong! Correct Answer: {question.answer}</span>
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
</ol>
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
      </div>
      </div>}
    </div>
    
  );
};

export default App;

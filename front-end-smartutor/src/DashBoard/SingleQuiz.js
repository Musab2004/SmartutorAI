// App.js
import React, { useEffect, useState,useContext } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import { Container, Button, Card, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import userService from '../landing_page_component/UserSerive';
import { UserContext } from '../landing_page_component/UserContext';
const App = () => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [timer, setTimer] = useState(60);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState({});
  const { userData } = useContext(UserContext);
  const location = useLocation();
  const [questions, setQuestions] = useState([]);
  var question1s=null;
  console.log(location.state)
  const { quizes, numQuestions, quizType,is_mcq ,studyPlan} = location.state;
//   console.log(quizes)
  const handleOptionSelect = (questionId, option) => {
    if (!quizSubmitted) {
      setSelectedAnswers((prev) => ({ ...prev, [questionId]: option }));
    }
  };


  const handleFinishQuiz = () => {
    let correct=[]
    let wrong=[]
    setQuizSubmitted(true);

    quizes.results.forEach((question) => {
      console.log(question,question.correct_answer)
      if (selectedAnswers[question.Id] === question.correct_answer) {
        correct.push(question['Id'])
        setCorrectAnswers((prev) => prev + 1);
      }
      else{
      wrong.push(question['Id'])

      }
    });
    console.log("correct ones : ",correct)
    console.log("wrong ones : ",wrong)  
  };

  const startTimer = () => {
    const interval = setInterval(() => {
      if (timer > 1) {

        setTimer((prev) => prev - 1);
      } else {
        clearInterval(interval);
        setTimer(0); // Ensure timer doesn't go below zero
        handleFinishQuiz();
      }
    }, 1000);
  };
  const navigate = useNavigate();



  async function checkAnswer(correct_answer, selectedAnswer) {
    if (is_mcq){
      if (correct_answer === selectedAnswer) {
      return true
      }
      else{
        return false
      }
    }
 try {
    const response = await userService.post('api/check-answer/', { correct_answer:correct_answer,selected_answer:selectedAnswer });
    console.log(response.data);
    console.log(response.data.similarity_score);
    
    if(response.data.similarity_score>0.6){
      console.log("true here")
      return true;
    }
    else{
      console.log("false an heer")
      return false
    }
  } catch (error) {
    console.error('Error:', error);
    return null
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
    <Container style={{ width: '50%', margin: 'auto' }}>
   
      <Card style={{ width: '100%', margin: 'auto' }}d>
        <Card.Body>
          <Card.Title>Multiple Choice Quiz</Card.Title>
{/* <p>{questions}</p> */}

{quizSubmitted && (<div style={{marginLeft:'50%'}}>
<p style={{ fontSize: '20px', color: 'orange', fontWeight: 'bold' }}>
  You have <span style={{ color: correctAnswers > 0 ? 'green' : 'red' }}>{correctAnswers}</span> out of {quizes.results.length} MCQs correct!
</p>
</div>)}

          {quizes.results && quizes.results.map((question) => (
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
          {checkAnswer(selectedAnswers[question.Id], question.correct_answer)
  ? <span style={{ color: 'green' }}>Correct!</span>
  : <span style={{ color: 'red' }}>Wrong! Correct Answer: {question.correct_answer}</span>}
          </p>
          <p>
            <Button onClick={() => setShowExplanation(prevState => ({ ...prevState, [question.Id]: !prevState[question.id] }))}>
              Click here {showExplanation[question.Id] ? '▲' : '▼'}
            </Button>
          </p>
          {showExplanation[question.Id] && (
            <div>
              {/* Replace this with the actual explanation */}
              <p>Explanation goes here : {question.context}</p>
            </div>
          )}
        </div>
      )}

              </div>
            </div>
          ))}

          <p>Time remaining: {timer} seconds</p>
{!quizSubmitted &&(<>
          <Button variant="primary" onClick={startTimer}>
            Start Timer
          </Button>

          <Button variant="success" onClick={handleFinishQuiz}>
            Finish Quiz
          </Button>
          </>)
}
{quizSubmitted &&(<>
          <Button variant="primary" onClick={() => navigate('/dashboard',{ state: { studyPlan:studyPlan } })}>
            Go back to Dashboard
          </Button>

        
          </>)
}
        </Card.Body>
      </Card>
    </Container>
  
    </div>
  );
};

export default App;

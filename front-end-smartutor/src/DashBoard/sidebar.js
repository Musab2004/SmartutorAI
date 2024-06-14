import React, { useState, useContext, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal,Button, Container, Collapse,Form } from 'react-bootstrap';
import userService from '../landing_page_component/UserSerive';
import { UserContext } from '../landing_page_component/UserContext';
import { useLocation,useNavigate } from 'react-router-dom';
import { colors } from '@material-ui/core';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
// import Loader
import { Weekend, ExpandMore } from '@mui/icons-material';

import LoaderScreen from '../HomePage/LoaderScreen';
import StudyPlans from '../HomePage/AllStudyPlans';

const fetchTopic = async (pk) => {
  try {
    const response = await userService.get(`api/topics/${pk}/`);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    return error;
  }
  };
  
  const QuizForm = ({ quiz, weeklyGoalId ,studyPlan}) => {
    const [all_topics, setAllTopics] = useState([]);
    const [quizType, setQuizType] = useState('MCQ');
    const numQuestions=10
    const [selectedOption, setSelectedOption] = useState([]);
    const [Quiz, setQuiz] = useState([]);
    const navigate = useNavigate();
    console.log("quiz is here : ",quiz);
    useEffect(() => {
      const fetchTopics = async () => {
        const topics = await Promise.all(
          quiz.topics.topics.map(option =>
            fetchTopic(option).then(response => ({
              title: response.title,
              id: response.id,
              content: response.content,  // replace 'summary' with the actual key in the response
            }))
          )
        );
        setAllTopics(topics);
      };
  
      fetchTopics();
    }, [quiz]);
    const fetchQuestions = async () => {  

      userService.get(`api/quizzes/${quiz.topics.id}/`).then((response) => { 
        setQuiz(response.data);
        return response.data.questions;
      })
  
    };
const [Questions, setQuestions] = useState([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
  fetchQuestions();
    }, [quiz]);
const startQuiz = async (topics) => {
  try {
    setLoading(true);

    const generatedQuestions = await createQuestions({ topics: topics });
    // It seems setLoading(true) is called twice without a setLoading(false). 
    // Assuming the second call should actually be setLoading(false) to indicate loading is complete.
    setLoading(false); 
    await userService.post('api/questions/', { 
      questions: generatedQuestions, 
      weekly_goal_id: weeklyGoalId,
      quiz_id: quiz.topics.id,
      is_mcq: quizType === "MCQ"
    });
    navigate("/quiz", {
      state: {
        quizId: quiz.topics.id,
        quizes: generatedQuestions,
        numQuestions,
        timer: 10,
        quizType,
        weekid: weeklyGoalId,
        studyPlan: studyPlan,
        is_mcq: quizType === "MCQ"
      }
    });
  } catch (error) {
    setLoading(false); // Ensure loading is set to false in case of an error
    alert(`An error occurred: ${error.message}`);
  }
}
function partition(id, title, text) {
  const words = text.split(' ');
  const totalWords = words.length;
  const partitions = [];
  const minWordsPerPartition = 50;
  const maxWordsPerPartition = 100;
  let currentStart = 0;

  while (currentStart < totalWords) {
    let endIndex = currentStart + maxWordsPerPartition;
    if (endIndex > totalWords) {
      endIndex = totalWords;
    }
    if (endIndex - currentStart < minWordsPerPartition) {
      endIndex = totalWords;
    }

    const partition = {
      id: id,
      title: title,
      content: words.slice(currentStart, endIndex).join(' ')
    };

    partitions.push(partition);
    currentStart = endIndex;
  }

  return partitions;
}

const alpaca_prompt = `Below is an instruction that describes a task, paired with an input that provides further context. Write a response that appropriately completes the request.

### Instruction:
{}

### Input:
{}

### Response:
{}`;

async function getExplanation(question, answer) {
  const apiKey = "sk-proj-H9604idDPtL8XzensAebT3BlbkFJkPTrLzW1LgpMkpPCqmLp";
  const endpoint = 'https://api.openai.com/v1/chat/completions';

  const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
  };

  const data = {
      model: 'gpt-3.5-turbo',
      messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: `Question: ${question}\nAnswer: ${answer}\nExplain this in simple and understandable terms.` }
      ],
      max_tokens: 150
  };

  try {
      const response = await axios.post(endpoint, data, { headers });
      const explanation = response.data.choices[0].message.content.trim();
      return explanation;
  } catch (error) {
      console.error('Error making API call:', error);
      throw error;
  }
}

async function generateShortQA(id, title, content, Id) {
  const mcqOutput = [];
  const outputText = await generateMCQsForPartition(content);
	if (quizType === 'ShortQA') {
		const pattern = /<question>(.*?)<\/question>.*?<answer>(.*?)<\/answer>/gs;
		const matches = [...outputText.matchAll(pattern)];
		for (const match of matches) {
			const question = match[1].trim();
			const correctAnswer = match[2].trim();  
      const explanation=await getExplanation(question,correctAnswer);
			mcqOutput.push({
				id: id,
				Id: Id,
				context: content,
				title: title,
				distractors: null,
				question: question,
				correct_answer: correctAnswer,
        explanation:explanation
			});
		}
	
		return mcqOutput;
	}
	else{

		const allQuestions = [];
		const mcqPattern = /<question>(.*?)<\/question>.*?<answer>(.*?)<\/answer>.*?<distractor>(.*?)<\/distractor>/gs;
		const matches = [...outputText.matchAll(mcqPattern)];
		
			for (const match of matches) {
				const [_, question, answer, distractors] = match;
        const distractors1=distractors.split("<d>").filter((d) => d.trim()).map((d) => d.replace("</d>", "").trim())
        const uniqueDistractors = [...new Set(distractors1)];
        const correctAnswer=answer.trim().replace(/^[a-zA-Z]\.\s*/, '');
        const explanation=await getExplanation(question,correctAnswer);
        if (uniqueDistractors.length > 1) {
				allQuestions.push({
					id: id,
					Id: Id,
					context: content,
					title: title,
					question: question.trim(),
					correct_answer: answer.trim().replace(/^[a-zA-Z]\.\s*/, ''),
					distractors: uniqueDistractors,
          explanation:explanation
				});
      }
			}
		
			return allQuestions;
		}
}

async function generateMCQsForPartition(partition, instruction = `Generate ${studyPlan.subject} based questions from it`) {
  
  const inputs = alpaca_prompt.replace('{}', instruction).replace('{}', partition).replace('{}', '')
	if (quizType === 'MCQ') {
    try {
      const response = await axios.post('https://6e66-34-87-159-172.ngrok-free.app/generate-questions/', {
        input_text: inputs
      });
      return response.data.results;
    } catch (error) {
      console.error('Error:', error);

    }
    }
    else{
      try {
        const response = await axios.post('https://4233-35-204-226-215.ngrok-free.app/generate-questions/', {
          input_text: inputs
        });
        return response.data.results;
      } catch (error) {
        console.error('Error:', error);
      }
    
    
    }
}


async function createQuestions(topics) {
  try {
    const results = [];
    const allPartitions = [];
    topics.topics.forEach(topic => {
      const parts = partition(topic.id, topic.title, topic.content);
      allPartitions.push(...parts);
    });
    

    const numSamples = Math.min(numQuestions, allPartitions.length);
    const selectedPartitions = allPartitions.sort(() => 0.5 - Math.random()).slice(0, numSamples);

    console.log("slected partitions : ",selectedPartitions);

    for (const topic of selectedPartitions) {
      const questions = await generateShortQA(topic.id, topic.title, topic.content, topic.id); // Await the API call
      results.push(...questions);
    }

    return results;
  } catch (e) {
    throw new Error(e.message);
  }
}


  

const GenerateQuiz = async () => {
  const summaries = await Promise.all(
    selectedOption.map(option =>
      fetchTopic(option.value).then(response => ({
      title: response.title,
      id: response.id,
      content: response.content,  // replace 'summary' with the actual key in the response
      }))
    )
    );

       startQuiz(summaries);
  

};
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
<>
{loading && (
  <div style={overlayStyle}>
    <LoaderScreen mesg="It may take 5-10 min to Generate Quiz" />
  </div>
)}

<div style={blurStyle}>
{!quiz.topics.topics_to_revisit && <>
  <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>
  <h2>You have a quiz on {quiz.topics.title}</h2>
  <p>Click on the start button when you are ready.</p>
  
  <hr />
  <h3 style={{ marginTop: '30px', marginBottom: '10px', color:'#1f5692' }}>Topics these are based on.</h3>
  <Form.Select style={{ marginBottom: '20px' }}>
    {all_topics.map((topic, index) => (
      <option key={index} value={topic.title}>
        {topic.title}
      </option>
    ))}
  </Form.Select>

  <h3 style={{ marginTop: '30px', marginBottom: '10px', color:'#1f5692' }}>Select MCQ type:</h3>
  <Form.Select value={quizType} onChange={(e) => setQuizType(e.target.value)} style={{ marginBottom: '20px' }}>
    <option value="ShortQA">ShortQA</option>
    <option value="MCQ">MCQ</option>
  </Form.Select>

  {!quiz.topics.followup_quiz && (
    <Button onClick={() => startQuiz(all_topics)} style={{ marginTop: '20px' }}>Start Quiz</Button>
  )}
</div>
</>}

  {quiz.topics.topics_to_revisit && <>

    {quiz.topics.topics_to_revisit.length > 0 &&  <>
     <div style={{textAlign:'center'}}>
    <h2>Follow up Quiz</h2>
    <p>Based on your weakness you can give follow up quiz for better prepration</p>
    <div >
    <br/>
    <h2>Quiz Result</h2>
<div style={{display:'flex'}}>
         <div className="p-3 mb-2 bg-success text-white rounded" sty>
             <FontAwesomeIcon icon={faCheckCircle} size="3x" />
                  <h4>Correct Questions</h4>
                      <p className="display-4">{quiz.topics.correct_questions.length}</p>
        </div>
        <div className="p-3 mb-2 bg-danger text-white rounded" style={{marginLeft:'10%'}}>
              <FontAwesomeIcon icon={faTimesCircle} size="3x" />
                                        <h4>Wrong Questions</h4>
                                        <p className="display-4">{quiz.topics.wrong_questions.length}</p>
       </div>
       </div>
    </div>
    <br/>
    <div style={{marginBottom:'20px'}}>
        <h3>Topics to revisit</h3>
        <Form.Select>
          {quiz.topics.topics_to_revisit.map((topic, index) => (
            <option key={index} value={topic.title}>
              {topic.title}
            </option>
          ))}
        </Form.Select>
        <Button style={{marginTop:'20px',marginBottom:'4%'}} onClick={() => startQuiz(quiz.topics.topics_to_revisit)}>Follow up Quiz</Button>
        </div>
        </div>
  
  
  </>}



  </>
  }

{quiz.topics.topics_to_revisit &&

<>
{ quiz.topics.topics_to_revisit.length <= 0 && 
  <>
  <div style={{textAlign:'center'}}>
  <h2>Weekly Quiz</h2>
  <p>Topics these are based on.</p>
  <hr/>

  <Form.Select>
    {all_topics.map((topic, index) => (
      <option key={index} value={topic.title}>
        {topic.title}
      </option>
    ))}
  </Form.Select>
  <div >
    <br/>
    <h2>Quiz Result</h2>
<div style={{display:'flex'}}>
         <div className="p-3 mb-2 bg-success text-white rounded" sty>
             <FontAwesomeIcon icon={faCheckCircle} size="3x" />
                  <h4>Correct Questions</h4>
                      <p className="display-4">{quiz.topics.correct_questions.length}</p>
        </div>
        <div className="p-3 mb-2 bg-danger text-white rounded" style={{marginLeft:'10%'}}>
              <FontAwesomeIcon icon={faTimesCircle} size="3x" />
                                        <h4>Wrong Questions</h4>
                                        <p className="display-4">{quiz.topics.wrong_questions.length}</p>
       </div>
       </div>
    </div>
    </div>
  </>
  }
</>
  
}
</div>
</>
);
}
const Sidebar = ({ studyPlan,data }) => {
  const navigate = useNavigate();
  var [data, setData] = useState(null);
  const { userData } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedWeeklyGoalId, setSelectedWeeklyGoalId] = useState(null);
  const [is_covered, setIs_covered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isCovered, setIsCovered] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState([]);
  const markAsCompleted = async (topic_id,weekly_goal_id) => {
  
    const response = await userService.get('api/weeklygoaltopiccovered/',{
      params: {
        weeklygoal_id: weekly_goal_id,
        topic_id: topic_id,
   
      }
    });
    setIsCovered(true);
    
    fetchWeeklyGoals();
    handleTopicClick(response.data,weekly_goal_id);
    }
  const fetchWeeklyGoals = async () => {
    try {
      const response = await userService.get('api/getweeklygoals/', {
        params: {
          studyplan_id: studyPlan.id,
          user_id: userData.id,
        },
      });

      setData(response.data.response);
      setIs_covered(response.data.all_complete);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  useEffect(() => {
    if (is_covered) {
      setShowModal(true);
    }
  }, [is_covered]);
  useEffect(() => {
    if (userData && studyPlan){
    fetchWeeklyGoals();
    }
  }, [studyPlan,userData]);
  
  const [content, setContent] = useState('');

  const handleTopicClick = (topic,weekly_goal_id) => {
    fetchTopic(topic.topics.id).then((response) => {
      setContent(response.content);
    });
    setSelectedTopic(topic);
    setSelectedWeeklyGoalId(weekly_goal_id);
    setShowQuizForm(false);
  };
  const [showQuizForm, setShowQuizForm] = useState(false);
  const handleQuizClick = (topic,weekly_goal_id) => {
    setSelectedTopic(null);
    setShowQuizForm(true);
    setSelectedWeeklyGoalId(weekly_goal_id);
    setSelectedQuiz(topic);
  };
  

  const handleDropdownToggle = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };
  const handleCloseCourse = () => {
    setShowModal(false);
    navigate('/my-courses')
};
const GenerateSummary = async () => {
    setLoading(true)

    
    const input = [
    {
      role: 'system',
      content: 'You are a helpful assistant.'
    },
    {
      role: 'user',
      content: `
      Please summarize the following content in simple words using heading and bullet points like explaining to a kid.Ypu can add content on your own to get full picture of topic. The response must be in HTML format with:
      - A main title in an <h3> tag.
      - Section titles in <h4> tags.
      - Each point in <li> tags within <ul> tags.
    
      Content: ${content}}
      `
    }
    ];
    
    const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-4-turbo',
      messages: input,
      temperature: 0.7,  // Optional: Adjust the temperature for more or less creative summaries
    },
    {
      headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer sk-proj-H9604idDPtL8XzensAebT3BlbkFJkPTrLzW1LgpMkpPCqmLp`,
      },
    }
    );
  let cleanedHtmlString = response.data.choices[0].message.content.replace(/```html\n/, '').replace(/```$/, '');
  setContent(cleanedHtmlString);
  setLoading(false)
  };

  return (
    <>
    <link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.17.0/font/bootstrap-icons.css"
  integrity="sha384-HZ4soYF2Z8ERi0Vr40S+LCTlkKf8Abf4MZPA+1SiGHkADho0W97lcvoKviyXlV1/W"
  crossorigin="anonymous"
/>
<Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Congratulations!</Modal.Title>
            </Modal.Header>
            <Modal.Body>You have completed your study plan!</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleCloseCourse}>
                    Close Course
                </Button>
            </Modal.Footer>
        </Modal>


        
        {data ? (<div className="container" style={{marginLeft:'20%',width:'70%',marginBottom:'20%',marginTop:'5%'}}>
      <div className="row no-gutters">
        <nav className="col-md-5 bg-light sidebar"  style={{width:'350px'}}>
          <div className="sidebar-sticky" >
            {data ? (
              data.map((week, index) => (
                <div key={week.id} className="nav-item">
                  <h6
                    className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted"
                    style={{ cursor: 'pointer' }}
                  >
              <span>
  <Weekend className="me-2" />
  Week {week.weekly_goals.order}
</span>

<span
  onClick={() => handleDropdownToggle(index)}
>
  <ExpandMore />
</span>
                 
                  </h6>

                  <Collapse in={openDropdown === index}>
                    <ul style={{maxHeight: '500px',backgroundColor:'white', overflowY: 'auto'}}>
                      {week.chapters.map((topic) => (
                   <>
       {topic.topics.is_quiz ? (
    <div
        className="nav-link"
        onClick={() => handleQuizClick(topic, week.weekly_goals.id)}
        style={{
            cursor: 'pointer',
            color: topic.is_covered ? 'blue' : 'red',
            backgroundColor: topic.is_covered ? '#e6f7ff' : '#ffebe6',
           
            borderColor: topic.is_covered ? '#91d5ff' : '#ff4d4f',
            padding: '10px',
            borderRadius: '5px',
            marginBottom: '10px'
        }}
    >
       <div style={{ display: 'flex', alignItems: 'center' }}>
        {topic.is_covered ? (
            <i className="fa fa-check" style={{ 
              color: 'white', 
              backgroundColor: 'green', 
              borderRadius: '50%', 
              padding: '5px', 
              fontSize: '15px' 
            }} aria-hidden="true"></i>
        ) : (
            <i className="fa fa-question-circle" style={{ color: 'red', marginRight: '8px', fontSize:'20px' }} aria-hidden="true"></i>
        )}
        <span>{topic.topics.title}</span>
        </div>
    </div>
) : (
    <div
        className="nav-link"
        onClick={() => handleTopicClick(topic, week.weekly_goals.id)}
        style={{
            cursor: 'pointer',
            padding: '10px',
            borderRadius: '5px',
            marginBottom: '10px'
        }}
    >
 <div style={{ display: 'flex', alignItems: 'center' }}>
    {topic.is_covered ? (
              <i className="fa fa-check" style={{ 
                color: 'white', 
                backgroundColor: 'green', 
                borderRadius: '50%', 
                padding: '5px', 
                fontSize: '15px' 
              }} aria-hidden="true"></i>
    ) : (
      <i className="fa fa-book" style={{ 
        color: 'black', 
        marginRight: '8px', 
        fontSize: '20px', 
        backgroundColor: 'white', 
        borderRadius: '50%', 
        padding: '10px',
        border: '2px solid black'
      }} aria-hidden="true"></i>

    )}
    <span style={{marginLeft:'8px'}}>{topic.topics.title}</span>
</div>
    </div>
)}
 
            </>
                      
                      ))}
                    </ul>
                  </Collapse>
                </div>
              ))
            ) : (
              <p>No data available.</p>
            )}
          </div>
        </nav>
        <div role="main" className="col-md-1">
          {selectedTopic && 
          
          <>
          <Container style={{ width: '800px',backgroundColor:'white' }}>
            {loading && <LoaderScreen />}
         {!loading && <> <Button style={{marginLeft:'70%',marginTop:'3%',backgroundColor:'white',color:'blue',borderColor:'blue'}} variant="primary" onClick={GenerateSummary} >
						Generate Summary
					</Button>
            <div style={{ maxHeight: '500px',backgroundColor:'white', overflowY: 'auto',padding:'40px' }}>
            <h style={{ fontSize: '2em', fontWeight: 'bold' }}>{selectedTopic.topics.title}</h>
          {/* <p style={{}} >{content}</p> */}
          <div dangerouslySetInnerHTML={{ __html: content }} />
          </div>
            <Button style={{marginLeft:'200px',marginTop:'20px'}} disabled={selectedTopic.is_covered} onClick={() => markAsCompleted(selectedTopic.topics.id, selectedWeeklyGoalId)}>
      {selectedTopic.is_covered ? 'Already Completed' : 'Mark as Completed'}
    </Button>
    </>}
          </Container>
         
        </>
          // <TopicContent topic={selectedTopic} weekly_goal_id={selectedWeeklyGoalId} fetchWeeklyGoals={fetchWeeklyGoals}/>}
}
{showQuizForm && <Container style={{ width: '600px',backgroundColor:'white' }}>
 <QuizForm quiz={selectedQuiz} weeklyGoalId={selectedWeeklyGoalId} studyPlan={studyPlan} />
 </Container>
 }
        </div>
      </div>
    </div>) : (
      <LoaderScreen />
    )}
    </>
  );
};

export default Sidebar;

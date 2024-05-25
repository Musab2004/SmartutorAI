import React, { useState, useContext, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal,Button, Container, Collapse } from 'react-bootstrap';
import userService from '../landing_page_component/UserSerive';
import { UserContext } from '../landing_page_component/UserContext';
import { useLocation,useNavigate } from 'react-router-dom';
import { colors } from '@material-ui/core';
import axios from 'axios';
// import Loader
import { Weekend, ExpandMore } from '@mui/icons-material';

import LoaderScreen from '../HomePage/LoaderScreen';
import StudyPlans from '../HomePage/AllStudyPlans';

// require('dotenv').config()
// import CircularProgress from '@mui/material/CircularProgress';
// const TopicContent = ({ topic,weekly_goal_id,fetchWeeklyGoals }) => {
//   const [isCovered, setIsCovered] = useState(false);
//   const markAsCompleted = async () => {
    
//     const response = await userService.get('api/weeklygoaltopiccovered/',{
//       params: {
//         weeklygoal_id: weekly_goal_id,
//         topic_id: topic.topics.id,
   
//       }
//     });
//     setIsCovered(true);
//     await fetchWeeklyGoals();
//     }
  
 

//   return (
  
//   );
// };
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
    // console.log("Study plan is here in Quiz Now : ",studyPlan)
    const [all_topics, setAllTopics] = useState([]);
    const [quizType, setQuizType] = useState('MCQ');
    const numQuestions=10
    const [selectedOption, setSelectedOption] = useState([]);
    console.log("weekly goal id : ",weeklyGoalId)
    console.log("quiz : ",quiz)
    const [Quiz, setQuiz] = useState([]);
    const navigate = useNavigate();
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
       
  
        // setQuestions(response.data.questions)
        return response.data.questions;
        // console.log(questions)
      })
  
    };
const [Questions, setQuestions] = useState([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
  fetchQuestions();
    }, [quiz]);
const startQuiz = async (topics) => {

setLoading(true);

const generatedQuestions = await createQuestions({ topics: topics });
setLoading(true);
userService.post('api/questions/', { questions: generatedQuestions, weekly_goal_id: weeklyGoalId ,quiz_id:quiz.topics.id,is_mcq:quizType==="MCQ" ? true : false})
navigate("/quiz", {state:{ quizId:quiz.topics.id,quizes:generatedQuestions, numQuestions,timer:10, quizType, weekid:weeklyGoalId ,studyPlan:studyPlan,is_mcq:quizType==="MCQ" ? true : false}});	
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
  const apiKey = "add your own";
  console.log("APi key : ",apiKey) // Replace with your actual OpenAI API key
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
	    console.log(matches)
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
        console.log("output text : ",outputText);
		const mcqPattern = /<question>(.*?)<\/question>.*?<answer>(.*?)<\/answer>.*?<distractor>(.*?)<\/distractor>/gs;
		const matches = [...outputText.matchAll(mcqPattern)];
		
			for (const match of matches) {
				const [_, question, answer, distractors] = match;
        const explanation=await getExplanation(question,answer.trim());
				allQuestions.push({
					id: id,
					Id: Id,
					context: content,
					title: title,
					question: question.trim(),
					correct_answer: answer.trim(),
					distractors: distractors.split('<d>').filter(d => d.trim()).map(d => d.replace('</d>', '').trim()),
          explanation:explanation
				});
			}
		
			return allQuestions;
		}
}

async function generateMCQsForPartition(partition, instruction = "Generate Biology based Short qa from it") {
  const inputs = alpaca_prompt.replace('{}', instruction).replace('{}', partition).replace('{}', '')
  console.log(inputs);
	if (quizType === 'MCQ') {
    try {
      const response = await axios.post('https://3de8-34-124-222-86.ngrok-free.app/generate-questions/', {
        input_text: inputs
      });
      return response.data.results;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
    }
    else{
      try {
        const response = await axios.post(' https://d9f6-34-16-138-45.ngrok-free.app/generate-questions/', {
          input_text: inputs
        });
        return response.data.results;
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
    
    
    }
}


async function createQuestions(topics) {
  try {
    const results = [];
    const allPartitions = [];

    console.log("started");
        console.log(topics);
    topics.topics.forEach(topic => {
      const parts = partition(topic.id, topic.title, topic.content);
      allPartitions.push(...parts);
    });

    const numSamples = Math.min(numQuestions, allPartitions.length);
    const selectedPartitions = allPartitions.sort(() => 0.5 - Math.random()).slice(0, numSamples);

    console.log("slected partitions : ",selectedPartitions);

    for (const topic of selectedPartitions) {
      const questions = await generateShortQA(topic.id, topic.title, topic.content, topic.id); // Await the API call
      console.log("questions : ",questions);
      results.push(...questions);
    }

    return results;
  } catch (e) {
    throw new Error(e.message);
  }
}


  

const GenerateQuiz = async () => {
  console.log("selectedOption", selectedOption);
  console.log("numQuestions", numQuestions);
  console.log("quizType", quizType);
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


  return (
    <>
   {!loading && <div>
      <h2>You have a quiz on {quiz.topics.title}</h2>
      <p>Click on the start button when you are ready.</p>
      <p>Topics these are based on.</p>
      <select>
  {all_topics.map((topic, index) => (
    <option key={index} value={topic.title}>
      {topic.title}
    </option>
  ))}
</select>
<p>Select Mcq type : </p>
<select value={quizType} onChange={(e) => setQuizType(e.target.value)}>
  <option value="ShortQA">ShortQA</option>
  <option value="MCQ">MCQ</option>
</select>

{!quiz.topics.followup_quiz && <Button onClick={() => startQuiz(all_topics)}>Start Quiz</Button>}

{quiz.topics.followup_quiz && <Button onClick={() => startQuiz(quiz.topics.topics_to_revisit)}>Follow up Quiz</Button>}
{quiz.topics.is_completed && <>
<p>correct questions : {quiz.topics.correct_questions.length}</p>
<p>wrong questions : {quiz.topics.wrong_questions.length}</p>

<p>Topics to revisit</p>
      <select>
  {quiz.topics.topics_to_revisit && quiz.topics.topics_to_revisit.map((topic, index) => (
    <option key={index} value={topic.title}>
      {topic.title}
    </option>
  ))}
</select>
{/* <Button>Follow up Quiz</Button> */}

</>}
    </div>
  }

{loading  &&  <LoaderScreen />}
</>
  );
}
const Sidebar = ({ studyPlan,data }) => {
  const navigate = useNavigate();
  var [data, setData] = useState(null);
  const { userData } = useContext(UserContext);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedWeeklyGoalId, setSelectedWeeklyGoalId] = useState(null);
  const [is_covered, setIs_covered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isCovered, setIsCovered] = useState(false);
  // data=data
  console.log("Study plan is here : ",studyPlan)
  const markAsCompleted = async (topic_id,weekly_goal_id) => {
  
    const response = await userService.get('api/weeklygoaltopiccovered/',{
      params: {
        weeklygoal_id: weekly_goal_id,
        topic_id: topic_id,
   
      }
    });
    setIsCovered(true);
    console.log("after marking as completed");
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
      console.log(response.data.response)
    } catch (error) {
      console.error('Error:', error);
    }
  };
// fetchWeeklyGoals();
  useEffect(() => {
    fetchWeeklyGoals();
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
    console.log('Course closed');
    setShowModal(false);
    navigate('/my-courses')
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


        
        {data ? (<div className="container" style={{marginLeft:'20%',width:'70%'}}>
      <div className="row no-gutters">
        <nav className="col-md-5 bg-light sidebar"  style={{width:'250px'}}>
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
             {topic.topics.is_quiz &&     <div
                   className="nav-link"
                   onClick={() => handleQuizClick(topic, week.weekly_goals.id)}
                   style={{ cursor: 'pointer',color:'red' }}
               >
                   {topic.is_covered && <i class="fa fa-check" style={{color:'blue'}} aria-hidden="true"></i>
}
                   {topic.topics.title}
               </div>}
               {!topic.topics.is_quiz &&     <div
                className="nav-link"
                onClick={() => handleTopicClick(topic, week.weekly_goals.id)}
                style={{ cursor: 'pointer' }}
            >
                {topic.is_covered && <i class="fa fa-check" style={{color:'blue'}} aria-hidden="true"></i>
}
                {topic.topics.title}
            </div>}  
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
          <Container style={{ width: '600px',backgroundColor:'white' }}>
            <div style={{ maxHeight: '500px',backgroundColor:'white', overflowY: 'auto',padding:'40px' }}>
            <h style={{ fontSize: '2em', fontWeight: 'bold' }}>{selectedTopic.topics.title}</h>
          <p style={{}} >{content}</p>
          </div>
            <Button style={{marginLeft:'200px',marginTop:'20px'}} disabled={selectedTopic.is_covered} onClick={() => markAsCompleted(selectedTopic.topics.id, selectedWeeklyGoalId)}>
      {selectedTopic.is_covered ? 'Already Completed' : 'Mark as Completed'}
    </Button>
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

import React, { useState,useContext,useEffect } from 'react';
import './TimeTable.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import userService from '../landing_page_component/UserSerive';
import { UserContext } from '../landing_page_component/UserContext';
import { useLocation,useNavigate } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';
import Navbar from "./HomePageNavbar"
import background_image from './background_image.jpg';
import StudyPlans from './StudyPlansStillGoingOn';
import LoaderScreen from './LoaderScreen';
function App() {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  let location = useLocation();
  let studyPlan_id = location.state.books.id;
  let studyPlan = location.state.books;
  const { userData } = useContext(UserContext);
  console.log(userData);
  const [activeTab, setActiveTab] = useState("createstudyplan");
  console.log(studyPlan);
  const [data, setData] = useState([]);

  const fetchWeeklyGoals = async () => {
    setIsLoading(true);
    try {
      const response = await userService.get('api/getweeklygoals/', {
        params: {
          studyplan_id: studyPlan_id,
          user_id: userData.id,
        }
      });
      console.log(response.data);
      setData(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  fetchWeeklyGoals();
  fetchWeeklyGoals();
  useEffect(() => {
    fetchWeeklyGoals();
  }, [studyPlan,userData]);

  const GottoDashBoard = () => {
    navigate('/dashboard',{state:{
      studyPlan
        },})
 
  };
  if (isLoading) {
    return <div>Loading...</div>; // Replace this with your actual loading screen
  }
  return (
  
   <>
      <style>
    {`
      body {
        background-color: #e1efff; /* Set the background color to blue */
        margin: 0; /* Reset margin for the body */
        padding: 0; /* Reset padding for the body */
      }
    `}
  </style>
   <Navbar activeTab={activeTab} />
   {data ? (<> 
  <Container style={{marginTop:'5%', backgroundColor:'white', borderRadius: '10px'}} >
<div style={{display:'flex'}}>
 
<div>
  
  <div className="container py-7" style={{textAlign:'center'}}>
    <h2 className="text-uppercase text-letter-spacing-xs my-0  font-weight-bold" style={{color:'#1f5692'}}>
      StudyPlan Schedule
    </h2>
    <p style={{color:'grey'}}>Your Final Time Table is here.</p>
    <p style={{color:'grey'}}s>Quizes per Week : {studyPlan.QuizesPerWeek}</p>
    <div className="row">
      {data.map((weekData, index) => (
        <div className="col-lg-4 mb-3" id={`week-${weekData.weekly_goals.order}`} key={index} style={{ marginTop: '5%' }}>
          <div style={{textAlign:'left'}}>
          <h4 className="mt-0 mb-3  op-8 font-weight-bold" style={{color:'#1f5692'}}>
            Week {weekData.weekly_goals.order} 
          </h4>
          <p style={{color:'grey'}}>{weekData.weekly_goals.start_date} - {weekData.weekly_goals.end_date  }</p>
          </div>
    <label htmlFor="topics">Topics</label>
<select id="topics" className="form-select">
  {weekData.chapters.map((chapter, chapIndex) => (
    <option value={chapIndex} key={chapIndex}>
      {chapter.title}
    </option>
  ))}
</select>
        </div>
      ))}
    </div>
  </div>
  <Button
        onClick={() => GottoDashBoard()}
      style={{ fontWeight: 'bold', borderColor:'#f66b1d',backgroundColor:'#f66b1d',marginLeft:'45%',marginBottom:'5%' ,marginTop:'30px',height:'50px',width:'250px'}}
    >
      Got to DashBoard
    </Button>
       
</div>


</div>
</Container>
</>
  )
  : (
       <LoaderScreen mesg="Loading Study Plan" />
     )}

</>
  );
}

export default App;
import React, { useState,useEffect,useContext } from 'react';
import { Container, Nav, Button, Row, Col, Card, Pagination,Dropdown } from 'react-bootstrap';
import 'font-awesome/css/font-awesome.min.css';
import { UserContext } from '../landing_page_component/UserContext';
import Dashboard from '../DashBoard';
// import {  } from "react-router-dom"
import Navbar from "./HomePageNavbar"
import { Link,useNavigate } from 'react-router-dom';
import MyLearningStudyPlans from './MyLearningStudyPlansCompleted';
import StudyPlansStillGoingOn from './StudyPlansStillGoingOn';
import AllStudyPlans from './AllStudyPlans';
import SearchStudyPlans from './SearchStudyPlans';
import CardSlider from './CardSlider';
import background_image from './background_image.jpg';
import logo from '../landing_page_component/logo_smarttutor.svg';
import useAuth from '../landing_page_component/useAuth'
import userService from '../landing_page_component/UserSerive';
import styled from 'styled-components';
import CreateStudyPlan from './CreateStudyPlans';
import ProfilePage from './ProfilePage';
import Footer from "../landing_page_component/footer"
function App() {
  const { userData } = useContext(UserContext);
  const navigate = useNavigate()


    const [posts, setPosts] = useState([]);
    const [completedstudyplans, setCompletedStudyPLans] = useState([]);
    const [ongoingstudyplans, setOngoingStudyPLans] = useState([]);
    const [tokenExists, setTokenExists] = useState(false);
   
    const [activeTab, setActiveTab] = useState("my-courses");

    const handleTabChange = (tab) => {
      navigate(tab)
      // setActiveTab(tab);
    };

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("token does'nt exit : ",localStorage)
        // Redirect to landing page if token doesn't exist
        setTokenExists(false);
        navigate('/landingpage');
      } else {
        setTokenExists(true);

      }
    }, []);

    const fetchUsers = async () => {
      try {
        const response = await userService.get(`/api/ongoingstudyplans/?user_id=${userData.pk}`,{user_id:userData.pk}); // Your Django endpoint to fetch users
        console.log(response.data)
        setOngoingStudyPLans(response.data);
      } catch (error) {
        console.error('Failed to fetch users', error);
        // navigate('/landingpage');
      }
    };
  
  useEffect(() => {
   
  
    fetchUsers();
  }, []);
  useAuth()


 

  const postsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate the start and end indices for the current page
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = posts.slice(startIndex, endIndex);

  // Function to handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  const [activeTab2, setActiveTab2] = useState(1);

  const handleTabClick = (tabNumber) => {
    setActiveTab2(tabNumber);
  };
  const [hoveredCard, setHoveredCard] = useState(null); // Initialize hover state for each card

  // Function to handle hover events for a specific card
  const handleHover = (index) => {
    setHoveredCard(index);
  };
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
    <div style={{backgroundColor:'#e1efff'}}>
      <Navbar activeTab={activeTab} />
  
    
    
           
        
            <section>
              {/* Your content for "My Courses" */}
              <div> 
              <div style={{marginTop:'100px',marginLeft:'35%' ,backgroundColor:'#e1efff'}}>
              <Button 
    onClick={() => handleTabClick(1)} 
    style={{
      width:'200px',
        color: activeTab2 === 1 ? '#f66b1d' : '#000',
        borderColor: 'white',
        backgroundColor: '#fff',
        borderBottom: activeTab2 === 1 ? '4px solid #f66b1d' : 'none', 
        fontStyle: activeTab2 === 1 ? 'italic' : 'normal'
    }}
>
    Still Going On
</Button>
<Button 
    onClick={() => handleTabClick(2)} 
    style={{
        marginLeft:'10px',
        width:'200px', 
        color: activeTab2 === 2 ? '#f66b1d' : '#000',
        borderColor: 'white',
        backgroundColor: '#fff',
        borderBottom: activeTab2 === 2 ? '4px solid #f66b1d' : 'none', 
        fontStyle: activeTab2 === 2 ? 'italic' : 'normal'
    }}
>
    Completed
</Button>
        </div>
      <div class='container'>
        {activeTab2 === 2 &&<> <MyLearningStudyPlans studyPlans={completedstudyplans} itemsPerPage={5} /> </> }
        {activeTab2 === 1 && <><StudyPlansStillGoingOn  itemsPerPage={5} /></>}
      </div>
    </div>
             
            </section>
    

          
            <footer className="bg-light text-lg-start" style={{marginTop:'100px'}}>
       <Footer/>
      </footer>
    </div>
  
    </>
   );
}

export default App;

import React, { useState,useContext,useEffect } from 'react';
import  { useLocation,useNavigate } from 'react-router-dom';
import { Tabs, Tab,Button ,Row,Col,Modal,Container,Alert,ButtonGroup} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './sidebar';
import DashBoardNavbar from './DashBoardNavbar';
import DisscusionForum from './DisscusionForum';
import ResourcePreview from './ResourcePreview';
import { UserContext } from '../landing_page_component/UserContext';
import userService from '../landing_page_component/UserSerive';
import StudyPlanSettings from './StudyPlanSettings';
import DashboardTabs from './Dashbaord_tabs';
// import { Link,useNavigate } from 'react-router-dom';
import Footer from "../landing_page_component/footer"
import { Editor } from '@tinymce/tinymce-react';
const StylishTabs = () => {
  const navigate = useNavigate()
  const { userData } = useContext(UserContext);
  const [activeButton, setActiveButton] = useState('tab3');


  const [key, setKey] = useState('tab1');
  // const [alertPost, setAlertPost] = useState({show: false, variant: '', message: ''});
  const [alert, setAlert] = useState({show: false, variant: '', message: ''});

  const [posts, setPosts] = useState([]);
  const [bookData, setbookData] = useState([]);
  
  const [visiblePosts, setVisiblePosts] = useState(4); // Number of posts to display initially
  // console.log(userData)
  useEffect(() => {
    const fetchPosts = async () => {
      try { 
        const response = await userService.get(`/api/queryposts/?study_plan_id=${studyPlan.id}`);
        // console.log(response.data);
        setPosts(response.data);
      } catch (error) {
        console.error('Failed to fetch posts', error);
        navigate('/homepage');
      }
    };
  
    const interval = setInterval(fetchPosts, 3000); // Fetch data every 5 seconds (adjust as needed)
  
    // Cleanup function to clear the interval when component unmounts or when you don't need it anymore
    return () => clearInterval(interval);
  }, []);
  const location = useLocation();

  const studyPlan = location.state?.studyPlan;
  const plan=studyPlan
  console.log(studyPlan)
  if (!studyPlan) {
    navigate('/homepage'); // Replace '/homepage' with your homepage route
  }
  else{



  }
  const fetchBook = async () => {
    try { 
      const response = await userService.get(`/api/books/${studyPlan.books}/`);
      // console.log(response.data);
      setbookData(response.data);
    } catch (error) {
      console.error('Failed to fetch posts', error);
      // navigate('/landingpage');
    }
  };

  useEffect(() => {
    fetchBook(); // This will run only once, when the component mounts
  }, []);
  // console.log(studyPlan);
  // console.log(props)
  const [showModal, setShowModal] = useState(false);
  const [postInput, setPostInput] = useState('');
  const [textAreaValue, setTextAreaValue] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log("token does'nt exit : ",localStorage)
      // Redirect to landing page if token doesn't exist
    
      navigate('/landingpage');
    } else {
  
    }
  }, []);

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleModalShow = () => {
    setShowModal(true);
  };

  const handlePostSubmit = async (e) => {
    // Assuming postInput contains the data to be sent
    const postData = {
      title: textAreaValue,
      content:textAreaValue,
      author: userData.pk,
      study_plan:studyPlan.id,

    };
  
      try {
        const response = await userService.post('/api/queryposts/', postData);
        // Handle success - maybe show a success message or redirect
        console.log('Response:', response.data);
        console.log('Response:', response.data);
        handleModalClose();
        setAlert({show: true, variant: 'success', message: 'Post submitted successfully!'});
      } catch (error) {
        // Handle error - show error message or perform necessary actions
        // console.error('Error:', error);
        console.error('Error:', error);
        handleModalClose();
        setAlert({show: true, variant: 'danger', message: 'Error submitting post!'});
      }
  };

  const postsPerPage = 4; // Number of posts to load per click

  const handleLoadMore = () => {
    setVisiblePosts(visiblePosts + postsPerPage);
  };

  const [content, setContent] = useState('');

  const handleEditorChange = (content) => {
    setPostInput(content);
  };


  // Step 3: Event handler to capture changes in the text area
  const handleTextAreaChange = (event) => {
    setTextAreaValue(event.target.value);
  };
  const handleClick = (tab, path) => {
    setActiveButton(tab);
    navigate(path,{state:{
        studyPlan
          },});
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

    <DashBoardNavbar/>
    {alert.show && <Alert 
  variant={alert.variant} 
  style={{
    marginTop: '50px', 
    position: 'fixed', 
    zIndex: 9999, 
    top: 0, 
    right: 0, 
    left: 0
  }} 
  onClose={() => setAlert({...alert, show: false})} 
  dismissible
>
  {alert.message}
</Alert>}
<div style={{marginTop:'100px' }}>

<DashboardTabs studyPlan={studyPlan} activeButton={activeButton}/>
</div>
        {/* Content for Tab 2 */}
  
      
   
 
 
    </>
  );
};

export default StylishTabs;
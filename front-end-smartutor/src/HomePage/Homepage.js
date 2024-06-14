import React, { useState, useEffect, useContext } from "react";
import { Container, Nav, Button, Row, Col, Card, Pagination, Dropdown } from "react-bootstrap";
import "font-awesome/css/font-awesome.min.css";
import { UserContext } from "../landing_page_component/UserContext";
import Dashboard from "../DashBoard";
// import {  } from "react-router-dom"
import Navbar from "./HomePageNavbar";
import Footer from "../landing_page_component/footer";
import { Link, useNavigate } from "react-router-dom";
import MyLearningStudyPlans from "./MyLearningStudyPlansCompleted";
import StudyPlansStillGoingOn from "./StudyPlansStillGoingOn";
import AllStudyPlans from "./AllStudyPlans";
import SearchStudyPlans from "./SearchStudyPlans";
import CardSlider from "./CardSlider";
import background_image from "./background_image.jpg";
import logo from "../landing_page_component/logo_smarttutor.svg";
import useAuth from "../landing_page_component/useAuth";
import userService from "../landing_page_component/UserSerive";
import FutureUpdate from "./Future_updates.jpg"
import FutureUpdate2 from "./Future_updates2.jpg"
import styled from "styled-components";
import CreateStudyPlan from "./CreateStudyPlans";
import ProfilePage from "./ProfilePage";
import { Box, Typography } from '@mui/material'; // Ensure you import the CardSlider component correctly
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
const FutureUpdatesSection = ({ posts }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  const updates = [
    {
      title: "Handwritten Solutions",
      description: "Upload images of handwritten questions, and our advanced system will provide detailed solutions instantly.",
      backgroundImage: `url(${FutureUpdate2})`,
    },
    {
      title: "Voice Recognition",
      description: "Introducing voice recognition for inputting questions, making studying even more accessible and convenient.",
      backgroundImage: `url(${FutureUpdate})`,
    },
    {
      title: "Multilingual Support",
      description: "Our platform will soon support multiple languages, breaking down barriers in education.",
      backgroundImage: `url(${FutureUpdate2})`,
    },
  ];

  return (
    <Box sx={{ py: 8, width: '97vw', position: 'relative', left: '50%', transform: 'translateX(-50%)' }}>
      <Slider {...settings}>
        {updates.map((update, index) => (
          <Box
            key={index}
            sx={{
              height: '600px',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundImage: `${update.backgroundImage}`,
            }}
          >
            <Container style={{marginTop:'10%'}}>
              <Typography variant="h4" component="div" sx={{ textAlign: 'center', fontWeight: 'bold', fontStyle: 'italic', mb: 4, fontSize:'50px',color: 'black', marginTop: '3%' }}>
                Future Updates: {update.title}
              </Typography>
              <Typography variant="h6" component="p" sx={{ maxWidth: '700px', mb: 4,marginLeft:'20%', textAlign: 'center',fontSize:'30px', color: 'black' }}>
                {update.description}
              </Typography>
           
            </Container>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

function App() {
	const { userData } = useContext(UserContext);
	const navigate = useNavigate();

	const [posts, setPosts] = useState([]);
	const [completedstudyplans, setCompletedStudyPLans] = useState([]);
	const [ongoingstudyplans, setOngoingStudyPLans] = useState([]);
	const [tokenExists, setTokenExists] = useState(false);

	const [activeTab, setActiveTab] = useState("home");

	const handleTabChange = (tab) => {
		navigate(tab);
	};
	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("userData");
		console.log("token removed : ", localStorage);
	};
	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			console.log("token does'nt exit : ", localStorage);
			setTokenExists(false);
			navigate("/");
		} else {
			setTokenExists(true);
		}
	}, []);
	const fetchUsers = async () => {
		try {
			const response = await userService.get("/api/studyplans/", { params: { user_id: userData.id } });// Your Django endpoint to fetch users
			console.log(response.data);
			setPosts(response.data);
		} catch (error) {
			console.error("Failed to fetch users", error);
		}
	};

	useEffect(() => {
		if (userData) {
		  fetchUsers();
		}
	  }, [userData]); // Add userData as a dependency




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
			<div style={{ backgroundColor: "#e1efff" }}>
				<Navbar activeTab={activeTab} />

				<div style={{ backgroundColor: "#e1efff",marginBottom:'5%' }}>
					<Container style={{ backgroundColor: "#e1efff" }}>
						{activeTab === "home" && (
							<>
								{posts.length === 0 ? (
									<div style={{ textAlign: "center", marginTop: "20%" }}>
										<h3>No study plans available</h3>
										{/* You can add additional text or a message here */}
									</div>
								) : (
									<>
									<FutureUpdatesSection/>
										<section
											style={{
												backgroundColor: "#e1efff",
											}}
										>
											<div
												style={{
													textAlign: "left",
													fontWeight: "bold",
													fontSize: "24px",
													marginTop: "100px",
													color: "#1f5692",
											
													marginBottom: "1rem",
												}}
											>
												Featured Study Plans
											</div>
											<CardSlider cards={posts} />
										</section>
									
									
									</>
								)}
							</>
						)}
					</Container>
				</div>

				{/* Footer */}
				<div style={{ bottom: 0, width: '100%' }}>
					<Footer />
				</div>
			</div>
		</>
	);
}

export default App;

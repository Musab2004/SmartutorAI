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
import FutureUpdate from "./future_update.jpg"
import styled from "styled-components";
import CreateStudyPlan from "./CreateStudyPlans";
import ProfilePage from "./ProfilePage";
import { Box, Typography } from '@mui/material'; // Ensure you import the CardSlider component correctly

const FutureUpdatesSection = ({ posts }) => {
  return (
    <Box sx={{ backgroundColor: '#f5f5f5',backgroundImage:{FutureUpdate}, py: 8, height:'400px', width: '99vw', position: 'relative', left: '50%', transform: 'translateX(-50%)' }}>
      <Container>
        <Typography
          variant="h4"
          component="div"
          sx={{ textAlign: 'center', fontWeight: 'bold', fontStyle: 'italic', mb: 4 ,marginTop:'3%'}}
        >
          Future Updates: Handwritten Solutions
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            textAlign: 'center',
            color: '#555',
          }}
        >
          <Typography variant="h6" component="p" sx={{ maxWidth: '800px', mb: 4 }}>
            We are excited to announce a groundbreaking feature coming soon! You will
            be able to upload images of handwritten questions, and our advanced
            system will provide detailed solutions instantly. Stay tuned for this
            revolutionary update that will make studying even more effortless and
            efficient!
          </Typography>
          <Box
            sx={{
              width: '80%',
              height: '50px',
              backgroundImage: {FutureUpdate},
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: 2,
              mb: 4,
            }}
          />
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ fontWeight: 'bold' }}
            onClick={() => alert('Stay tuned for updates!')}
          >
            Stay Updated
          </Button>
        </Box>
      </Container>
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

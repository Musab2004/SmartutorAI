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
import styled from "styled-components";
import CreateStudyPlan from "./CreateStudyPlans";
import ProfilePage from "./ProfilePage";
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
		// setActiveTab(tab);
	};
	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("userData");
		console.log("token removed : ", localStorage);

		// setActiveTab(tab);
	};
	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			console.log("token does'nt exit : ", localStorage);
			// Redirect to landing page if token doesn't exist
			setTokenExists(false);
			navigate("/");
		} else {
			setTokenExists(true);
		}
	}, []);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await userService.get("/api/studyplans/"); // Your Django endpoint to fetch users
				console.log(response.data);
				setPosts(response.data);
			} catch (error) {
				console.error("Failed to fetch users", error);
				// navigate('/');
			}
		};

		fetchUsers();
	}, []);
	// Empty dependency array means this effect runs once on component mount

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await userService.get(`/api/ongoingstudyplans/?user_id=${userData.pk}`, {
					user_id: userData.pk,
				}); // Your Django endpoint to fetch users
				console.log(response.data);
				setOngoingStudyPLans(response.data);
			} catch (error) {
				console.error("Failed to fetch users", error);
				// navigate('/landingpage');
			}
		};
		// useAuth();
		fetchUsers();
		Recommendations();
	}, []);

	const Recommendations = async () => {
		try {
			console.log(userData.pk);
			const response = await userService.get(`/api/recommendedstudyplans/`, {
				params: { user_id: userData.pk },
			});

			console.log(response.data);
			// setOngoingStudyPLans(response.data);
		} catch (error) {
			console.error("Failed to fetch users", error);
			// navigate('/landingpage');
		}
	};

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
			<div style={{ backgroundColor: "#e1efff" }}>
				<Navbar activeTab={activeTab} />

				<div style={{ backgroundColor: "#e1efff" }}>
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
													fontStyle: "italic",
													marginBottom: "1rem",
												}}
											>
												Recommended Study Plans
											</div>
											<CardSlider cards={posts} />
										</section>
										<section
											style={{
												marginTop: "0px",
												marginTop: "50px",
												marginBottom: "50px",
												backgroundColor: "#e1efff",
											}}
										>
											<div
												style={{
													textAlign: "left",
													fontWeight: "bold",
													fontSize: "24px",
													color: "#1f5692",
													fontStyle: "italic",
													marginBottom: "1rem",
												}}
											>
												Popular Study Plans
											</div>
											<CardSlider cards={posts} />
										</section>
										<section
											style={{
												marginTop: "0px",
												marginTop: "50px",
												marginBottom: "50px",
												backgroundColor: "#e1efff",
											}}
										>
											<div
												style={{
													textAlign: "left",
													fontWeight: "bold",
													fontSize: "24px",
													color: "#1f5692",
													fontStyle: "italic",
													marginBottom: "1rem",
												}}
											>
												Latest Study Plans
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
				<footer className="bg-light text-lg-start" style={{ marginTop: "100px" }}>
					<Footer />
				</footer>
			</div>
		</>
	);
}

export default App;

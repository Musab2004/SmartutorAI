import React, { useState, useContext,useEffect } from "react";
import { Form, Alert, Button, Container } from "react-bootstrap";
import Navbar from "./HomePageNavbar";
import axios from "axios";
import userService from "../landing_page_component/UserSerive";
import { UserContext } from "../landing_page_component/UserContext";
import background_image from "./background_image.jpg";
import styled from "styled-components";
import LoadingScreen from "./LoaderScreen";
import { Link, useNavigate } from "react-router-dom";
import ResourcePreview from "../DashBoard/ResourcePreview";
import Footer from "../landing_page_component/footer";
import Grid from '@mui/material/Grid';
const StyledForm = styled(Form)`
	margin-top: 50px;
	margin-bottom: 50px;
	background-color: #f8f9fa;
	backdropfilter: "blur(50px)";
	padding: 20px;
	border-radius: 5px;
	width: 60%;
	box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
`;

const StyledButton = styled(Button)`
	background-color: #007bff;
	border-color: #007bff;
	&:hover {
		background-color: #0056b3;
		border-color: #0056b3;
	}
`;

const StudyPlanForm = () => {
	const [activeTab, setActiveTab] = useState("createstudyplan");
	const navigate = useNavigate();
	const [showAlert, setShowAlert] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [NextStep, setNextStep] = useState(false);
	var [StudyPlans, setStudyPlans] = useState(false);
	const { userData } = useContext(UserContext);
	const [bookData, setbookData] = useState([]);
	const [tokenExists, setTokenExists] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		duration: "3",
		description: "",
		subject: "Physics",
		academic_level: "",
		is_public: true,
		quizzesPerWeek: "2",
		image: null, // Assuming you'll store the file here
	});
	const [selectedFile, setSelectedFile] = useState(null);
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
	const handleFileChange = (event) => {
		const file = event.target.files[0];
		setSelectedFile(file);
		console.log("selected file : ", selectedFile);
	};

	const handleUpload = () => {
		if (selectedFile) {
			const formData = new FormData();
			formData.append("file", selectedFile);
		}
	};
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		const postData = new FormData();
		postData.append("name", formData.name);
		postData.append("duration", formData.duration);
		postData.append("subject", formData.subject);
		postData.append("owner", userData.pk);
		postData.append("books", selectedFile);
		postData.append("academic_level", formData.academic_level);
		postData.append("is_public", formData.is_public);
		postData.append("QuizesPerWeek", formData.quizzesPerWeek);
		postData.append("is_completed", false);
		try {
			const study_plan = await userService.post("/api/studyplans/", postData);
			// Handle success - maybe show a success message or redirect
			console.log("Response:", study_plan.data);
			if (study_plan.data) {
				console.log("Response:", study_plan.data);
				setStudyPlans(study_plan.data);
				console.log(StudyPlans);
				setNextStep(true);
				navigate("/maketimetable", { state: { books: study_plan.data } });
			} else {
				setIsLoading(false);
				navigate("/createstudyplan");

				// setShowAlert(true);
				alert("PDF not structured, can't process it");
			}
		} catch (error) {
			// This will run only once, when the component mounts

			// Handle error - show error message or perform necessary actions
			console.error("Error:", error);
		} finally {
			console.log("fetch book called here ");

			setIsLoading(false);
			// fetchBook();
			// setNextStep(true);
		}
	};
	const weeksOptions = [];
	for (let i = 2; i <= 12; i++) {
		weeksOptions.push(
			<option key={i} value={i}>
				{i} weeks
			</option>
		);
	}

	const quizzesPerWeekOptions = [1, 2, 3].map((num) => (
		<option key={num} value={num}>
			{num} quiz{num > 1 ? "zes" : ""}
		</option>
	));
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
			{isLoading ? (
				<>
					
					<Navbar activeTab={activeTab} /> <LoadingScreen />
				</>
			) : (
				<>
					{showAlert && (
						<Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
							<Alert.Heading>Oh snap! You got an error!</Alert.Heading>
							<p>PDF not structured, can't process it</p>
						</Alert>
					)}
					<Navbar activeTab={activeTab} />
					<Container style={{ backgroundColor: "#e1efff" }}>
						<div style={{ display: "flex", marginTop: "5%" }}>
							<StyledForm onSubmit={handleSubmit} style={{ flex: 1, marginTop: "50px" }}>
								<Grid container spacing={2.5}>
									<Grid item xs={12} md={6}>
										<Form.Group controlId="name">
											<Form.Label>Name</Form.Label>
											<Form.Control
												type="text"
												placeholder="Enter name"
												name="name"
												value={formData.name}
												onChange={handleChange}
												required
												maxLength={50}
											/>
										</Form.Group>
									</Grid>
									<Grid item xs={12} md={6}>
										<Form.Group controlId="duration">
											<Form.Label>Duration (in weeks)</Form.Label>
											<Form.Control
												as="select"
												name="duration"
												value={formData.duration}
												onChange={handleChange}
												required
											>
												<option value="">Select duration</option>
												{weeksOptions}
											</Form.Control>
										</Form.Group>
									</Grid>
									<Grid item xs={12} md={6}>
										<Form.Group controlId="subject">
											<Form.Label>Subject</Form.Label>
											<Form.Control
												as="select"
												name="subject"
												value={formData.subject}
												onChange={handleChange}
												required
											>
												<option value="Physics">Physics</option>
												<option value="Chemistry">Chemistry</option>
												<option value="Geography">Geography</option>
												<option value="History">History</option>
												<option value="English">English</option>
											</Form.Control>
										</Form.Group>
									</Grid>
									<Grid item xs={12} md={6}>
										<Form.Group controlId="academicLevel">
											<Form.Label>Choose your resource academic level</Form.Label>
											<Form.Control
												as="select"
												name="academic_level"
												value={formData.academic_level || "Middle School"}
												onChange={handleChange}
												required
											>
												<option value="Middle School">Middle School</option>
												<option value="High School">High School</option>
												<option value="Higher education">Higher Education</option>
												{/* Add more academic levels if needed */}
											</Form.Control>
										</Form.Group>
									</Grid>
									<Grid item xs={12} md={6}>
										<Form.Group controlId="quizzesPerWeek">
											<Form.Label>Number of quizzes per week</Form.Label>
											<Form.Control
												as="select"
												name="quizzesPerWeek"
												value={formData.quizzesPerWeek}
												onChange={handleChange}
												required
											>
												<option value="">Select number of quizzes per week</option>
												{quizzesPerWeekOptions}
											</Form.Control>
										</Form.Group>
									</Grid>
									<Grid item xs={12} md={6}>
										<Form.Group controlId="publicPrivate">
											<Form.Label>Choose Visibility of Study Plan</Form.Label>
											<Form.Check
												type="radio"
												label="Public"
												name="publicPrivate"
												id="public"
												value="public"
												checked={formData.publicPrivate === "public"}
												onChange={handleChange}
											/>
											<Form.Check
												type="radio"
												label="Private"
												name="publicPrivate"
												id="private"
												value="private"
												checked={formData.publicPrivate === "private"}
												onChange={handleChange}
											/>
										</Form.Group>
									</Grid>
									<Grid item xs={12} md={6}>
										<Form.Group controlId="image">
											<Form.Label>Upload Document</Form.Label>

											<Form.Control
												type="file"
												accept=".pdf"
												onChange={handleFileChange}
												required
											/>
										</Form.Group>
									</Grid>
									<Grid
										item
										xs={12}
										md={12}
										sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}
									>
										<StyledButton
											variant="primary"
											type="submit"
											style={{
												backgroundColor: "#f66b1d",
												borderColor: "#f66b1d",
												width: "150px",
											}}
											onClick={handleSubmit}
										>
											Submit
										</StyledButton>
									</Grid>
								</Grid>
							</StyledForm>
						</div>
					</Container>
				</>
										
			)}
			<footer className="bg-light text-lg-start" style={{ marginTop: "100px" }}>
				<Footer />
			</footer>
		</>
	);
};

export default StudyPlanForm;

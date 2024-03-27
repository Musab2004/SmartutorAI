import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
	Tabs,
	Tab,
	Button,
	Row,
	Col,
	Modal,
	Container,
	Alert,
	ButtonGroup,
	Form,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "./sidebar";
import DashBoardNavbar from "./DashBoardNavbar";
import DisscusionForum from "./DisscusionForum";
import ResourcePreview from "./ResourcePreview";
import QuizRoomList from "./QuizRoomList";
import { UserContext } from "../landing_page_component/UserContext";
import userService from "../landing_page_component/UserSerive";
import StudyPlanSettings from "./StudyPlanSettings";
// import { Link,useNavigate } from 'react-router-dom';
import { Editor } from "@tinymce/tinymce-react";
import Footer from "../landing_page_component/footer";
import DashboardTabs from "./Dashbaord_tabs";
import Quiz from "./Quiz";
import DatePicker from "react-datepicker";
import "bootstrap/dist/css/bootstrap.min.css";
import Select from "react-select";
const StylishTabs = () => {
	const navigate = useNavigate();
	const { userData } = useContext(UserContext);
	const [activeButton, setActiveButton] = useState("tab2");

	const [key, setKey] = useState("tab2");
	// const [alertPost, setAlertPost] = useState({show: false, variant: '', message: ''});
	const [alert, setAlert] = useState({ show: false, variant: "", message: "" });

	const [posts, setPosts] = useState([]);
	const [bookData, setbookData] = useState([]);

	const [visiblePosts, setVisiblePosts] = useState(4); // Number of posts to display initially
	// console.log(userData)

	const location = useLocation();

	const studyPlan = location.state?.studyPlan;
	const plan = studyPlan;
	const book_id = studyPlan.books[0];
	console.log(studyPlan);

	if (!studyPlan) {
		navigate("/homepage"); // Replace '/homepage' with your homepage route
	}

	const fetchBook = async () => {
		try {
			const response = await userService.get(`/api/books/${studyPlan.books}/`);
			// console.log(response.data);
			setbookData(response.data);
		} catch (error) {
			console.error("Failed to fetch posts", error);
			// navigate('/');
		}
	};

	useEffect(() => {
		fetchBook(); // This will run only once, when the component mounts
	}, []);

	const [showModal, setShowModal] = useState(false);
	const [postInput, setPostInput] = useState("");
	const [textAreaValue, setTextAreaValue] = useState("");
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
			content: textAreaValue,
			author: userData.pk,
			study_plan: studyPlan.id,
		};

		try {
			const response = await userService.post("/api/queryposts/", postData);
			// Handle success - maybe show a success message or redirect
			console.log("Response:", response.data);
			console.log("Response:", response.data);
			handleModalClose();
			setAlert({ show: true, variant: "success", message: "Post submitted successfully!" });
		} catch (error) {
			// Handle error - show error message or perform necessary actions
			// console.error('Error:', error);
			console.error("Error:", error);
			handleModalClose();
			setAlert({ show: true, variant: "danger", message: "Error submitting post!" });
		}
	};

	const postsPerPage = 4; // Number of posts to load per click

	const handleLoadMore = () => {
		setVisiblePosts(visiblePosts + postsPerPage);
	};

	const [content, setContent] = useState("");

	const handleEditorChange = (content) => {
		setPostInput(content);
	};

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			console.log("token does'nt exit : ", localStorage);
			// Redirect to landing page if token doesn't exist

			navigate("/");
		}
	}, []);

	// Step 3: Event handler to capture changes in the text area
	const handleTextAreaChange = (event) => {
		setTextAreaValue(event.target.value);
	};

	const handleClick = (tab, path) => {
		setActiveButton(tab);
		navigate(path, {
			state: {
				studyPlan,
			},
		});
	};

	const [selectedDate, setSelectedDate] = useState(new Date());
	const [selectedTime, setSelectedTime] = useState("12:00");
	const [chapter, setChapter] = useState("");
	const [topic, setTopic] = useState("");
	const [duration, setDuration] = useState();
	const [numQuestions, setNumQuestions] = useState("");
	const [quizType, setQuizType] = useState("");
	const [QuizRooms, setQuizRooms] = useState([]);
	// Function to handle form submission
	const formatDate = (date) => {
		const d = new Date(date),
			month = "" + (d.getMonth() + 1),
			day = "" + d.getDate(),
			year = d.getFullYear();

		return [year, month.padStart(2, "0"), day.padStart(2, "0")].join("-");
	};

	const handleSubmit = () => {
		console.log("called");
		if (userData) {
			const quizRoomData = {
				time,
				date: formatDate(selectedDate),
				chapter,
				topic,
				duration: parseInt(duration, 10),
				numQuestions,
				quizType,
				study_plan: studyPlan.id,
				owner: userData.pk,
			};

			userService
				.post("/api/quizroom/", quizRoomData)
				.then((response) => {
					console.log(response.data);
					// You can do something with the response here
					// ...

					// Close the modal
					// handleClose();
				})
				.catch((error) => {
					console.error(error);
					// Handle the error here
					// ...
				});
		}
	};

	const fetchUsers = async () => {
		try {
			const response = await userService.get("/api/quizroom/"); // Your Django endpoint to fetch users

			console.log(response.data);
			setQuizRooms(response.data);
		} catch (error) {
			console.error("Failed to fetch users", error);
			// navigate('/landingpage');
		}
	};

	useEffect(() => {
		fetchUsers();
		fetchTopics();
	}, []);

	const [topics, settopics] = useState();

	const fetchTopics = async () => {
		try {
			const response = await userService.get("api/topics/", {
				params: {
					book_id: book_id,
				},
			});

			settopics(response.data);
			console.log(response.data);
		} catch (error) {
			console.error("Error:", error);
		}
	};

	const [time, settime] = useState("10:00");

	const onChange = (timeValue) => {
		settime(timeValue);
	};

	const [selectedOptions, setSelectedOptions] = useState([]);

	// Your topics array
	// const options = [
	//   { value: 'chocolate', label: 'Chocolate' },
	//   { value: 'strawberry', label: 'Strawberry' },
	//   { value: 'vanilla', label: 'Vanilla' }
	// ];

	// State to hold the selected option
	const [selectedOption, setSelectedOption] = useState([]);

	// Handler for when options are selected
	const handleChange = (selectedOption) => {
		setSelectedOption(selectedOption);
		console.log(`Option selected:`, selectedOption);
	};
	var options = [];
	console.log(typeof topics, Array.isArray(topics));

	if (topics) {
		let topicses = JSON.parse(topics);
		console.log("topics are her : ", topicses);
		options = Array.isArray(topicses)
			? topicses.map((topic) => ({
					value: topic.pk,
					label: topic.fields.title,
			  }))
			: [];
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
			<DashBoardNavbar />
			{alert.show && (
				<Alert
					variant={alert.variant}
					style={{
						marginTop: "50px",
						position: "fixed",
						zIndex: 9999,
						top: 0,
						right: 0,
						left: 0,
					}}
					onClose={() => setAlert({ ...alert, show: false })}
					dismissible
				>
					{alert.message}
				</Alert>
			)}
			<div style={{ marginTop: "100px", backgroundColor: "#e1efff" }}>
				<DashboardTabs studyPlan={studyPlan} activeButton={activeButton} />
			</div>
			<Container style={{ backgroundColor: "white" }}>
				<Form>
					<label htmlFor="flavors">Select topics</label>
					<Select
						isMulti
						name="flavors"
						options={options}
						className="basic-multi-select"
						classNamePrefix="select"
						onChange={handleChange}
						value={selectedOption}
					/>

					{/* Select Number of Questions */}
					<Form.Group controlId="formNumQuestions">
						<Form.Label>Number of Questions</Form.Label>
						<Form.Control as="select" onChange={(e) => setNumQuestions(e.target.value)}>
							<option value="5">5 questions</option>
							<option value="10">10 questions</option>
							<option value="15">15 questions</option>
							<option value="20">20 questions</option>
						</Form.Control>
					</Form.Group>

					{/* Select Quiz Type */}
					<Form.Group controlId="formQuizType">
						<Form.Label>Quiz Type</Form.Label>
						<Form.Control as="select" onChange={(e) => setQuizType(e.target.value)}>
							<option value="MCQ">MCQ</option>
							<option value="ShortQ">Short Q/A</option>
						</Form.Control>
					</Form.Group>

					{/* Submit button */}
					<Button variant="primary" onClick={handleSubmit}>
						Generate Quiz
					</Button>
				</Form>
			</Container>

			<footer className="bg-light text-lg-start" style={{ marginTop: "100px" }}>
				<Footer />
			</footer>
		</>
	);
};

export default StylishTabs;

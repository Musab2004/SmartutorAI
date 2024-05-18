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
import axios from 'axios';
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
import { TimePicker } from "react-ios-time-picker";
import LoaderScreen from '../HomePage/LoaderScreen';
const StylishTabs = () => {
	const navigate = useNavigate();
	const { userData } = useContext(UserContext);
	const [activeButton, setActiveButton] = useState("tab2");
	const [loading, setLoading] = useState(false);
	const [alert, setAlert] = useState({ show: false, variant: "", message: "" });
	const location = useLocation();
	const studyPlan = location.state?.studyPlan;
	const book_id = studyPlan.books[0];
	console.log(studyPlan);

	if (!studyPlan) {
		navigate("/homepage");
	}
	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			console.log("token does'nt exit : ", localStorage);

			navigate("/");
		}
	}, []);


	const handleClick = (tab, path) => {
		setActiveButton(tab);
		navigate(path, {
			state: {
				studyPlan,
			},
		});
	};


	const [numQuestions, setNumQuestions] = useState("");
	const [quizType, setQuizType] = useState("");
	
	useEffect(() => {
	
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
	const fetchTopic = async (pk) => {
		try {
		  const response = await userService.get(`api/topics/${pk}/`);
		  return response.data;
		} catch (error) {
		  console.error("Error:", error);
		  return error;
		}
	  };

	  const startQuiz = async (topics) => {
		let numQuestions=10;
		// let quizType="MCQ";
		
		
		setLoading(true);
		console.log("quizType : ", quizType);
		if (quizType === 'MCQ') {
		  // numQuestions = 5;
		
		axios.post('https://ed6e-104-196-240-91.ngrok-free.app/generate-questions/', {
			topics: topics
		}).then(response => {
			const r=response.data;
			console.log(response.data);
			navigate("/singlequiz", {state:{quizes:response.data, numQuestions, quizType,is_mcq:true}});	
		}).catch(error => {
			console.error('Error:', error);
			setLoading(false);
		});
		}
		else{
		  
		  axios.post('https://9a1e-34-143-169-220.ngrok-free.app/generate-questions/', {
			topics: topics
		}).then(response => {
			const r=response.data;
			console.log(response.data);
			navigate("/singlequiz", {state:{quizes:response.data, numQuestions, quizType,is_mcq:false,studyPlan}});	
		}).catch(error => {
			console.error('Error:', error);
			setLoading(false);
		});
		
		
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
		{!loading && (
    <>
        <div style={{ marginTop: "100px", backgroundColor: "#e1efff" }}>
            <DashboardTabs studyPlan={studyPlan} activeButton={activeButton} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
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
                    <Form.Group controlId="formNumQuestions">
                        <Form.Label>Number of Questions</Form.Label>
                        <Form.Control as="select" onChange={(e) => setNumQuestions(e.target.value)}>
                            <option value="5">5 questions</option>
                            <option value="10">10 questions</option>
                            <option value="15">15 questions</option>
                            <option value="20">20 questions</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="formQuizType">
                        <Form.Label>Quiz Type</Form.Label>
                        <Form.Control as="select" onChange={(e) => setQuizType(e.target.value)}>
                            <option value="MCQ">MCQ</option>
							<option value="MCQ">MCQ</option>
                            <option value="ShortQA">Short Q/A</option>
                        </Form.Control>
                    </Form.Group>
                    <Button variant="primary" onClick={GenerateQuiz} >
                        Generate Quiz
                    </Button>
                </Form>
            </Container>
        </div>
    </>
// ) : (
//     <LoaderScreen />
)};
</>
	);
};

export default StylishTabs;

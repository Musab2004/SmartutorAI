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
import { TimePicker } from "react-ios-time-picker";
import axios from 'axios';
const StylishTabs = () => {
	const navigate = useNavigate();
	const { userData } = useContext(UserContext);
	const [activeButton, setActiveButton] = useState("tab2");
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



	
	useEffect(() => {
	
		fetchTopics();
	}, []);

	const [topics, settopics] = useState();
	const fetchTopic = async (pk) => {
		try {
		  const response = await userService.get(`api/topics/${pk}/`);
		  return response.data;
		} catch (error) {
		  console.error("Error:", error);
		  return error;
		}
	  };

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
	const [generatedSummary, setGeneratedSummary] = useState([]);
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
	const GenerateSummary = async () => {
		console.log("Topics", selectedOption);
	  
		const summaries = await Promise.all(
			selectedOption.map(option =>
			  fetchTopic(option.value).then(response => ({
				title: option.label,
				summary: response.content,  // replace 'summary' with the actual key in the response
			  }))
			)
		  );
		  
		  const input = [
			{
			  role: 'system',
			  content: 'You are a helpful assistant.'
			},
			...summaries.map(summary => ({
			  role: 'user',
			  content: `Please summarize the following content in simple words using heading and bulltet points like explaining to kid (give response in html): ${summary.title} - ${summary.summary}`
			}))
		  ];
		  
		  const response = await axios.post(
			'https://api.openai.com/v1/chat/completions',
			{
			  model: 'gpt-4-turbo',
			  messages: input,
			  temperature: 0.7,  // Optional: Adjust the temperature for more or less creative summaries
			},
			{
			  headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer sk-proj-pkbGUWeUuBRgLDoIrVvzT3BlbkFJ7SgsqhvSbuhJkIxjQZf8`,
			  },
			}
		  );
		// console.log(response.data.choices[0].message.content);  
		setGeneratedSummary(response.data.choices[0].message.content);
		// console.log(summaries);
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
			<div style={{ marginTop: "100px", backgroundColor: "#e1efff" }}>
				<DashboardTabs studyPlan={studyPlan} activeButton={activeButton} />
			</div>
			<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
    <div>
			<Container style={{ backgroundColor: "white",height:'500px',width: '500px' }}>
				<Form>
				<div style={{ justifyContent: 'center', alignItems: 'center', }}>
					<label htmlFor="flavors" style={{marginTop:'200px'}}>Select topics</label>
					<Select
						isMulti
						name="flavors"
						options={options}
						className="basic-multi-select"
						classNamePrefix="select"
						onChange={handleChange}
						value={selectedOption}
					/>
					<br/>					
					<Button variant="primary" onClick={GenerateSummary} >
						Generate Summary
					</Button>
					</div>
				</Form>
			</Container>
			</div>
			<div>
			<Container style={{ backgroundColor: "white", height: '500px', width: '500px', border: '2px solid gray' }}>
			<div style={{ overflow: 'auto', height: '400px' }}>
		  <div dangerouslySetInnerHTML={{ __html: generatedSummary }} />
    
    </div>
			{/* <textarea class="form-control" id="exampleFormControlTextarea1" rows="20" readOnly style={{ width: '400px' }}></textarea> */}
			</Container>

			</div>
			</div>
		
		</>
	);
};

export default StylishTabs;

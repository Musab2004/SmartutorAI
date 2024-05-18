import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Tabs, Tab, Button, Row, Col, Modal, Container, Alert, ButtonGroup } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "./sidebar";
import DashBoardNavbar from "./DashBoardNavbar";
import DisscusionForum from "./DisscusionForum";
import ResourcePreview from "./ResourcePreview";
import { UserContext } from "../landing_page_component/UserContext";
import userService from "../landing_page_component/UserSerive";
import StudyPlanSettings from "./StudyPlanSettings";
import Footer from "../landing_page_component/footer";
import DashboardTabs from "./Dashbaord_tabs";
// import { Link,useNavigate } from 'react-router-dom';
import { Editor } from "@tinymce/tinymce-react";
import Dashboard from "../DashBoard";
import Weekicon from "./week-icon.png";
import axios from "axios";
const StylishTabs = () => {


	const navigate = useNavigate();
	const { userData } = useContext(UserContext);
	const [activeButton, setActiveButton] = useState("tab1");
	const [key, setKey] = useState("tab1");
	const [alert, setAlert] = useState({ show: false, variant: "", message: "" });
	const [posts, setPosts] = useState([]);
	const [bookData, setbookData] = useState([]);
	var [Data, setData] = useState([]);
	const [visiblePosts, setVisiblePosts] = useState(4);
	const location = useLocation();
	const [showModal, setShowModal] = useState(false);
	const [postInput, setPostInput] = useState("");
	const [textAreaValue, setTextAreaValue] = useState("");
	console.log(location.state);
	const studyPlan = location.state?.studyPlan;
    Data = location.state?.data;
    console.log(Data)
 
	

	//   useEffect(() => {
	// 	if (!studyPlan) {
	// 		console.log("no studyplan here");
	// 		navigate("/");
	// 	}
	// }, []);
	console.log(studyPlan)
	const plan = studyPlan;
	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			console.log("token does'nt exit : ", localStorage);
			navigate("/");
		}
	}, []);
	const fetchWeeklyGoals = async () => {
		try {
		  const response = await userService.get('api/getweeklygoals/', {
			params: {
			  studyplan_id: plan.id,
			  user_id: userData.id,
			},
		  });
	
		  setData(response.data.response);
		//   setIs_covered(response.data.all_complete);
		  console.log(response.data.response)
		} catch (error) {
		  console.error('Error:', error);
		}
	  };
	// fetchWeeklyGoals();
	  useEffect(() => {
		fetchWeeklyGoals();
	  }, [plan,userData]);


	const fetchBook = async () => {
		try {
			const response = await userService.get(`/api/books/${studyPlan.books}/`);
			setbookData(response.data);
		} catch (error) {
			console.error("Failed to fetch posts", error);
		}
	};

	useEffect(() => {
		if (studyPlan) {
			fetchBook();
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
			content: textAreaValue,
			author: userData.id,
			study_plan: studyPlan.id,
		};

		try {
			const response = await userService.post("/api/queryposts/", postData);
			console.log("Response:", response.data);
			console.log("Response:", response.data);
			handleModalClose();
			setAlert({ show: true, variant: "success", message: "Post submitted successfully!" });
		} catch (error) {
			console.error("Error:", error);
			handleModalClose();
			setAlert({ show: true, variant: "danger", message: "Error submitting post!" });
		}
	};

	const postsPerPage = 4;

	const handleLoadMore = () => {
		setVisiblePosts(visiblePosts + postsPerPage);
	};

	const [content, setContent] = useState("");

	const handleEditorChange = (content) => {
		setPostInput(content);
	};

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
	const [showChat, setShowChat] = useState(false);
	const [messages, setMessages] = useState([]);

	const sendMessage = async (text) => {

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
			<div style={{ marginTop: "100px" }}>
				<DashboardTabs studyPlan={studyPlan} activeButton={activeButton} />
				<Sidebar studyPlan={studyPlan} data={Data} />
			</div>

			<div className="App" style={{minHeight:'400px'}}>
				{showChat && (
					<div
						style={{
							position: "fixed",
							bottom: "10px",
							right: "10px",
							width: "300px",
							height: "400px",
							backgroundColor: "white",
							border: "1px solid black",
							borderRadius: "10px",
							padding: "10px",
							boxSizing: "border-box",
							overflow: "hidden",
						}}
					>
						<div style={{ marginBottom: "10px", textAlign: "right" }}>
							<button onClick={() => setShowChat(false)}>Close</button>
						</div>
						<div style={{ overflowY: "scroll", height: "300px" }}>
							{messages.map((msg) => (
								<div key={msg.id} style={{ textAlign: msg.sender === "user" ? "right" : "left" }}>
									{msg.text}
								</div>
							))}
						</div>
						<input
							type="text"
							onKeyDown={(e) => {
								if (e.key === "Enter" && e.target.value.trim()) {
									sendMessage(e.target.value);
									e.target.value = "";
								}
							}}
							placeholder="Type your message..."
							style={{ width: "100%", boxSizing: "border-box" }}
						/>
					</div>
				)}
			</div>
			{!showChat && (
				<Button
					onClick={() => setShowChat(true)}
					style={{
						position: "fixed",
						backgroundColor: "white",
						color: "black",
						bottom: "20px",
						right: "20px",
						fontSize: "16px",
					}}
				>
					<img src={Weekicon} style={{ width: "45px", height: "auto" }} />
					Chat with GPT
				</Button>
			)}
				<footer className="bg-light text-lg-start" style={{ marginLeft:'4%',width: 'auto' }}>
  <Footer />
</footer>

		</>
	);
};

export default StylishTabs;

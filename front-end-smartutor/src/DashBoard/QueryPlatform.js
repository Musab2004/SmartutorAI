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
import LoadingScreen from "../HomePage/LoaderScreen";
import Footer from "../landing_page_component/footer";
import DashboardTabs from "./Dashbaord_tabs";
import AllPosts from "./AllPosts";
// import { Link,useNavigate } from 'react-router-dom';
import { Editor } from "@tinymce/tinymce-react";
const StylishTabs = () => {
	const navigate = useNavigate();
	const { userData } = useContext(UserContext);
	const [key, setKey] = useState("tab4");
	const [isLoading, setIsLoading] = useState(false);
	const [activeButton, setActiveButton] = useState("tab4");
	// const [alertPost, setAlertPost] = useState({show: false, variant: '', message: ''});
	const [alert, setAlert] = useState({ show: false, variant: "", message: "" });

	const [posts, setPosts] = useState([]);
	const [bookData, setbookData] = useState([]);

	const [visiblePosts, setVisiblePosts] = useState(4); // Number of posts to display initially
	// console.log(userData)
	const location = useLocation();

	const studyPlan = location.state?.studyPlan;
	const plan = studyPlan;
	console.log(studyPlan);
	if (!studyPlan) {
		navigate("/homepage"); // Replace '/homepage' with your homepage route
	}

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			console.log("token does'nt exit : ", localStorage);
			// Redirect to landing page if token doesn't exist

			navigate("/");
		} else {
		}
	}, []);

	const fetchPosts = async () => {
		// setIsLoading(true);
		try {
			const response = await userService.get(`/api/queryposts/?study_plan_id=${studyPlan.id}`);
			console.log(response.data);
			setPosts(response.data);
		} catch (error) {
			console.error("Failed to fetch posts", error);
			// navigate('/homepage');
		}
		// setIsLoading(false);
	};

	useEffect(() => {
		fetchPosts(); // This will run only once, when the component mounts
	}, []);

	const fetchBook = async () => {
		try {
			const response = await userService.get(`/api/books/${studyPlan.books}/`);
			// console.log(response.data);
			setbookData(response.data);
		} catch (error) {
			console.error("Failed to fetch posts", error);
			// navigate('/landingpage');
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
			content: textAreaValue,
			author: userData.id,
			study_plan: studyPlan.id,
		};

		try {
			const response = await userService.post("/api/queryposts/", postData);
			// Handle success - maybe show a success message or redirect
			console.log("Response:", response.data);
			console.log("Response:", response.data);
			handleModalClose();
			fetchPosts();
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
			{/* <DashBoardNavbar /> */}
			
			{/* <DashboardTabs studyPlan={studyPlan} activeButton={activeButton} /> */}
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
			{/* <div style={{ marginTop: "100px", backgroundColor: "#e1efff" }}> */}
				<DashboardTabs studyPlan={studyPlan} activeButton={activeButton} />
			{/* </div> */}
			<div style={{ marginTop: "100px",minHeight:'400px',marginLeft:'100px' }}>
				
				<Container>
					<Row>
						<Col xs={8}>
							<h1 style={{ fontSize: "30px", color: "#1f5692",marginLeft:'120px' }}>
								Latest Question Asked
							</h1>
						</Col>
						<Col>
							<Button
								variant="primary"
								onClick={handleModalShow}
								style={{ backgroundColor: "#f66b1d", borderColor: "#f66b1d" }}
							>
								Ask a question
							</Button>
							{/* Other content related to the latest question goes here */}
						</Col>
					</Row>

					<Modal show={showModal} onHide={handleModalClose} style={{marginTop:'100px'}}>
						<Modal.Header closeButton>
							<Modal.Title>Write your post</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<textarea
								value={textAreaValue} // Set the value of the text area
								onChange={handleTextAreaChange} // Handle changes in the text area
								placeholder="Type something here..."
								rows={4}
								cols={40}
							/>
						</Modal.Body>
						<Modal.Footer>
							<Button variant="secondary" onClick={handleModalClose}>
								Close
							</Button>
							<Button variant="primary" onClick={handlePostSubmit}>
								Submit
							</Button>
						</Modal.Footer>
					</Modal>
				</Container>
			
			{posts.length === 0 ? (	<div style={{ textAlign: "center", marginTop: "50px" }}>	<h3>No posts available</h3>	</div>	) : (	<>	
					<AllPosts  posts={posts} studyPlan={studyPlan} fetchPosts={fetchPosts} />
					</>)}
					{/* studyPlan={props.studyPlan}
								fetchPostfunc={props.fetchPosts} */}
					
				
			</div>
			<footer className="bg-light text-lg-start" style={{marginTop:'10%', width: '100%' }}>
  <Footer />
</footer>
		</>
	);
};

export default StylishTabs;

import React, { useState, useContext, useRef, useEffect } from "react";
import {
	Row,
	Col,
	Card,
	Button,
	Badge,
	Modal,
	Form,
	Tabs,
	Tab,
	Container,
	Alert,
	ButtonGroup,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { UserContext } from "../landing_page_component/UserContext";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./sidebar";
import DashBoardNavbar from "./DashBoardNavbar";
import DisscusionForum from "./DisscusionForum";
import ResourcePreview from "./ResourcePreview";
import userService from "../landing_page_component/UserSerive";
import { MDBProgress, MDBProgressBar } from "mdb-react-ui-kit";
import TaskList from "./TasKlist";
// import StudyPlanSettings from './StudyPlanSettings';
import Weekicon from "./week-icon.png";
import { Editor } from "@tinymce/tinymce-react";
import Footer from "../landing_page_component/footer";
import calender from "./calendar.svg";
import members from "./members.svg";
import degre from "./degre.svg";
import book from "./book.svg";
import DashboardTabs from "./Dashbaord_tabs";

const StudyPlanSettings = () => {
	const navigate = useNavigate();
	const { userData } = useContext(UserContext);
	const [activeButton, setActiveButton] = useState("tab5");
	const [key, setKey] = useState("tab1");
	const [alert, setAlert] = useState({ show: false, variant: "", message: "" });
	const [posts, setPosts] = useState([]);
	const [bookData, setbookData] = useState([]);
	const [visiblePosts, setVisiblePosts] = useState(4);
	const [totalTopicsCovered, setTotalTopicsCovered] = useState(0);
	const [TopicsCovered, setTopicsCovered] = useState(0);
	let percentage = 0;
	const location = useLocation();
	const [data, setData] = useState([]);
	const studyPlan = location.state?.studyPlan;
	const plan = studyPlan;
	const baseURL = "http://127.0.0.1:8000";
	let total = 0;
	let topics_covered = 0;

	const CalcuateTotal_Work_Done = () => {
		if (data) {
			console.log("we here : ", data.response);
		}
		if (data) {
			console.log("hehe : ", data.response);
			let array = data.response;
			console.log("Key:", array);

			if (Array.isArray(array)) {
				console.log("data is an array");
				array.forEach((item) => {
					total += item.chapters.length;
					topics_covered += item.weekly_goals.topics_covered.length;
				});
				console.log("we here : ", total, topics_covered);
				percentage = (topics_covered / total) * 100;
			} else {
				console.error("data is not an array");
				for (let i = 0; i < 3; i++) {
					let array = data.response;
					console.log("Key:", array);
				}
			}
		}
	};

	const fetchWeeklyGoals = async () => {
		if (!userData) {
			console.log("User data is not available");
			return;
		}
		try {
			const response = await userService.get("api/getweeklygoals/", {
				params: {
					studyplan_id: studyPlan.id,
					user_id: userData.pk,
				},
			});
			setData(response.data);
		} catch (error) {
			console.error("Error:", error);
		}
	};

	useEffect(() => {
		fetchWeeklyGoals();
	}, [studyPlan.id, userData]);

	CalcuateTotal_Work_Done();
	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			console.log("token does'nt exit : ", localStorage);

			navigate("/");
		} else {
		}
	}, []);

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				const response = await userService.get(`/api/queryposts/?study_plan_id=${studyPlan.id}`);
				// console.log(response.data);
				setPosts(response.data);
			} catch (error) {
				console.error("Failed to fetch posts", error);
				navigate("/homepage");
			}
		};

		const interval = setInterval(fetchPosts, 3000);
		return () => clearInterval(interval);
	}, []);

	const handleClick = (tab, path) => {
		setActiveButton(tab);
		navigate(path, {
			state: {
				studyPlan,
			},
		});
	};

	const deleteStudyPlan = async () => {
		try {
			const response = await userService.delete(`/api/studyplans/${studyPlan.id}`);
			console.log(response.data);
			navigate("/my-courses");
			// handle the response as needed
		} catch (error) {
			console.error("Failed to delete study plan", error);
		}
	};

	const LeaveStudyPlan = async () => {
		try {
			const response = await userService.get("api/leavestudyplan/", {
				params: {
					studyplan_id: studyPlan.id,
					user_id: userData.pk,
				},
			});
			console.log(response.data);
			navigate("/my-courses");
		} catch (error) {
			console.error("Error:", error);
		}
	};

	const completeStudyPlan = async () => {
		try {
			const response = await userService.get("api/completestudyplan/", {
				params: {
					studyplan_id: studyPlan.id,
					user_id: userData.pk,
				},
			});
			console.log(response.data);
			navigate("/my-courses");
		} catch (error) {
			console.error("Error:", error);
		}
	};
	const [showModal, setShowModal] = useState(false);
	const [showLeaveModal, setShowLeaveModal] = useState(false);

	const handleDelete = () => {
		setShowModal(true);
	};
	const handleLeave = () => {
		setShowLeaveModal(true);
	};
	const confirmLeave = async () => {
		setShowModal(false);
		await LeaveStudyPlan();
	};
	const confirmDelete = async () => {
		setShowModal(false);
		await deleteStudyPlan();
	};
	const handleLeaveClose = () => {
		setShowLeaveModal(false);
	};
	const handleClose = () => {
		setShowModal(false);
	};
	let members = studyPlan.members.length;

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
			</div>

			<div>
				<div style={{ marginLeft: "15%" }}>
					<h2 style={{ fontSize: "24px", fontStyle: "italic", color: "#1f5692" }}>
						Current Progress
					</h2>
					<Card className="user-card-full" style={{ width: "90%" }}>
						<Card.Body>
							<Card.Title>Your progress</Card.Title>
							<MDBProgress height="20">
								<MDBProgressBar
									width={percentage}
									valuemin={0}
									valuemax={100}
									style={{ backgroundColor: "#f66b1d", color: "white" }}
									bgColor="#1f5692"
								>
									{percentage}%
								</MDBProgressBar>
							</MDBProgress>
							<h>Keep Going you are not there yet.....</h>
							<br />
							<br />

							<div>
								<h2 style={{ fontSize: "24px", fontStyle: "italic" }}>Weekly feedback</h2>
								<TaskList tasks={data} />
							</div>
							<div className="d-flex justify-content-end" style={{ marginTop: "5%" }}>
								<p>Wanna Change the pace of your studyplan? Click here to </p>
								<a variant="primary" style={{ color: "#f66b1d", textDecoration: "underline" }}>
									{" "}
									Reset Study Plan
								</a>
							</div>
						</Card.Body>
					</Card>
				</div>
				<div style={{ marginTop: "10%", marginLeft: "15%" }}>
					<h2 style={{ fontSize: "24px", fontStyle: "italic", color: "#1f5692" }}>
						StudyPlan Details
					</h2>
					<Card className="user-card-full" style={{ width: "90%", marginBottom: "5%" }}>
						<Card.Body>
							<Row>
								<Col md={4}>
									<Card.Img
										variant="top"
										src={plan.image}
										style={{ width: "300px", height: "300px" }}
									/>
								</Col>

								<Col style={{ marginTop: "3%" }}>
									<p></p>
									<div style={{ textAlign: "left", marginRight: "0%" }}>
										<h2 style={{ fontSize: "24px", fontStyle: "italic", color: "#f66b1d" }}>
											Study Plans Details
										</h2>
									</div>
									<Row>
										<Col>
											<div style={{ display: "flex" }}>
												<Card.Img
													variant="top"
													src={calender}
													style={{ width: "30px", height: "30px" }}
												/>
												<p style={{ marginLeft: "5px" }}> Members : {members}</p>
											</div>
										</Col>
										<Col>
											<div style={{ display: "flex" }}>
												<Card.Img
													variant="top"
													src={calender}
													style={{ width: "30px", height: "30px" }}
												/>
												<p style={{ marginLeft: "5px" }}> Number of weeks : 4</p>
											</div>
										</Col>
									</Row>
									<Row>
										<Col>
											<div style={{ display: "flex" }}>
												<Card.Img
													variant="top"
													src={degre}
													style={{ width: "30px", height: "30px" }}
												/>
												<p style={{ marginLeft: "5px" }}> Subject</p>
											</div>
										</Col>
										<Col>
											<div style={{ display: "flex" }}>
												<Card.Img
													variant="top"
													src={book}
													style={{ width: "30px", height: "30px" }}
												/>
												<p style={{ marginLeft: "5px" }}> Academic Level</p>
											</div>
										</Col>
									</Row>

									{members && members == 1 && (
										<Button
											variant="primary"
											style={{ backgroundColor: "#f66b1d", borderColor: "#f66b1d" }}
											onClick={handleDelete}
										>
											Delete Study Plan
										</Button>
									)}

									{members && members > 1 && (
										<Button
											variant="primary"
											style={{ backgroundColor: "#f66b1d", borderColor: "#f66b1d" }}
											onClick={handleLeave}
										>
											Leave Study Plan
										</Button>
									)}
									<Modal show={showModal} onHide={handleClose}>
										<Modal.Header closeButton>
											<Modal.Title>Confirm Delete</Modal.Title>
										</Modal.Header>
										<Modal.Body>Are you sure you want to delete this study plan?</Modal.Body>
										<Modal.Footer>
											<Button variant="secondary" onClick={handleClose}>
												Cancel
											</Button>
											<Button variant="primary" onClick={confirmDelete}>
												Delete
											</Button>
										</Modal.Footer>
									</Modal>
									<Modal show={showLeaveModal} onHide={handleLeaveClose}>
										<Modal.Header closeButton>
											<Modal.Title>Confirm Leave</Modal.Title>
										</Modal.Header>
										<Modal.Body>Are you sure you want to leave this study plan?</Modal.Body>
										<Modal.Footer>
											<Button variant="secondary" onClick={handleLeaveClose}>
												Cancel
											</Button>
											<Button variant="primary" onClick={LeaveStudyPlan}>
												Leave Study Plan
											</Button>
										</Modal.Footer>
									</Modal>
									<Button
										variant="primary"
										style={{ backgroundColor: "#f66b1d", borderColor: "#f66b1d" }}
										onClick={completeStudyPlan}
									>
										Completed StudyPlan
									</Button>
								</Col>
							</Row>
						</Card.Body>
					</Card>
				</div>
			</div>
			<footer className="bg-light text-lg-start" style={{ marginTop: "100px" }}>
				<Footer />
			</footer>
		</>
	);
};

export default StudyPlanSettings;

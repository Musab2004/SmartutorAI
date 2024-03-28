import React, { useState, useContext, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Container, Collapse } from "react-bootstrap";
import userService from "../landing_page_component/UserSerive";
import { UserContext } from "../landing_page_component/UserContext";
import { useLocation, useNavigate } from "react-router-dom";
// import Loader
import LoaderScreen from "../HomePage/LoaderScreen";
// import CircularProgress from '@mui/material/CircularProgress';
// const TopicContent = ({ topic,weekly_goal_id,fetchWeeklyGoals }) => {
//   const [isCovered, setIsCovered] = useState(false);
//   const markAsCompleted = async () => {

//     const response = await userService.get('api/weeklygoaltopiccovered/',{
//       params: {
//         weeklygoal_id: weekly_goal_id,
//         topic_id: topic.topics.id,

//       }
//     });
//     setIsCovered(true);
//     await fetchWeeklyGoals();
//     }

//   return (

//   );
// };

const Sidebar = ({ studyPlan_id, data }) => {
	const navigate = useNavigate();
	var [data, setData] = useState(null);
	const { userData } = useContext(UserContext);
	const [selectedTopic, setSelectedTopic] = useState(null);
	const [openDropdown, setOpenDropdown] = useState(null);
	const [selectedWeeklyGoalId, setSelectedWeeklyGoalId] = useState(null);
	const [is_covered, setIs_covered] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [isCovered, setIsCovered] = useState(false);
	// data=data
	console.log(data);
	const markAsCompleted = async (topic_id, weekly_goal_id) => {
		const response = await userService.get("api/weeklygoaltopiccovered/", {
			params: {
				weeklygoal_id: weekly_goal_id,
				topic_id: topic_id,
			},
		});
		setIsCovered(true);
		console.log("after marking as completed");
		fetchWeeklyGoals();
		handleTopicClick(response.data, weekly_goal_id);
	};

	const fetchWeeklyGoals = async () => {
		try {
			const response = await userService.get("api/getweeklygoals/", {
				params: {
					studyplan_id: studyPlan_id,
					user_id: userData.pk,
				},
			});
			setData(response.data.response);
			setIs_covered(response.data.all_complete);
			console.log(response.data.response);
		} catch (error) {
			console.error("Error:", error);
		}
	};

	useEffect(() => {
		fetchWeeklyGoals();
	}, [studyPlan_id, userData]);

	const handleTopicClick = (topic, weekly_goal_id) => {
		setSelectedTopic(topic);
		setSelectedWeeklyGoalId(weekly_goal_id);
	};

	const handleDropdownToggle = (index) => {
		setOpenDropdown(openDropdown === index ? null : index);
	};
	const handleCloseCourse = () => {
		// Your code to close the course goes here...
		console.log("Course closed");

		// Close the modal after closing the course
		setShowModal(false);
		navigate("/my-courses");
	};

	return (
		<>
			<link
				rel="stylesheet"
				href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.17.0/font/bootstrap-icons.css"
				integrity="sha384-HZ4soYF2Z8ERi0Vr40S+LCTlkKf8Abf4MZPA+1SiGHkADho0W97lcvoKviyXlV1/W"
				crossorigin="anonymous"
			/>
			<Modal show={showModal} onHide={() => setShowModal(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Congratulations!</Modal.Title>
				</Modal.Header>
				<Modal.Body>You have completed your study plan!</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => setShowModal(false)}>
						Close
					</Button>
					<Button variant="primary" onClick={handleCloseCourse}>
						Close Course
					</Button>
				</Modal.Footer>
			</Modal>

			{data ? (
				<div className="container" style={{ marginLeft: "20%", width: "70%" }}>
					<div className="row no-gutters">
						<nav className="col-md-5 bg-light sidebar" style={{ width: "250px" }}>
							<div className="sidebar-sticky">
								{data ? (
									data.map((week, index) => (
										<div key={week.id} className="nav-item">
											<h6
												className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted"
												style={{ cursor: "pointer" }}
											>
												<span>
													<i className={`fas fa-calendar-week me-2`} />
													Week {week.weekly_goals.order}
												</span>
												<span
													className="fas fa-chevron-down"
													onClick={() => handleDropdownToggle(index)}
												/>
											</h6>

											<Collapse in={openDropdown === index}>
												<ul
													style={{
														maxHeight: "500px",
														backgroundColor: "white",
														overflowY: "auto",
													}}
												>
													{week.chapters.map((topic) => (
														<div
															className="nav-link"
															onClick={() => handleTopicClick(topic, week.weekly_goals.id)}
															style={{ cursor: "pointer" }}
														>
															{topic.is_covered && (
																<i
																	class="fa fa-check"
																	style={{ color: "blue" }}
																	aria-hidden="true"
																></i>
															)}
															{topic.topics.title}
														</div>
													))}
												</ul>
											</Collapse>
										</div>
									))
								) : (
									<p>No data available.</p>
								)}
							</div>
						</nav>
						<div role="main" className="col-md-1">
							{
								selectedTopic && (
									<>
										<Container style={{ width: "600px", backgroundColor: "white" }}>
											<div
												style={{
													maxHeight: "500px",
													backgroundColor: "white",
													overflowY: "auto",
													padding: "40px",
												}}
											>
												<h style={{ fontSize: "2em", fontWeight: "bold" }}>
													{selectedTopic.topics.title}
												</h>
												<p style={{}}>{selectedTopic.topics.content}</p>
											</div>
											<Button
												style={{ marginLeft: "200px", marginTop: "20px" }}
												disabled={selectedTopic.is_covered}
												onClick={() =>
													markAsCompleted(selectedTopic.topics.id, selectedWeeklyGoalId)
												}
											>
												{selectedTopic.is_covered ? "Already Completed" : "Mark as Completed"}
											</Button>
										</Container>
									</>
								)
								// <TopicContent topic={selectedTopic} weekly_goal_id={selectedWeeklyGoalId} fetchWeeklyGoals={fetchWeeklyGoals}/>}
							}
						</div>
					</div>
				</div>
			) : (
				<LoaderScreen />
			)}
		</>
	);
};

export default Sidebar;

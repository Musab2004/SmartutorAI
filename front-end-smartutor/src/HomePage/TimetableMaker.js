import React, { useState, useContext, useEffect } from "react";
// import { Form, Button } from 'react-bootstrap';
import Navbar from "./HomePageNavbar";
import axios, { all } from "axios";
import userService from "../landing_page_component/UserSerive";
import { UserContext } from "../landing_page_component/UserContext";
import background_image from "./background_image.jpg";
import styled from "styled-components";
import LoadingScreen from "./LoaderScreen";
import { Link, useNavigate } from "react-router-dom";
import ResourcePreview from "../DashBoard/ResourcePreview";
import { useLocation } from "react-router-dom";
import TimeTableFinal from "./TimeTableFinal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// Inside your component
import "./TimeTable.css";

import { Form, Tabs, Tab, Button, Card, Row, Col, Modal, Container } from "react-bootstrap";
// Bootstrap Icons

function ChapterList({ chapters, fetchBook }) {
	const [expandedChapters, setExpandedChapters] = useState({});
	const deleteChapter = (chapterId) => {
		userService
			.delete(`/api/chapters/${chapterId}`)
			.then((response) => {
				// Remove the deleted post from the UI
				// setPosts(posts.filter(post => post.id !== postId));
				console.log(`Deleted post ${chapterId}`);
				fetchBook();
			})
			.catch((error) => {
				console.error(`Error deleting Chapter ${chapterId}:`, error);
			});
		// Add logic to remove chapter from course planner
	};

	const deleteTopic = (topicId) => {
		userService
			.delete(`/api/topics/${topicId}`)
			.then((response) => {
				// Remove the deleted post from the UI
				// setPosts(posts.filter(post => post.id !== postId));
				console.log(`Deleted post ${topicId}`);
				fetchBook();
			})
			.catch((error) => {
				console.error(`Error deleting post ${topicId}:`, error);
			});
		// Add logic to remove topic from course planner
	};
	const toggleTopics = (chapterId) => {
		setExpandedChapters((prevState) => ({
			...prevState,
			[chapterId]: !prevState[chapterId],
		}));
	};

	return (
		<div style={{ textAlign: "center" }}>
			<div style={{ marginTop: "30px" }}>
				<h style={{ color: "#f66b1d", fontSize: "24px", fontWeight: "bold" }}>
					Remove Any Topics if you{" "}
				</h>
			</div>
			<div style={{ maxHeight: "400px", width: "100%", overflowY: "auto", marginTop: "5%" }}>
				<ul>
					{chapters.map((chapter) => (
						<p key={chapter.chapter_id}>
							<Card style={{ width: "100%" }}>
								<Card.Body>
									<div style={{ display: "flex" }}>
										<Card.Title style={{ color: "#1f5692" }}>{chapter.chapter_name}</Card.Title>
										<Button
											variant="contained"
											onClick={() => toggleTopics(chapter.chapter_id)}
											style={{
												fontWeight: "bold",
												backgroundColor: "None",
												borderColor: "white",
												marginLeft: "10px",
												height: "40px",
												width: "40px",
											}}
										>
											<i class="fa-solid fa-caret-down" style={{ color: "#1f5692" }}></i>
										</Button>
										<Button
											variant="contained"
											onClick={() => deleteChapter(chapter.chapter_id)}
											style={{
												fontWeight: "bold",
												marginLeft: "10px",
												backgroundColor: "None",
												height: "40px",
												width: "40px",
											}}
										>
											<i class="fa fa-trash" style={{ color: "red" }} aria-hidden="true"></i>
										</Button>
									</div>
								</Card.Body>
							</Card>

							{expandedChapters[chapter.chapter_id] && (
								<ul>
									{chapter.topics.map((topic) => (
										<>
											<div style={{ display: "flex" }}>
												<h>{topic.title}</h>

												<Button
													variant="contained"
													onClick={() => deleteTopic(topic.topic_id)}
													style={{
														fontWeight: "bold",
														borderColor: "black",
														marginLeft: "10px",
														height: "40px",
														width: "40px",
													}}
												>
													<i class="fa fa-trash" aria-hidden="true"></i>
												</Button>
											</div>
										</>
									))}
								</ul>
							)}
						</p>
					))}
				</ul>
			</div>
		</div>
	);
}
const Sidebar = () => {
	const { userData } = useContext(UserContext);
	const [activeTab, setActiveTab] = useState("createstudyplan");
	const navigate = useNavigate();
	let location = useLocation();
	let books = location.state.books;

	// let searchParams = new URLSearchParams(location.search);
	// let id = searchParams.get('id');

	const [WeeklyTopic, setWeeklyTopic] = useState([]);
	// const response=props.value.bookdata
	// console.log(response)
	const [bookData, setbookData] = useState([]);
	const [bookChapters, setBookChapters] = useState([]);
	const fetchBook = async () => {
		try {
			const response = await userService.get(`/api/books/${books.books}/`);
			console.log(response.data);
			setbookData(response.data);
		} catch (error) {
			console.error("Failed to fetch posts", error);
			// navigate('/');
		}
	};

	useEffect(() => {
		fetchBook();
	}, []); // This will run only once, when the component mounts

	const chapters_data = bookData.chapters_details;
	// console.log(chapters_data)

	const [selectedTopic, setSelectedTopic] = useState(null);
	const [step2, setstep2] = useState(false);
	const [step1, setstep1] = useState(true);
	const handleChapterClick = (chapterId) => {
		const updatedChapters = bookChapters.map((chapter) => {
			if (chapter.id === chapterId) {
				return { ...chapter, isOpen: !chapter.isOpen };
			} else {
				return { ...chapter, isOpen: false };
			}
		});
		setBookChapters(updatedChapters);
		setSelectedTopic(null); // Reset selected topic when a chapter is clicked
	};

	const handleTopicClick = (topic) => {
		setSelectedTopic(topic);
	};
	// console.log(bookData.chapters_details.length)
	// console.log(Math.ceil(bookData.chapters_details.length / books.duration))

	const NextStep = async () => {
		var all_topics = [];
		for (let i = 0; i < bookData.chapters_details.length; i++) {
			for (let j = 0; j < bookData.chapters_details[i].topics.length; j++) {
				// console.log("topics data : ",bookData.chapters_details[i].topics[j])
				all_topics.push(bookData.chapters_details[i].topics[j]);
			}
		}
		console.log(all_topics);
		const postData = new FormData();
		const WeeklyTopics = [];
		const topicsPerWeek = Math.ceil(all_topics.length / books.duration);

		setstep1(false);
		// console.log()
		setstep2(true);

		let weekNo = 1;

		for (let i = 0; i < all_topics.length; i += topicsPerWeek) {
			const topics = [];
			const topics_id = [];

			for (let j = i; j < i + topicsPerWeek && j < all_topics.length; j++) {
				topics.push(all_topics[j]);
				topics_id.push(all_topics[j].topic_id);
			}
			// console.log(topics_id)
			WeeklyTopics.push({ week: weekNo, topics });
			postData.append("order", weekNo);
			postData.append("studyplan_id", books.id);
			postData.append("chapters_id", topics_id);
			postData.append("start_date", startDate);
			postData.append("user", userData.pk);
			postData.append("owner", true);
			weekNo++;

			const response = await userService.post("/api/weeklygoals/", postData);
			// console.log(response.data);
			// setbookData(response.data);

			navigate("/finalstep", { state: { books: books } });
		}

		setWeeklyTopic(WeeklyTopics);
	};

	const BackStep = () => {
		setstep2(false);
		setstep1(true);
	};
	const [startDate, setStartDate] = useState(new Date());
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
			<Navbar activeTab={activeTab} />
			<Container style={{ backgroundColor: "#e1efff", alignItems: "center", borderRadius: "10px" }}>
				<div style={{ display: "flex", marginTop: "5%" }}>
					<div
						className="container-fluid"
						style={{
							marginTop: "50px",
							marginBottom: "5%",
							alignItems: "Center",
							backgroundColor: "#f8f9fa",
						}}
					>
						{chapters_data && <ChapterList chapters={chapters_data} fetchBook={fetchBook} />}

						<section style={{ marginLeft: "40%" }}>
							<br />
							<br />
							<h style={{ color: "#f66b1d", fontSize: "24px", fontWeight: "bold" }}>
								Select Start Date
							</h>
							<br />
							<br />
							<DatePicker
								id="startDate"
								selected={startDate}
								onChange={(date) => setStartDate(date)}
								minDate={new Date()}
							/>

							<div>
								<Button
									onClick={() => NextStep()}
									style={{
										fontWeight: "bold",
										borderColor: "#f66b1d",
										backgroundColor: "#f66b1d",
										marginTop: "30px",
										marginBottom: "30px",
										height: "50px",
										width: "150px",
									}}
								>
									To Next Step
								</Button>
							</div>
						</section>
					</div>
				</div>
			</Container>
		</>
	);
};

export default Sidebar;

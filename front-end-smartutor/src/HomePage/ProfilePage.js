import {
	Row,
	Col,
	Card,
	Button,
	Badge,
	Modal,
	Form,
	Nav,
	Dropdown,
	Container,
} from "react-bootstrap";
// import { Button, Card, } from 'react-bootstrap';
// import Navbar from './HomePageNavbar'
import React, { useState, useContext, useRef, useEffect } from "react";
import { UserContext } from "../landing_page_component/UserContext";
import Select from "react-select";
import { Bar, Cate } from "react-chartjs-2";
import InfiniteCalendar from "react-infinite-calendar";
import "react-infinite-calendar/styles.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Chart as ChartJS } from "chart.js/auto";
import { Link, useNavigate } from "react-router-dom";
import logo from "../landing_page_component/logo_smarttutor.svg";
import Navbar from "./HomePageNavbar";
import Footer from "../landing_page_component/footer";
import userService from "../landing_page_component/UserSerive";
const countries = [
	{ label: "USA", value: "USA", cities: ["New York", "Los Angeles", "Chicago"] },
	{ label: "Canada", value: "Canada", cities: ["Toronto", "Montreal", "Vancouver"] },
	// Add more countries and their cities here...
];
const UserProfile = () => {
	const [show, setShow] = useState(false);

	const handleShow = () => {
		if (userData) {
			setName(userData.name);
			setEmailAddress(userData.email_address);
			setCurrentAcademicLevel(userData.current_academic_level);
			setPassword(userData.password);
			setConfirmPassword(userData.password);
		}

		setShow(true);
	};

	const [activeTab, setActiveTab] = useState("home");

	const resetForm = () => {
		setName("");
		setEmailAddress("");
		setPassword("");
		setConfirmPassword("");
		setCurrentAcademicLevel("");
		setCity("");
		setLocation("");
		setErrors({});
		setFormValid(false);
		setSelectedCountry("");
		setIsSubmitting(false);
		setVerificationToken("");
		setSelectedCity("");
		setCitiesOptions([]);
		setReportAlert({ show: false, variant: "", message: "" });
	};
	// const handleShow = () => setShow(true);
	const [name, setName] = useState("");
	const [email_address, setEmailAddress] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [current_academic_level, setCurrentAcademicLevel] = useState("");
	const [city, setCity] = useState("");
	const [location, setLocation] = useState("");
	const [errors, setErrors] = useState({});
	const [formValid, setFormValid] = useState(false);
	const [selectedCountry, setSelectedCountry] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [verificationToken, setVerificationToken] = useState("");
	const [selectedCity, setSelectedCity] = useState("");
	const [citiesOptions, setCitiesOptions] = useState([]);
	const [reportalert, setReportAlert] = useState({ show: false, variant: "", message: "" });

	const UserUpdate = async () => {
		validateForm();
		if (formValid) {
			try {
				const formData = {
					name,
					email_address,
					password,
					confirmPassword,
					current_academic_level,
					Country: selectedCountry["value"],
					City: selectedCity["value"],
				};

				setReportAlert({ show: true, variant: "success", message: "Signup successful!" });
			} catch (error) {
				console.error("Error posting data:", error);
				setReportAlert({ show: true, variant: "danger", message: "Error in signing up!" });
			} finally {
				setIsSubmitting(false);
				handleClose();
			}
		}
	};

	// useEffect(() => {
	//   fetchUserActivity(); // This will run only once, when the component mounts
	// }, []);

	const validateForm = async (e) => {
		const errors = {};
		let isValid = true;

		if (name.trim() === "") {
			errors.name = "Name is required";
			isValid = false;
		}

		if (current_academic_level === "") {
			errors.current_academic_level = "Academic level is required";
			isValid = false;
		}
		console.log(selectedCountry["value"]);

		if (password.trim() === "") {
			errors.password = "Password is required";
			isValid = false;
		}

		if (confirmPassword.trim() === "") {
			errors.confirmPassword = "Confirm Password is required";
			isValid = false;
		} else if (password !== confirmPassword) {
			errors.confirmPassword = "Passwords do not match";
			isValid = false;
		}

		setErrors(errors);
		setFormValid(isValid);
	};

	const handleTabChange = (tab) => {
		setActiveTab(tab);
	};

	const handleSave = () => {
		handleClose();
	};

	const [oldPassword, setOldPassword] = useState("");
	const [isVerified, setIsVerified] = useState(false);
	const [useractivityData, setuseractivityData] = useState();
	// const [markedDates, setMarkedDates] = useState();
	const handleClose = () => {
		setShow(false);
		setIsVerified(false);
		setOldPassword("");
	};
	const handleOldPasswordChange = (event) => {
		setOldPassword(event.target.value);
	};

	const verifyOldPassword = () => {
		// This is a placeholder for your actual password verification logic.
		// Replace it with a call to your backend or other appropriate logic.
		console.log(oldPassword, userData.password);
		if (oldPassword === userData.password) {
			setIsVerified(true);
		} else {
			alert("Incorrect password");
		}
	};
	const handleInputChange = (event) => {
		// setUserData({ ...userData, [event.target.name]: event.target.value });
	};

	var markedDates1 = [new Date(2024, 0, 25).getTime()];
	// This is just sample data. Replace this with your actual data.
	const timeSpentLastWeek = [120, 200, 150, 220, 300, 250, 400]; // in minutes
	const chartRef = useRef(null);

	useEffect(() => {
		if (userData) {
			setName(userData.name);
		}
		return () => {
			if (chartRef.current) {
				chartRef.current.destroy();
			}
		};
	}, []);

	const data = {
		labels: ["January", "February", "March", "April", "May", "June", "July"],
		datasets: [
			{
				label: "My First dataset",
				fill: false,
				lineTension: 0.1,
				backgroundColor: "rgba(75,192,192,0.4)",
				borderColor: "rgba(75,192,192,1)",
				borderCapStyle: "butt",
				borderDash: [],
				borderDashOffset: 0.0,
				borderJoinStyle: "miter",
				pointBorderColor: "rgba(75,192,192,1)",
				pointBackgroundColor: "#fff",
				pointBorderWidth: 1,
				pointHoverRadius: 5,
				pointHoverBackgroundColor: "rgba(75,192,192,1)",
				pointHoverBorderColor: "rgba(220,220,220,1)",
				pointHoverBorderWidth: 2,
				pointRadius: 1,
				pointHitRadius: 10,
				data: [65, 59, 80, 81, 56, 55, 40],
			},
		],
	};

	const { userData } = useContext(UserContext);

	const fetchUserActivity = async () => {
		try {
			if (userData) {
				const response = await userService.get(`/api/useractivity/?user_id=${userData.pk}`);

				setuseractivityData(response.data);
				// const userActivityDates = useractivityData.map(item => new Date(item.date).getTime());

				// markedDates=userActivityDates;
				// setuseractivityData(userActivityData);

				// console.log(markedDates);
			}

			// setbookData(response.data);
		} catch (error) {
			console.error("Failed to fetch posts", error);
			// navigate('/landingpage');
		}
	};

	fetchUserActivity();
	var markedDates = [];
	var Dates = [];

	if (useractivityData) {
		Dates = useractivityData.map((item) => item.date);
		// console.log("Dates : ", Dates);
	}

	if (Dates) {
		const updatedDates = Dates.map((dateString) => {
			const date = new Date(dateString);
			date.setDate(date.getDate() - 1);
			return date.toISOString().split("T")[0];
		});
		markedDates = updatedDates.map(
			(dateString) => new Date(dateString).toISOString().split("T")[0]
		);
	}
	const dateStrings = ["2024-3-8", "2024-3-9"];
	const markedDates4 = dateStrings.map(
		(dateString) => new Date(dateString).toISOString().split("T")[0]
	);

	var baseURL = "";
	if (userData) {
		baseURL = "http://127.0.0.1:8000/media/" + userData.profile_pic;
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
			<Navbar activeTab={"none"} />
			<div className="container" style={{ marginTop: "100px", display: "flex" }}>
				{userData && (
					<Card style={{ width: "18rem", height: "50%" }}>
						<Card.Body className="text-center">
							<div className="m-b-25">
								{userData && <img src={baseURL} className="img-radius" alt="User-Profile-Image" />}
							</div>
							<h6 className="f-w-600">{userData.name} </h6>
							<p>{userData.email_address}</p>
							<p>
								{userData.City}, {userData.Country}
							</p>
							<i className="mdi mdi-square-edit-outline feather icon-edit m-t-10 f-16"></i>
							<Button
								className="m-2"
								onClick={handleShow}
								style={{ backgroundColor: "#f66b1d", borderColor: "#f66b1d" }}
							>
								Edit Profile
							</Button>
						</Card.Body>
					</Card>
				)}

				{userData && (
					<Modal show={show} onHide={handleClose}>
						<Modal.Header closeButton>
							<Modal.Title>Edit Profile</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							{/* <Form> */}
							{!isVerified && (
								<Form.Group>
									<Form.Label>Old Password</Form.Label>
									<Form.Control
										type="password"
										name="oldPassword"
										onChange={handleOldPasswordChange}
									/>
									<Button variant="primary" onClick={verifyOldPassword}>
										Verify
									</Button>
								</Form.Group>
							)}
							{isVerified && (
								<>
									<Form.Group controlId="name" className="mb-3">
										<Form.Label>Name</Form.Label>
										<Form.Control
											type="text"
											placeholder="Enter your name"
											value={name}
											onChange={(e) => setName(e.target.value)}
											disabled={isSubmitting || !!verificationToken}
										/>
									</Form.Group>

									<Form.Group controlId="current_academic_level" className="mb-3">
										<Form.Label>Current Academic Level</Form.Label>
										<Form.Control
											as="select"
											value={current_academic_level}
											onChange={(e) => setCurrentAcademicLevel(e.target.value)}
											disabled={isSubmitting || !!verificationToken}
										>
											<option value="highschool">High School</option>
											<option value="middleschool">Middle School</option>
										</Form.Control>
										{errors.current_academic_level && (
											<p style={{ color: "red" }}>{errors.current_academic_level}</p>
										)}
									</Form.Group>
									<Form.Group controlId="password" className="mb-3">
										<Form.Label>Password</Form.Label>
										<Form.Control
											type="password"
											placeholder="Password"
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											disabled={isSubmitting || !!verificationToken}
										/>
										{errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
									</Form.Group>

									<Form.Group controlId="confirmPassword" className="mb-3">
										<Form.Label>Confirm Password</Form.Label>
										<Form.Control
											type="password"
											placeholder="Confirm password"
											value={confirmPassword}
											onChange={(e) => setConfirmPassword(e.target.value)}
											disabled={isSubmitting || !!verificationToken}
										/>
										{errors.confirmPassword && (
											<p style={{ color: "red" }}>{errors.confirmPassword}</p>
										)}
									</Form.Group>
								</>
							)}

							{/* </Form> */}
						</Modal.Body>
						<Modal.Footer>
							<Button variant="secondary" onClick={handleClose}>
								Close
							</Button>
							{isVerified && (
								<Button variant="primary" onClick={UserUpdate}>
									Save Changes
								</Button>
							)}
						</Modal.Footer>
					</Modal>
				)}

				<div>
					{userData && (
						<>
							{" "}
							<div style={{ marginLeft: "15%" }}>
								{" "}
								<h1 style={{ color: "#1f5692", fontStyle: "italic", fontSize: "24px" }}>
									Recent Activity
								</h1>
								<Card className="user-card-full" style={{ width: "900px" }}>
									<Card.Body>
										<Container>
											<Row>
												<Col>
													<div style={{ marginLeft: "10%", marginTop: "5%" }}>
														<Calendar
															style={{
																borderColor: "white",
																backgroundColor: "white",
															}}
															tileContent={({ date, view }) => {
																if (
																	view === "month" &&
																	markedDates.includes(date.toISOString().split("T")[0])
																) {
																	return <Badge variant="danger">User Activity</Badge>;
																}
															}}
														/>
													</div>
												</Col>
												<Col>
													<div style={{ textAlign: "center", marginTop: "15%" }}>
														<h2 style={{ color: "#f66b1d" }}>Current Streak</h2>
														<h>no progress yet</h>
													</div>
												</Col>
											</Row>
										</Container>
									</Card.Body>
								</Card>
							</div>
						</>
					)}
					{userData && (
						<div style={{ marginLeft: "15%", marginTop: "10%" }}>
							<h1 style={{ color: "#1f5692", fontSize: "24px", fontStyle: "italic" }}>
								Account Managment
							</h1>
							<Card className="user-card-full" style={{ width: "900px", marginBottom: "5%" }}>
								<Card.Body>
									{/* <Card.Title>Connect Your Accounts</Card.Title> */}
									<div style={{ marginLeft: "20%" }}>
										<div>
											<Button
												variant="primary"
												style={{
													backgroundColor: "white",
													borderColor: "#1f5692",
													width: "70%",
													height: "60px",
													marginTop: "30px",
													color: "grey",
												}}
											>
												<i
													className="fab fa-facebook-f"
													style={{ color: "#3b5998", fontSize: "1.2em", marginRight: "5%" }}
												></i>{" "}
												Connect to Facebook
											</Button>
										</div>
										<div>
											<Button
												variant="primary"
												style={{
													backgroundColor: "white",
													borderColor: "#1f5692",
													width: "70%",
													height: "60px",
													marginTop: "10px",
													color: "grey",
												}}
											>
												<i
													className="fab fa-twitter"
													style={{ color: "#1da1f2", fontSize: "1.2em", marginRight: "5%" }}
												></i>{" "}
												Connect to Twitter
											</Button>
										</div>
										<div>
											<Button
												variant="primary"
												style={{
													backgroundColor: "white",
													borderColor: "#1f5692",
													width: "70%",
													height: "60px",
													marginTop: "10px",
													color: "grey",
												}}
											>
												<i
													className="fab fa-google"
													style={{ color: "#dd4b39", fontSize: "1.2em", marginRight: "5%" }}
												></i>{" "}
												Connect to Google
											</Button>
										</div>
										<div>
											<Button
												variant="primary"
												style={{
													backgroundColor: "white",
													borderColor: "#1f5692",
													color: "grey",
													width: "70%",
													height: "60px",
													marginTop: "10px",
												}}
											>
												<i
													className="fab fa-instagram"
													style={{ color: "#bc2a8d", fontSize: "1.2em", marginRight: "5%" }}
												></i>{" "}
												Connect to Instagram
											</Button>
										</div>
									</div>
									<div>{/* <Bar data={data} style={{height:'300px',color:'#f66b1d'}} /> */}</div>

									{/* Rest of your content */}
								</Card.Body>
							</Card>
						</div>
					)}
				</div>
			</div>
			<footer className="bg-light text-lg-start" style={{ marginTop: "100px" }}>
				<Footer />
			</footer>
		</>
	);
};

export default UserProfile;

import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { Container, Form, Button, Alert, resetForm } from "react-bootstrap";
import Select from "react-select";
const countries = [
	{ label: "USA", value: "USA", cities: ["New York", "Los Angeles", "Chicago"] },
	{ label: "Canada", value: "Canada", cities: ["Toronto", "Montreal", "Vancouver"] },
	// Add more countries and their cities here...
];
const SignupForm = ({ show, setShow }) => {
	const handleClose = () => {
		setShow(false);
		resetForm();
		setIsSubmitting(false);
	};
	const resetForm = () => {
		setFirstName("");
		setLastName("");
		setEmailAddress("");
		setPassword("");
		setConfirmPassword("");
		setCurrentAcademicLevel("");
		setCity("");
		setLocation("");
		setErrors({});
		setFormValid(false);
		setIsSubmitting(false);
		setVerificationToken("");
		setuserVerificationToken("");
		setReportAlert({ show: false, variant: "", message: "" });
	};

	const [lastname, setLastName] = useState("");
	const [firstname, setFirstName] = useState("");
	const [email_address, setEmailAddress] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [current_academic_level, setCurrentAcademicLevel] = useState("High School");
	const [city, setCity] = useState("");
	const [location, setLocation] = useState("");

	const [errors, setErrors] = useState({});
	const [formValid, setFormValid] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [verificationToken, setVerificationToken] = useState("");
	const [userverificationToken, setuserVerificationToken] = useState("");
	const [citiesOptions, setCitiesOptions] = useState([]);
	const [reportalert, setReportAlert] = useState({ show: false, variant: "", message: "" });

	const UserSignup = async () => {
		if (verificationToken == userverificationToken) {
			let name = firstname + " " + lastname;
			try {
				const formData = {
					name,
					email_address,
					password,
					confirmPassword,
					current_academic_level,
				};

				const response = await axios.post("http://127.0.0.1:8000/api/users/", formData);

				console.log("Data posted:", response.data);
				setReportAlert({ show: true, variant: "success", message: "Signup successful!" });
			} catch (error) {
				console.error("Error posting data:", error);
				setReportAlert({ show: true, variant: "danger", message: "Error in signing up!" });
				// Handle error: display error message or perform other actions
			} finally {
				setIsSubmitting(false);
				handleClose(); // Re-enable form fields
			}
		} else {
			alert("Invalid Token");
		}
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		const isValid = await validateForm();
		console.log("enetred handel submit", isValid);
		if (isValid) {
			console.log("from valid done");
			setIsSubmitting(true); // Disable form fields upon submission

			// Assuming you have a logic to send a verification token to the user's email
			// For demonstration purposes, generating a random 4-digit token
			const generatedToken = Math.floor(1000 + Math.random() * 9000);

			// Display the token input field for verification
			setVerificationToken(generatedToken);
			console.log("verification token generated", verificationToken);
			console.log(generatedToken);
		}
		// Handle success, redirect user, or perform other actions upon successful form submission
	};

	const validateForm = async () => {
		const errors = {};
		let isValid = true;

		if (firstname.trim() === "") {
			errors.name = "Name is required";
			isValid = false;
		}
		if (lastname.trim() === "") {
			errors.name = "Name is required";
			isValid = false;
		}

		if (email_address.trim() === "") {
			errors.email_address = "Email is required";
			isValid = false;
		}

		if (current_academic_level === "") {
			errors.current_academic_level = "Academic level is required";
			isValid = false;
		}

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
		if (email_address !== "") {
			const response = await axios.post("http://127.0.0.1:8000/api/checkusers/", { email_address });
			// console.log(response)
			if (response.data.message === "User already exists") {
				errors.email_address = "Email already exists";
				isValid = false;
			}
		}
		setErrors(errors);
		setFormValid(isValid);
		console.log("Form Valid ? ", isValid);
		return isValid;
	};

	return (
		<>
			{reportalert.show && (
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
					onClose={() => setReportAlert({ ...alert, show: false })}
					dismissible
				>
					{reportalert.message}
				</Alert>
			)}

			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title style={{ color: "#1f5692" }}>Signup</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Container>
						<Form>
							<Form.Group controlId="name" className="mb-3">
								<Form.Label>First Name</Form.Label>
								<Form.Control
									type="text"
									placeholder="Enter your first name"
									value={firstname}
									onChange={(e) => setFirstName(e.target.value)}
									disabled={isSubmitting || !!verificationToken}
									maxLength={20}
								/>
							</Form.Group>
							<Form.Group controlId="name" className="mb-3">
								<Form.Label>Last Name</Form.Label>
								<Form.Control
									type="text"
									placeholder="Enter your last name"
									value={lastname}
									onChange={(e) => setLastName(e.target.value)}
									disabled={isSubmitting || !!verificationToken}
									maxLength={20}
								/>
							</Form.Group>

							<Form.Group controlId="email_address" className="mb-3">
								<Form.Label>Email address</Form.Label>
								<Form.Control
									type="email"
									placeholder="Enter email"
									value={email_address}
									onChange={(e) => setEmailAddress(e.target.value)}
									disabled={isSubmitting || !!verificationToken}
									maxLength={35}
								/>
								{errors.email_address && <p style={{ color: "red" }}>{errors.email_address}</p>}
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

							<div></div>

							<Form.Group controlId="password" className="mb-3">
								<Form.Label>Password</Form.Label>
								<Form.Control
									type="password"
									placeholder="Password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									disabled={isSubmitting || !!verificationToken}
									maxLength={35}
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
									maxLength={35}
								/>
								{errors.confirmPassword && <p style={{ color: "red" }}>{errors.confirmPassword}</p>}
							</Form.Group>
							<Form>
								{/* ... (existing form fields) */}

								{/* Token input field for completing signup */}
								{verificationToken && (
									<>
										<Form.Group controlId="verificationToken" className="mb-3">
											<Form.Label>Verification Token (Check your email)</Form.Label>
											<Form.Control
												type="text"
												placeholder="Enter 4-digit token"
												value={userverificationToken}
												onChange={(e) => setuserVerificationToken(e.target.value)}
											/>
										</Form.Group>
										<div style={{ textAlign: "left" }}>
											<Button
												variant="primary"
												type="submit"
												onClick={UserSignup}
												style={{
													background: "white",
													backgroundColor: "#f66b1d",
													borderColor: "#f66b1d",
												}}
											>
												Sign Up
											</Button>
										</div>
									</>
								)}
								{!verificationToken && (
									<div style={{ textAlign: "center" }}>
										<Button
											variant="primary"
											type="submit"
											onClick={handleSubmit}
											style={{
												background: "white",
												backgroundColor: "#f66b1d",
												borderColor: "#f66b1d",
											}}
										>
											Sign Up
										</Button>
									</div>
								)}
							</Form>
						</Form>
					</Container>
				</Modal.Body>
			</Modal>
		</>
	);
};

export default SignupForm;

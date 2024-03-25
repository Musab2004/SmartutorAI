import React, { useState, useContext } from "react";
import Modal from "react-bootstrap/Modal";
import {
	Navbar,
	Container,
	Nav,
	Button,
	Row,
	Col,
	Card,
	Pagination,
	Dropdown,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import logo from "../landing_page_component/logo_smarttutor.svg";
import useAuth from "../landing_page_component/useAuth";
import userService from "../landing_page_component/UserSerive";
import { UserContext } from "../landing_page_component/UserContext";
const HomePageNavbar = ({ activeTab }) => {
	const { userData } = useContext(UserContext);
	const navigate = useNavigate();
	const handleTabChange = (tab) => {
		navigate(tab);
	};
	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("userData");
		console.log("token removed : ", localStorage);
	};
	return (
		<div className="App">
			<Navbar style={{ backgroundColor: "#e1efff" }} fixed="top">
				<Container>
					<Navbar.Brand href="#">
						<img src={logo} height="25" alt="" loading="lazy" style={{ marginTop: "-3px" }} />
					</Navbar.Brand>
					<Navbar.Toggle aria-controls="navbarExample01" />
					<Navbar.Collapse id="navbarExample01">
						<Nav className="me-auto">
							<Nav.Item>
								<Nav.Link
									eventKey="home"
									onClick={() => handleTabChange("/homepage")}
									style={{ borderBottom: activeTab === "home" ? "4px solid lightblue" : "none" }}
									className={activeTab === "home" ? "active" : ""}
								>
									Home
								</Nav.Link>
							</Nav.Item>
							<Nav.Item>
								<Nav.Link
									eventKey="createstudyplan"
									onClick={() => handleTabChange("/createstudyplan")}
									style={{
										borderBottom: activeTab === "createstudyplan" ? "4px solid lightblue" : "none",
									}}
									className={activeTab === "createstudyplan" ? "active" : ""}
								>
									Create Study Plan
								</Nav.Link>
							</Nav.Item>
							<Nav.Item>
								<Nav.Link
									eventKey="my-courses"
									onClick={() => handleTabChange("/my-courses")}
									style={{
										borderBottom: activeTab === "my-courses" ? "4px solid lightblue" : "none",
									}}
									className={activeTab === "my-courses" ? "active" : ""}
								>
									My Courses
								</Nav.Link>
							</Nav.Item>
							<Nav.Item>
								<Nav.Link
									eventKey="explore-courses"
									onClick={() => handleTabChange("/explore-courses")}
									style={{
										borderBottom: activeTab === "explore-courses" ? "4px solid lightblue" : "none",
									}}
									className={activeTab === "explore-courses" ? "active" : ""}
								>
									Explore Courses
								</Nav.Link>
							</Nav.Item>
						</Nav>
						<Nav className="d-flex flex-row"></Nav>
					</Navbar.Collapse>
				</Container>
				<Dropdown className="me-3">
					<Dropdown.Toggle variant="light" id="dropdown-basic">
						<img
							src="data:image/png;base64,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"
							height="25"
							alt=""
							loading="lazy"
							style={{ borderRadius: "50%", marginRight: "5px" }}
						/>
						UserName
					</Dropdown.Toggle>

					<Dropdown.Menu>
						<Link
							className="dropdown-item"
							to="/profile"
							onClick={() => handleTabChange("profile")}
						>
							Profile
						</Link>
						<Link to="/profile-visit" className="dropdown-item">
							Profile Visit
						</Link>
						<div className="dropdown-divider"></div>
						<Link to="/landingpage" onClick={handleLogout} className="dropdown-item">
							Logout
						</Link>
					</Dropdown.Menu>
				</Dropdown>
			</Navbar>
		</div>
	);
};

export default HomePageNavbar;

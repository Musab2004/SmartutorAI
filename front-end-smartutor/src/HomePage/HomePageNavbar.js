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
import defaultUser from "./default_user.png";
const HomePageNavbar = ({ activeTab }) => {
	const { userData } = useContext(UserContext);
	const navigate = useNavigate();
	const handleTabChange = (tab) => {
		navigate(tab);
		// setActiveTab(tab);
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
									style={{ borderBottom: activeTab === "home" ? "4px solid #1f5692" : "none" }}
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
										borderBottom: activeTab === "createstudyplan" ? "4px solid #1f5692" : "none",
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
										borderBottom: activeTab === "my-courses" ? "4px solid #1f5692" : "none",
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
										borderBottom: activeTab === "explore-courses" ? "4px solid #1f5692" : "none",
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
					{userData && (
						<Dropdown.Toggle variant="light" id="dropdown-basic">
							<img
								src={defaultUser}
								height="25"
								alt=""
								loading="lazy"
								style={{ borderRadius: "50%", marginRight: "5px" }}
							/>
							{userData.name}
						</Dropdown.Toggle>
					)}

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
						<Link to="/" onClick={handleLogout} className="dropdown-item">
							Logout
						</Link>
					</Dropdown.Menu>
				</Dropdown>
			</Navbar>
		</div>
	);
};

export default HomePageNavbar;

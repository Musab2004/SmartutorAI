import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Navbar, Container, Nav } from "react-bootstrap";
import SignUpModal from "./SignupForm";
import LoginModal from "./LoginForm";
import { Link, useNavigate } from "react-router-dom";
import logo from "./logo_smarttutor.svg";
import { Avatar, Menu, Divider, IconButton, ListItemIcon, MenuItem } from "@mui/material";
import { ChatBubble, Home, Info, Login, Menu as MenuIcon } from "@mui/icons-material";
const LNavbar = () => {
	const [toggleMenu, setTM] = useState(false);

	const [anchorEl, setAnchorEl] = useState(null);

	const [signupModal, setSM] = useState(false);

	const [loginModal, setLM] = useState(false);

	const navigate = useNavigate();
	return (
		<div>
			{/* Navbar */}
			<Navbar expand="lg" fixed="top" style={{ backgroundColor: "#e1efff" }}>
				<Container>
					<Navbar.Brand href="#">
						<img src={logo} height="32" alt="" loading="lazy" style={{ marginTop: "-3px" }} />
					</Navbar.Brand>
					{/* <Navbar.Toggle aria-controls="navbarExample01" /> */}
					<Navbar.Collapse id="navbarExample01">
						<Nav className="me-auto">
							<Link
								to="/"
								className="me-3"
								style={{
									textDecoration: "none",
									color: "#1f5692",
									fontWeight: "bold",
									fontSize: "20px",
									fontFamily: "italic",
								}}
							>
								Home
							</Link>
							<Link
								to="/quiz"
								className="me-3"
								style={{
									textDecoration: "none",
									color: "#1f5692",
									fontWeight: "bold",
									fontSize: "20px",
									fontFamily: "italic",
								}}
							>
								About us
							</Link>
							<Link
								to="/summary"
								className="me-3"
								style={{
									textDecoration: "none",
									color: "#1f5692",
									fontWeight: "bold",
									fontSize: "20px",
									fontFamily: "italic",
								}}
							>
								Contact us
							</Link>
						</Nav>
						<Nav className="d-flex flex-row">
							<Nav.Link
								onClick={() => setSM(true)}
								style={{
									textDecoration: "none",
									color: "#1f5692",
									fontWeight: "bold",
									fontSize: "20px",
									fontFamily: "italic",
									marginRight: "1rem",
								}}
							>
								Signup
							</Nav.Link>
							<Nav.Link
								onClick={() => setLM(true)}
								style={{
									textDecoration: "none",
									color: "#1f5692",
									fontWeight: "bold",
									fontSize: "20px",
									fontFamily: "italic",
								}}
							>
								Login
							</Nav.Link>
						</Nav>
					</Navbar.Collapse>
					<IconButton
						size="small"
						sx={{ display: { xs: "block", md: "none" } }}
						onClick={(e) => {
							setAnchorEl(e.currentTarget);
							setTM(true);
						}}
					>
						<MenuIcon color="inherit" />
					</IconButton>
					<Menu
						anchorEl={anchorEl}
						open={toggleMenu}
						onClose={() => {
							setAnchorEl(null);
							setTM(false);
						}}
						PaperProps={{
							elevation: 0,
							sx: {
								overflow: "visible",
								filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
								mt: 1.5,
								"& .MuiAvatar-root": {
									width: 32,
									height: 32,
									ml: -0.5,
									mr: 1,
								},
								"&::before": {
									content: '""',
									display: "block",
									position: "absolute",
									top: 0,
									right: 14,
									width: 10,
									height: 10,
									bgcolor: "background.paper",
									transform: "translateY(-50%) rotate(45deg)",
									zIndex: 0,
								},
							},
						}}
						transformOrigin={{ horizontal: "right", vertical: "top" }}
						anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
					>
						<MenuItem
							onClick={() => {
								navigate("/");
							}}
						>
							<ListItemIcon>
								<Home fontSize="small" />
							</ListItemIcon>
							Home
						</MenuItem>
						<MenuItem
							onClick={() => {
								navigate("/quiz");
							}}
						>
							<ListItemIcon>
								<Info fontSize="small" />
							</ListItemIcon>
							About Us
						</MenuItem>
						<MenuItem
							onClick={() => {
								navigate("/summary");
							}}
						>
							<ListItemIcon>
								<ChatBubble fontSize="small" />
							</ListItemIcon>
							Contact Us
						</MenuItem>
						<Divider />
						<MenuItem
							onClick={() => {
								setAnchorEl(null);
								setTM(false);
								setSM(true);
							}}
						>
							<ListItemIcon>
								<Avatar fontSize="small" />
							</ListItemIcon>
							Signup
						</MenuItem>
						<MenuItem
							onClick={() => {
								setAnchorEl(null);
								setTM(false);
								setLM(true);
							}}
						>
							<ListItemIcon>
								<Login fontSize="small" />
							</ListItemIcon>
							Login
						</MenuItem>
					</Menu>
				</Container>
				<LoginModal show={loginModal} setShow={setLM} />
				<SignUpModal show={signupModal} setShow={setSM} />
			</Navbar>
		</div>
	);
};

export default LNavbar;

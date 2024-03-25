import React, { useState } from "react";
import { Container, Nav, Row, Col, Card, Pagination } from "react-bootstrap";
// import '../App.css'; // Import the Bootstrap CSS
import "font-awesome/css/font-awesome.min.css";
import Dashboard from "../DashBoard";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import student_image1 from "./lan1.png";
import Summary_icon from "./summary_icon.svg";
import Footer from "./footer";
import Quiz_icon from "./quiz_icon.svg";
import StudyPlan_icon from "./studyplan_icon.svg";
import { Button, Grid } from "@mui/material";
function App() {
	return (
		<div>
			<Navbar />
			{/* Jumbotron */}
			<Container
				fluid
				style={{ marginTop: "60px", width: "100%", height: "500px", backgroundColor: "#e1efff" }}
			>
				<Grid container sx={{ height: "100%" }}>
					<Grid
						item
						md={6}
						xs={12}
						sx={{
							display: "flex",
							flexDirection: "column",
							justifyContent: "center",
							alignItems: "center",
							textAlign: "left",
							color: "white",
						}}
					>
						<div style={{ color: "#1f5692", marginLeft: "2rem" }}>
							<h1>
								Welcome to SmartTutor AI, your personalized learning companion designed to make
								education engaging, effective, and tailored just for you
							</h1>
							<Button
								sx={{
									color: "white",
									bgcolor: "#f66b1d",
									mt: 2,
								}}
							>
								Start Here
							</Button>
						</div>
					</Grid>
					<Grid
						item
						md={6}
						xs={0}
						sx={{
							display: { md: "flex", xs: "none" },
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<img
							src={student_image1}
							alt="Your Image"
							// className="img-fluid"
							style={{
								height: "400px",
							}}
						/>
					</Grid>
				</Grid>
			</Container>
			{/* <Container id="intro" className="text-center bg-light" style={{ marginTop: '100px' ,height:'200px'}} >
        <div >
        <h1 className="mb-3 h2" >SmartTutor AI</h1>
    
        <p className="mb-3">AI based Tutoring App to cater all your needs</p>
        <Button 
          href="https://www.youtube.com/watch?v=c9B4TPnak1A"
          role="button"
          target="_blank"
          rel="nofollow"
          variant="primary"
          className="m-2"
        >
          Create a plan
        </Button>
        <Link to="/dashboard" >
        <Button  className="m-2">
          Go to Dashboard
        </Button>
      </Link>
      </div>
      </Container> */}
			<Container
				fluid
				style={{
					backgroundColor: "#f66b1d",
					width: "100%",
					minHeight: "60vh",
					paddingBottom: "2rem",
				}}
			>
				<div className="right-container" style={{ marginTop: "0%" }}>
					<div className="left-container" style={{ textAlign: "center", marginLeft: "0%" }}>
						<br />
						<h2
							style={{ fontSize: "44px", fontWeight: "bold", fontFamily: "roca", color: "white" }}
						>
							What we provide
						</h2>
					</div>
				</div>
				<div>
					<Row className="justify-content-center" style={{ marginLeft: "5%", marginRight: "5%" }}>
						<Col xs={12} md={4}>
							<Card
								style={{
									marginTop: "5%",
									color: "#ffffff",
									textAlign: "center",
									alignItems: "Center",
									height: "250px",
									borderRadius: "15px",
								}}
							>
								<Card.Img
									variant="top"
									src={Summary_icon}
									style={{ width: "70px", height: "70px", marginTop: "10px" }}
								/>
								<Card.Body>
									<Card.Title
										style={{
											color: "#1f5692",
											fontSize: "30px",
											fontWeight: "bold",
											fontFamily: "roca",
										}}
									>
										Quizes
									</Card.Title>
									<Card.Text style={{ color: "#1f5692" }}>
										Some quick example text to build on the card title and make up the bulk of the
										card's content.
									</Card.Text>
								</Card.Body>
							</Card>
						</Col>
						<Col xs={12} md={4}>
							<Card
								style={{
									marginTop: "5%",
									color: "#ffffff",
									textAlign: "center",
									alignItems: "Center",
									height: "250px",
									borderRadius: "15px",
								}}
							>
								<Card.Img
									variant="top"
									src={Quiz_icon}
									style={{ width: "70px", height: "70px", marginTop: "10px" }}
								/>
								<Card.Body>
									<Card.Title
										style={{
											color: "#1f5692",
											fontSize: "30px",
											fontWeight: "bold",
											fontFamily: "roca",
										}}
									>
										Quick Summaries
									</Card.Title>
									<Card.Text style={{ color: "#1f5692" }}>
										Some quick example text to build on the card title and make up the bulk of the
										card's content.
									</Card.Text>
								</Card.Body>
							</Card>
						</Col>
						<Col xs={12} md={4}>
							<Card
								style={{
									marginTop: "5%",
									color: "#ffffff",
									textAlign: "center",
									alignItems: "Center",
									height: "250px",
									borderRadius: "15px",
								}}
							>
								<Card.Img
									variant="top"
									src={StudyPlan_icon}
									style={{ width: "70px", height: "70px", marginTop: "10px" }}
								/>
								<Card.Body>
									<Card.Title
										style={{
											color: "#1f5692",
											fontSize: "30px",
											fontFamily: "roca",
											fontWeight: "bold",
										}}
									>
										Personalized StudyPlans
									</Card.Title>

									<Card.Text style={{ color: "#1f5692" }}>
										Some quick example text to build on the card title and make up the bulk of the
										card's content.
									</Card.Text>
								</Card.Body>
							</Card>
						</Col>
						{/* Add more Col components for additional cards */}
					</Row>
				</div>
			</Container>

			<Container
				fluid
				style={{
					textAlign: "center",
					marginTop: "3%",
					backgroundColor: "#e1efff",
					minHeight: "400px",
				}}
			>
				<div className="right-container" style={{ display: "flex", justifyContent: "center" }}>
					<div className="left-container" style={{ textAlign: "center", width: "75%" }}>
						<br />
						<h2
							style={{ fontSize: "40px", fontWeight: "bold", fontFamily: "roca", color: "#1f5692" }}
						>
							Invest in your career with SmartTutor AI
						</h2>
						<p>
							Get access to videos in over 90% of courses, Specializations, and Professional
							Certificates taught by top instructors from leading universities and companies.
						</p>
					</div>
				</div>
				<div>
					<Container>
						<Grid
							container
							sx={{
								marginTop: "3%",
								marginBottom: "3%",
								width: "80%",
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<Grid item xs={12} md={3}>
								<Card.Img
									variant="top"
									src="https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera_assets.s3.amazonaws.com/images/52653c8817c0031d547d6df9251e52ef.png?auto=format%2Ccompress&dpr=1&w=&h=55"
									style={{ width: "100px", height: "70px", marginTop: "10px" }}
								/>
								<br />
								<br />
								<Card.Title style={{ color: "#1f5692" }}>Learn anything</Card.Title>
								<Card.Text style={{ color: "#1f5692" }}>
									Explore any interest or trending topic, take prerequisites, and advance your
									skills
								</Card.Text>
							</Grid>
							<Grid item xs={12} md={3}>
								<Card.Img
									variant="top"
									src="https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera_assets.s3.amazonaws.com/images/73feba6a844effd3a1116ba46b805171.png?auto=format%2Ccompress&dpr=1&w=&h=47"
									style={{ width: "100px", height: "70px", marginTop: "10px" }}
								/>
								<br />
								<br />
								<Card.Title style={{ color: "#1f5692" }}>Save money</Card.Title>
								<Card.Text style={{ color: "#1f5692" }}>
									Spend less money on your learning if you plan to take multiple courses this year
								</Card.Text>
							</Grid>
							<Grid item xs={12} md={3}>
								<Card.Img
									variant="top"
									src="https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera_assets.s3.amazonaws.com/images/00b4aa50ad9e3233e50c4a39e3df94f0.png?auto=format%2Ccompress&dpr=1&w=&h=55"
									style={{ width: "100px", height: "70px", marginTop: "10px" }}
								/>
								<br />
								<br />
								<Card.Title style={{ color: "#1f5692" }}>Flexible learning</Card.Title>
								<Card.Text style={{ color: "#1f5692" }}>
									Learn at your own pace, move between multiple courses, or switch to a different
									course
								</Card.Text>
							</Grid>
						</Grid>
					</Container>
				</div>
			</Container>
			{/* Footer */}
			<footer className="bg-light text-lg-start">
				<Footer />
			</footer>
		</div>
	);
}

export default App;

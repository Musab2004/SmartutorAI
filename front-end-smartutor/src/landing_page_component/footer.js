import { Grid } from "@mui/material";
import React from "react";

const Footer = () => {
	return (
		<footer
			className="text-center text-lg-start bg-body-tertiary text-muted"
			style={{ backgroundColor: "#e1efff" ,bottom:"0"}}
		>
			<Grid container spacing={2}>
				<Grid
					item
					xs={12}
					sx={{
						display: "flex",
						m: "0 2rem",
						pb: 2,
						borderBottom: "1px solid rgb(200, 200, 200)",
						justifyContent: { xs: "center", md: "space-between" },
						alignItems: "center",
					}}
				>
					<div>
						<span>Get    connected with us on social networks:</span>
					</div>
					<div>
						<a href="" className="me-4 text-reset">
							<i className="fab fa-facebook-f"></i>
						</a>
						<a href="" className="me-4 text-reset">
							<i className="fab fa-twitter"></i>
						</a>
						<a href="" className="me-4 text-reset">
							<i className="fab fa-google"></i>
						</a>
						<a href="" className="me-4 text-reset">
							<i className="fab fa-instagram"></i>
						</a>
						<a href="" className="me-4 text-reset">
							<i className="fab fa-linkedin"></i>
						</a>
						<a href="" className="me-4 text-reset">
							<i className="fab fa-github"></i>
						</a>
					</div>
				</Grid>
				<Grid item xs={12} container spacing={2} sx={{ color: "#1f5692" }}>
					<Grid item xs={12} md={5}>
						<div style={{ margin: "0 2rem" }}>
							<h6 className="text-uppercase fw-bold mb-4">
								<i className="fas fa-gem me-3"></i>SmartTutor AI
							</h6>
							<p>
								Welcome to SmartTutor AI, your personalized learning companion designed to make
								education engaging, effective, and tailored just for you
							</p>
						</div>
					</Grid>
					<Grid item xs={12} md={2}>
						<h6 className="text-uppercase fw-bold mb-4">Products</h6>
						<p>
							<a href="#!" className="text-reset">
								Studyplans
							</a>
						</p>
						<p>
							<a href="#!" className="text-reset">
								Quizes
							</a>
						</p>
						<p>
							<a href="#!" className="text-reset">
								Summary
							</a>
						</p>
						<p>
							<a href="#!" className="text-reset">
								24/7 support
							</a>
						</p>
					</Grid>
					<Grid item xs={12} md={2}>
						<h6 className="text-uppercase fw-bold mb-4">Useful links</h6>
						<p>
							<a href="#!" className="text-reset">
								Pricing
							</a>
						</p>
						<p>
							<a href="#!" className="text-reset">
								Settings
							</a>
						</p>
						<p>
							<a href="#!" className="text-reset">
								Orders
							</a>
						</p>
						<p>
							<a href="#!" className="text-reset">
								Help
							</a>
						</p>
					</Grid>
					<Grid item xs={12} md={3}>
						<h6 className="text-uppercase fw-bold mb-4">Contact</h6>
						<p>
							<i className="fas fa-home me-3"></i> Lahore, LHR 10012, PK
						</p>
						<p>
							<i className="fas fa-envelope me-3"></i>
							smarttutorai@mail.com
						</p>
						<p>
							<i className="fas fa-phone me-3"></i> + 92 334 567 88
						</p>
						<p>
							<i className="fas fa-print me-3"></i> + 92 234 567 89
						</p>
					</Grid>
				</Grid>
				<Grid
					item
					xs={12}
					sx={{
						pb: 1,
						backgroundColor: "rgba(0, 0, 0, 0.05)",
						color: "#1f5692",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					© 2024 Copyright: &nbsp;
					<a className="text-reset fw-bold" href="#">
						smarttutorai.com
					</a>
				</Grid>
			</Grid>
		</footer>
	);
};

export default Footer;

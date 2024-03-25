import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Tabs, Tab, Button, Row, Col, Modal, Container, Alert, ButtonGroup } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "./sidebar";
import DashBoardNavbar from "./DashBoardNavbar";
import DisscusionForum from "./DisscusionForum";
import ResourcePreview from "./ResourcePreview";
import { UserContext } from "../landing_page_component/UserContext";
import userService from "../landing_page_component/UserSerive";
import StudyPlanSettings from "./StudyPlanSettings";
import Footer from "../landing_page_component/footer";
// import { Link,useNavigate } from 'react-router-dom';
import { Editor } from "@tinymce/tinymce-react";
const DashBoardTabs = ({ studyPlan, activeButton }) => {
	const navigate = useNavigate();

	const handleClick = (tab, path) => {
		navigate(path, {
			state: {
				studyPlan,
			},
		});
	};
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

			<div style={{ marginTop: "80px" }}>
				<div aria-label="Basic example" style={{ marginLeft: "20%", marginBottom: "3%" }}>
					<Button
						style={{
							marginLeft: "15px",
							backgroundColor: activeButton === "tab1" ? "#1f5692" : "white",
							color: activeButton === "tab1" ? "white" : "#1f5692",
							borderColor: "white",
							fontStyle: "italic",
							borderRadius: "10px",
						}}
						variant={activeButton === "tab1" ? "primary" : "secondary"}
						onClick={() => handleClick("tab1", "/dashboard")}
					>
						Study Schedule
					</Button>
					<Button
						style={{
							marginLeft: "15px",
							backgroundColor: activeButton === "tab2" ? "#1f5692" : "white",
							color: activeButton === "tab2" ? "white" : "#1f5692",
							borderColor: "white",
							fontStyle: "italic",
							borderRadius: "10px",
						}}
						variant={activeButton === "tab2" ? "primary" : "secondary"}
						onClick={() => handleClick("tab2", "/dashboard-quiz-generation")}
					>
						Quiz Generation
					</Button>
					<Button
						style={{
							marginLeft: "15px",
							backgroundColor: activeButton === "tab3" ? "#1f5692" : "white",
							color: activeButton === "tab3" ? "white" : "#1f5692",
							borderColor: "white",
							fontStyle: "italic",
							borderRadius: "10px",
						}}
						variant={activeButton === "tab3" ? "primary" : "secondary"}
						onClick={() => handleClick("tab3", "/dashboard-summary-generation")}
					>
						Summary Generation
					</Button>
					<Button
						style={{
							marginLeft: "15px",
							backgroundColor: activeButton === "tab4" ? "#1f5692" : "white",
							color: activeButton === "tab4" ? "white" : "#1f5692",
							borderColor: "white",
							fontStyle: "italic",
							borderRadius: "10px",
						}}
						variant={activeButton === "tab4" ? "primary" : "secondary"}
						onClick={() => handleClick("tab4", "/dashboard-discussion-forum")}
					>
						Discussion Forum
					</Button>
					<Button
						style={{
							marginLeft: "15px",
							backgroundColor: activeButton === "tab6" ? "#1f5692" : "white",
							color: activeButton === "tab6" ? "white" : "#1f5692",
							borderColor: "white",
							fontStyle: "italic",
							borderRadius: "10px",
						}}
						variant={activeButton === "tab6" ? "primary" : "secondary"}
						onClick={() => handleClick("tab6", "/dashboard-quiz-room")}
					>
						Quiz Room
					</Button>
					<Button
						style={{
							marginLeft: "15px",
							backgroundColor: activeButton === "tab5" ? "#1f5692" : "white",
							color: activeButton === "tab5" ? "white" : "#1f5692",
							borderColor: "white",
							fontStyle: "italic",
							borderRadius: "10px",
						}}
						variant={activeButton === "tab5" ? "primary" : "secondary"}
						onClick={() => handleClick("tab5", "/dashboard-settings")}
					>
						Settings
					</Button>
				</div>
			</div>
		</>
	);
};

export default DashBoardTabs;

import React, { useState } from "react";
import axios from "axios";
import { IconButton } from "@mui/material";
import { Close, Send } from "@mui/icons-material";

const ChatbotApp = ({ open, setOpen }) => {
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState("");

	const sendMessage = async () => {
		if (!input) return;

		const userMessage = { role: "user", content: input };
		const newMessages = [...messages, userMessage];
		setMessages(newMessages);
		setInput("");

		try {
			const response = await axios.post(
				"https://api.openai.com/v1/chat/completions",
				{
					model: "gpt-3.5-turbo",
					messages: newMessages,
					max_tokens: 100, // Adjust this value as needed to control response length
					temperature: 0.5, // Lower values make responses more deterministic
				},
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer sk-proj-H9604idDPtL8XzensAebT3BlbkFJkPTrLzW1LgpMkpPCqmLp`,
					},
				}
			);

			const botMessage = response.data.choices[0].message;
			setMessages([...newMessages, botMessage]);
		} catch (error) {
			console.error("Error:", error);
			const botMessage = {
				role: "bot",
				content: "Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello",
			};
			setMessages([...newMessages, botMessage]);
		}
	};

	if (open) {
		return (
			<div
				style={{
					position: "fixed",
					bottom: 100,
					right: 20,
					width: "520px",
					height: "600px",
					overflow: "auto",
					zIndex: 1000,
				}}
			>
				<div style={styles.container}>
					<div style={{ display: "flex", alignItems: "center" }}>
					<h1 style={styles.header}>StudyBuddy 🤖</h1>
						<IconButton
							sx={{ position: "absolute", right: 5 }}
							size="small"
							onClick={() => {
								setOpen(false);
							}}
						>
							<Close />
						</IconButton>
					</div>
					<div style={styles.chatWindow}>
						{messages.map((msg, index) => (
							<div key={index} style={msg.role === "user" ? styles.userMessage : styles.botMessage}>
								{msg.content}
							</div>
						))}
					</div>
					<div style={styles.inputContainer}>
						<input
							type="text"
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyPress={(e) => e.key === "Enter" && sendMessage()}
							style={styles.input}
						/>
						<IconButton size="small" onClick={sendMessage} sx={styles.button}>
							<Send />
						</IconButton>
					</div>
				</div>
			</div>
		);
	} else {
		return <></>;
	}
};

const styles = {
	container: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		border: "1px solid rgb(200, 200, 200)",
		borderRadius: "10px",
		height: "100%",
		width: "100%",
		fontFamily: "Arial, sans-serif",
		backgroundColor: "#eaeaea",
	},
	header: {
		margin: "15px 0",
		fontSize: "30px",
		color: "#333",
	},
	chatWindow: {
		border: "1px solid rgb(180, 180, 180)",
		borderRadius: "10px",
		width: "90%",
		height:'400px',
		overflowY: "auto",
		display: "flex",
		flexDirection: "column",
		backgroundColor: "#fff",
	},
	userMessage: {
		textAlign: "left",
		color: "#fff",
		backgroundColor: "#007bff",
		height: "60px",
		padding: "7px",
		borderRadius: "10px",
		margin: "5px",
		maxWidth: "70%",
		alignSelf: "flex-start",
	},
	botMessage: {
		textAlign: "right",
		color: "#333",
		backgroundColor: "#e9ecef",
		height: "100%",
		padding: "7px",
		borderRadius: "10px",
		margin: "5px",
		maxWidth: "70%",
		alignSelf: "flex-end",
	},
	inputContainer: {
		display: "flex",
		width: "90%",
		margin: "10px 0",
	},
	input: {
		flex: 1,
		padding: "10px",
		borderRadius: "10px 0 0 10px",
		border: "1px solid rgb(180, 180, 180)",
		borderRight: "none",
		outline: "none",
	},
	button: {
		padding: "0 10px",
		borderRadius: "0 10px 10px 0",
		// border: "1px solid #ccc",
		backgroundColor: "#007bff",
		color: "#fff",
		outline: "none",
	},
};

export default ChatbotApp;
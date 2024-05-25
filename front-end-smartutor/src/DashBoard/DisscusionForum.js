// RedditPost.js
import React, { useState, useEffect, useContext } from "react";
import { Card, Button, Collapse, Form, FormControl, Modal, Alert } from "react-bootstrap";
import { UserContext } from "../landing_page_component/UserContext";
import userService from "../landing_page_component/UserSerive";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import DefaulUser from "./default_user.png";
import Comments from "./Comments";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import MoreVert from '@mui/icons-material/MoreVert';

const ITEM_HEIGHT = 48;

const RedditPost = (props) => {
	// console.log(props);
	
	var posts = props.post;
	
	console.log(posts.is_upvoted.length);
	const { userData } = useContext(UserContext);
	const [editalert, setEditAlert] = useState({ show: false, variant: "", message: "" });
	const [reportalert, setReportAlert] = useState({ show: false, variant: "", message: "" });
	const [deletealert, setDeleteAlert] = useState({ show: false, variant: "", message: "" });
	const location = useLocation();
	var [post, setposts] = useState([]);

	const [author, setauthor] = useState([]);
	const [comments, setComments] = useState([]);
	const [showModaleditpost, setShowModaleditpost] = useState(false);
	const [editingPost, setEditingPost] = useState("");
	var [upvoted, setUpvoted] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);
	post=posts
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};
	useEffect(() => {
		const fetchPost = async () => {
			try {
				const response = await userService.get(`/api/queryposts/${posts.id}`);
				setposts(response.data);
			} catch (error) {
				console.error("Failed to fetch users", error);
			}
		};

		fetchPost();
	}, []);
	if (post.is_upvoted != undefined) {
		for (let i = 0; i < post.is_upvoted.length; i++) {
			if (userData.id == post.is_upvoted[i]) {
				upvoted = true;
				// console.log("yup is like")
			}
		}
	}
	useEffect(() => {
		const fetchUser = async () => {
			try {
				const response = await userService.get(`/api/users/${posts.author}`); // Your Django endpoint to fetch users
				console.log("User : ", response.data);
				setauthor(response.data);
			} catch (error) {
				console.error("Failed to fetch users", error);
			}
		};

		fetchUser();
	}, []);

	const fetchComments = async () => {
		try {
			const response = await userService.get(`/api/answersposts/?post_id=${posts.id}`); // Your Django endpoint to fetch users
			setComments(response.data);
			console.log("Comments called", response.data);
		} catch (error) {
			console.error("Failed to fetch users", error);
		}
	};
	useEffect(() => {
		fetchComments();
	}, []);

	const [commentsOpen, setCommentsOpen] = useState(false);

	const handleToggleComments = () => {
		setCommentsOpen(!commentsOpen);
	};
	const [commentsOpen1, setCommentsOpen1] = useState(false);
	const [commentText, setCommentText] = useState("");

	const handleToggleComments1 = () => {
		setCommentsOpen1(!commentsOpen1);
	};

	const handleInputChange = (event) => {
		setCommentText(event.target.value);
	};
	const [showModal, setShowModal] = useState(false);
	const [reason, setReason] = useState("");

	const handleShowModal = () => {
		handleClose();
		setShowModal(true);
	};

	const handleCloseModal = () => {
		setShowModal(false);
	};

	const handleReasonChange = (e) => {
		setReason(e.target.value);
	};
	const handleEditChange = (e) => {
		setEditingPost(e.target.value);
	};

	const handleSubmitReportPost = () => {
		console.log("Reported with reason:", reason);
		const reportData = {
			post: post.id,
			reason: reason,
			reporter: userData.id,
		};

		userService
			.post("/api/reportposts/", reportData)
			.then((response) => {
				console.log("Report submitted successfully:", response.data);
				handleCloseModal();
				setReportAlert({ show: true, variant: "success", message: "Post Reported successfully!" });
			})
			.catch((error) => {
				console.error("Error submitting report:", error);
				setReportAlert({ show: true, variant: "danger", message: "Error reporting post!" });
			});
		handleCloseModal();
	};

	const handleSubmitComment = async () => {
		try {
			const response = await userService.post("/api/answersposts/", {
				text: commentText,
				author: userData.id,
				post: post.id,
			});

			console.log("Response:", response.data);
			fetchComments();
		} catch (error) {
			console.error("Error:", error);
		}
	};
	const handleEdit = (postId) => {
		setShowModaleditpost(true);
		handleClose();
		console.log(`Editing post ${postId}`);
	};

	const handleDelete = (postId) => {
		console.log("handle delete called");
		handleClose();
		if (window.confirm("Are you sure you want to delete this post?")) {
			userService
				.delete(`/api/queryposts/${post.id}`)
				.then((response) => {
					console.log(`Deleted post ${postId}`);
					setDeleteAlert({ show: true, variant: "success", message: "Post deleted successfully!" });
					props.fetchPostfunc();
				})
				.catch((error) => {
					console.error(`Error deleting post ${postId}:`, error);
					setDeleteAlert({ show: true, variant: "danger", message: "Error deleteing post!" });
				});
		}
	};
	const handleCloseModaleditpost = () => {
		handleClose();
		setShowModaleditpost(false);
		setEditingPost(null);
	};
	const [content, setContent] = useState("");
	const handleSubmitEditPost = (updatedPostData) => {
		userService
			.put(`/api/queryposts/${post.id}/`, {
				author: userData.id,
				content: editingPost,
				title: editingPost,
			}) // Replace `/api/posts/${postId}` with your API endpoint
			.then((response) => {
				console.log("Post updated successfully:", response.data);
				setposts(response.data);

				handleCloseModaleditpost();
				props.fetchPostfunc(props.studyPlan.id);
				setEditAlert({ show: true, variant: "success", message: "Post editted successfully!" });
			})
			.catch((error) => {
				console.error("Error updating post:", error);
				setEditAlert({ show: true, variant: "danger", message: "Error editing post!" });
			});
	};

	const handleEditorChange = (content) => {
		setContent(content);
	};

	const handleUpvotePost = (postId) => {
		if (upvoted) {
			userService.post(`api/downvotepost/`, { user: userData.id, post: postId });
			props.fetchPostfunc(props.studyPlan.id);
			props.fetchPostfunc(props.studyPlan.id);
			props.fetchPostfunc(props.studyPlan.id);
			setUpvoted(false);
		} else {
			userService.post(`api/upvotepost/`, { user: userData.id, post: postId });
			setUpvoted(true);
			props.fetchPostfunc(props.studyPlan.id);
			props.fetchPostfunc(props.studyPlan.id);
			props.fetchPostfunc(props.studyPlan.id);
		}
	};

	return (
		<div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
			{editalert.show && (
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
					onClose={() => setEditAlert({ ...alert, show: false })}
					dismissible
				>
					{editalert.message}
				</Alert>
			)}
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
			{deletealert.show && (
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
					onClose={() => setDeleteAlert({ ...alert, show: false })}
					dismissible
				>
					{deletealert.message}
				</Alert>
			)}
			<Card style={{ marginTop: "20px", width: "75%" }}>
				<Card.Body>
					<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
						<div style={{ display: "flex" }}>
							<Card.Img
								variant="top"
								src={author.profile_pic || DefaulUser}
								style={{
									borderRadius: "50%", // Makes the image round
									width: "40px", // Sets the width of the image
									height: "40px", // Sets the height of the image
									objectFit: "cover", // Maintains the aspect ratio
								}}
							/>
							<div style={{ marginLeft: "1rem" }}>
								<div style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "-0.25rem" }}>
									{author.name}
								</div>
								<p>{author.email_address}</p>
							</div>
						</div>
						<div style={{ marginLeft: "60%" }}>
							<IconButton
								aria-label="more"
								aria-controls="long-menu"
								aria-haspopup="true"
								onClick={handleClick}
							>
								<MoreVert />
							</IconButton>
							<Menu
								id="long-menu"
								anchorEl={anchorEl}
								keepMounted
								open={open}
								onClose={handleClose}
								PaperProps={{
									style: {
										maxHeight: 1 * 4.5,
										width: "20ch",
									},
								}}
							>
								<MenuItem key="Edit" onClick={() => handleEdit(post.id)}>
									Edit
								</MenuItem>
								<MenuItem key="Delete" onClick={() => handleDelete(post.id)}>
									Delete
								</MenuItem>
								<MenuItem key="Report" onClick={handleShowModal}>
									Report
								</MenuItem>
							</Menu>
						</div>
					</div>

					<div dangerouslySetInnerHTML={{ __html: post.content }} />

					<hr
						style={{
							color: " solid black",
							backgroundColor: "solid black",
							height: 3,
						}}
					/>

					<div style={{ display: "flex", alignItems: "center", marginLeft: "10px" }}>
						<Button
							onClick={() => handleUpvotePost(post.id)}
							class=""
							style={{
								background: "none",
								borderColor: "white",
								color: upvoted ? "green" : "black",
								display: "flex",
								alignItems: "center",
								height: "40px",
								minWidth: "40px",
							}}
							title="Upvote Post"
						>
							{post.is_upvoted && (
								<span style={{ marginRight: "5px" }}>{post.is_upvoted.length}</span>
							)}
							{upvoted ? (
								<i className="fas fa-thumbs-up"></i>
							) : (
								<i className="far fa-thumbs-up"></i>
							)}
						</Button>
						<Button
							onClick={handleToggleComments}
							variant="primary"
							style={{
								marginLeft: "3%",
								background: "None",
								borderColor: "white",
								color: "black",
								height: "40px",
								width: "40px",
							}}
							title="Toggle Comments"
						>
							{commentsOpen ? <i className="fas fa-eye-slash"></i> : <i className="fas fa-eye"></i>}
						</Button>
						<Button
							onClick={handleToggleComments1}
							variant=""
							style={{
								marginLeft: "3%",
								backgroundColor: "white",
								borderColor: "white",
								height: "40px",
								width: "40px",
							}}
							title="Toggle Comments"
						>
							{commentsOpen1 ? (
								<i className="fas fa-comment-slash"></i>
							) : (
								<i className="fas fa-comment-dots"></i>
							)}
						</Button>
						{/* <Button onClick={handleShowModal} className="report-button" style={{marginLeft:'3%', backgroundColor:'white', borderColor:'white', color:'black', height: '40px', width: '40px' }} title="Report Post">
    <i className="fas fa-flag"></i>
  </Button> */}

						<Modal show={showModaleditpost} onHide={handleCloseModaleditpost} style={{marginTop:'100px'}}>
							<Modal.Header closeButton>
								<Modal.Title>Edit Post</Modal.Title>
							</Modal.Header>
							<Modal.Body>
								<Form.Group>
									<Form.Control
										as="textarea"
										rows={3}
										value={editingPost}
										defaultValue={post.content}
										onChange={handleEditChange}
									/>
								</Form.Group>
							</Modal.Body>
							<Modal.Footer>
								<Button variant="secondary" onClick={handleCloseModaleditpost}>
									Close
								</Button>
								<Button variant="primary" onClick={handleSubmitEditPost}>
									Update Post
								</Button>
							</Modal.Footer>
						</Modal>

						<div />
						<Modal show={showModal} onHide={handleCloseModal}>
							<Modal.Header closeButton>
								<Modal.Title>Report Post</Modal.Title>
							</Modal.Header>
							<Modal.Body>
								<Form.Group>
									<Form.Label>Reason for report</Form.Label>
									<Form.Control
										as="textarea"
										rows={3}
										value={reason}
										onChange={handleReasonChange}
									/>
								</Form.Group>
							</Modal.Body>
							<Modal.Footer>
								<Button variant="secondary" onClick={handleCloseModal}>
									Close
								</Button>
								<Button variant="primary" onClick={handleSubmitReportPost}>
									Submit Report
								</Button>
							</Modal.Footer>
						</Modal>
					</div>

					{commentsOpen1 && (
						<div>
							<br />
							<Form>
								<FormControl
									type="text"
									placeholder="Write your comment here..."
									value={commentText}
									onChange={handleInputChange}
								/>
								<Button onClick={handleSubmitComment} style={{ marginTop: "1rem" }}>
									Submit
								</Button>
							</Form>
						</div>
					)}

					<Collapse in={commentsOpen}>
						<div>
							<Comments post={post} comment={comments} commentfunc={fetchComments} />
						</div>
					</Collapse>
				</Card.Body>
			</Card>
		</div>
	);
};

export default RedditPost;

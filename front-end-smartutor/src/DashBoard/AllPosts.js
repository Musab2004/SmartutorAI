// RedditPost.js
import React, { useState, useEffect, useContext } from "react";
import { Card, Button, Collapse, Form, FormControl, Modal } from "react-bootstrap";
import { UserContext } from "../landing_page_component/UserContext";
import userService from "../landing_page_component/UserSerive";
import { useLocation } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import DisscusionForum from "./DisscusionForum";

const AllPosts = (props) => {
	var posts = props.posts;
    console.log(posts);
	// var posts = props.comment;
	// const [comments, setComments] = useState([]);
	return (
		<>
				{posts.map((post) => (
							<DisscusionForum
								key={post.id}
								post={post}
								studyPlan={props.studyPlan}
								fetchPostfunc={props.fetchPosts}
							/>
						))}

						{/* {visiblePosts < posts.length && (
							<Button onClick={handleLoadMore} style={{ marginTop: "5px", marginLeft: "50%" }}>
								Load More
							</Button> */}
						
		</>
	);
};

export default AllPosts;

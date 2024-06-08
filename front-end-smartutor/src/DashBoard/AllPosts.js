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
		</>
	);
};

export default AllPosts;

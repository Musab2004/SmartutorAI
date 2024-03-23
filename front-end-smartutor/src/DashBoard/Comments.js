// RedditPost.js
import React, { useState ,useEffect,useContext} from 'react';
import { Card, Button, Collapse,Form, FormControl ,Modal} from 'react-bootstrap';
import { UserContext } from '../landing_page_component/UserContext';
import userService from '../landing_page_component/UserSerive';
import  { useLocation } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import Comment from './Comment';



const Comments = (props) => {
  var post=props.post
  var comment=props.comment
  const [comments, setComments] = useState([]);
  return (
    <>
        {comment.map(comment => <>
          <Comment key={comment.id} comment={comment} post={post} commentfunc={props.commentfunc}/>
           
          </>)}

    </>
  );
};

export default Comments;

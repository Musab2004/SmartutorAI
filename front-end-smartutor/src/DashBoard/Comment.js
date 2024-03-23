// RedditPost.js
import React, { useState ,useEffect,useContext} from 'react';
import { Card, Button, Collapse,Form, FormControl ,Modal} from 'react-bootstrap';
import { UserContext } from '../landing_page_component/UserContext';
import userService from '../landing_page_component/UserSerive';
import  { useLocation } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DefaulUser from './default_user.png'
// import { UserContext } from '../landing_page_component/UserContext';


const ITEM_HEIGHT = 48
const Comments = (props) => {
  var post=props.post
  var comment=props.comment
  const [author, setauthor] = useState([]);
  const { userData } = useContext(UserContext);
  const [comments, setComments] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [editedText, setEditedText] = useState();
  const [modalIsOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [upvotedComments, setUpvotedComments] = useState(new Set());
  const [showModal, setShowModal] = useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setReason('');
  };

  const handleReasonChange = (event) => {
    setReason(event.target.value);
  };


  const handleEdit = (commentId) => {
    setIsEditing(commentId);
  };



    useEffect(() => {
        const fetchUser = async () => {
          try {
            const response = await userService.get(`/api/users/${comment.author}`);
          console.log("User : ",response.data)
          setauthor(response.data);
          } catch (error) {
            console.error('Failed to fetch users', error);
          }
        };
    
        fetchUser();
    
      }, []);
  const handleReportComment = async (comment) => {
    handleClose();
    const reportData = {
      comment: comment.id, 
      reason: reason,
      reporter:userData.pk,
    };
  
    try {
      await userService.post('/api/reportanswers/',reportData);
    } catch (error) {
      console.error('Error reporting comment:', error);
    }
  };

  const handleSave = async (comment,newContent) => {
    try {

      await userService.put(`/api/answersposts/${comment.id}/`, {        
        text: editedText,
        author:userData.pk,
        post:post.id,});
    } catch (error) {
      console.error('Error editing comment:', error);
    }
    setIsEditing(false);
  };

  const handleDeleteComment = async (comment) => {
    handleClose();
    if (window.confirm('Are you sure you want to delete this post?')) {
    try {
      await userService.delete(`api/answersposts/${comment.id}`);
      props.commentfunc(props.post.id);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
}
  };

  const handleReplyComment = async (comment,replyContent) => {
    try {
      await userService.post(`api/answersposts/${comment.id}/reply`, { content: replyContent });
    } catch (error) {
      console.error('Error replying to comment:', error);
    }
  };

 

  const handleModalOpen = () => {
    handleClose();
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };
 

  const handleUpvoteComment = (comment,comment_id) => {
    if (comment.is_upvoted.includes(userData.pk)) {
      userService.post(`api/downvotecomment/`, { user: userData.pk,comment:comment_id });
      props.commentfunc(props.post.id);
      props.commentfunc(props.post.id);
      props.commentfunc(props.post.id);
  
    } else {
      userService.post(`api/upvotecomment/`, { user: userData.pk,comment:comment_id });

      props.commentfunc(props.post.id);
      props.commentfunc(props.post.id);
      props.commentfunc(props.post.id);

    }
  };
  return (
    <>
    <br/>
    <Card style={{marginLeft:"20%"}}>
            <div>
          <div style={{ display: 'flex',marginLeft:'5%',marginTop:'2%', alignItems: 'center'}}>
         
                <div style={{ marginRight: '15px' }}>
                 
              <Card.Img
                variant="top"
                src={DefaulUser}
                style={{
                  borderRadius: '50%',
                  width: '40px', 
                  height: '40px', 
                  objectFit: 'cover', 
                }}
              />
            </div>
            <div>
            <h1 style={{fontSize:'14px'}}>{author.name}</h1>
           
            <h>{author.email_address}</h>
            
    
            </div>
            <div style={{marginLeft:'40%'}}>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '20ch',
          },
        }}
      >
        <MenuItem key="Edit"  onClick={() => handleEdit(comment.id)}>
          Edit
        </MenuItem>
        <MenuItem key="Delete" onClick={() => handleDeleteComment(comment)}>
          Delete
        </MenuItem>
        <MenuItem key="Report" onClick={handleModalOpen}>
          Report
        </MenuItem>
      </Menu>
     
    </div>
    
            </div>
            <div style={{marginLeft:'5%',marginTop:'3%'}}>

            <Card.Text>{comment.text}</Card.Text>
            </div>
            <hr
        style={{
            color: ' solid black',
            backgroundColor: 'solid black',
            height: 3
        }}
        />
            <div>
            {isEditing === comment.id ? (
            <>
              <textarea
                value={ editedText}
                onChange={(e) => setEditedText(e.target.value)}
              />
              <Button onClick={() => handleSave(comment,"hehe")}>Save</Button>
            </>
          ) : (
            <>
            
                
             <div style={{marginLeft:'25%'}}>
              <Button onClick={() => handleUpvoteComment(comment,comment.id)} style={{background:'none',border:'None'}}>
                
            
              {comment.is_upvoted.includes(userData.pk)  ? <i className="fas fa-thumbs-up" style={{ color: 'blue' }}></i> : <i className="far fa-thumbs-up " style={{ color: 'grey' }}></i>}
              <div style={{color:'black'}}>{comment.is_upvoted.length}</div>
            </Button>
            </div>
            </>
          )}


            </div>
          
            </div>
            </Card>
      
          
            <Modal show={showModal} onHide={handleModalClose}>
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
          <Button variant="primary" onClick={() =>handleReportComment(comment)}>
            Submit Report
          </Button>
        </Modal.Footer>
      </Modal>          
         
          </>
  );
};

export default Comments;

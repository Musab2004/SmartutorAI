import React from 'react';
import { Card, Button,Container } from 'react-bootstrap';
const QuizRoomList = ({ post}) => {
  return (
    <Container className="d-flex justify-content-center align-items-center">
    <Card className="mb-3 shadow-sm" style={{width:'60%'}}>
      <Card.Body>
        <Card.Text>duration : {post.duration}</Card.Text>
        <Card.Text>Starting time : {post.time}</Card.Text>
        <Card.Text>Starting Date : {post.date}</Card.Text>
        <Card.Text>Belongs to : {post.study_plan}</Card.Text>
        <Card.Text>owner : {post.owner}</Card.Text>
        <Button >Join QuizRoom</Button>
      </Card.Body>
    </Card>
    </Container>
  );
};

export default QuizRoomList;
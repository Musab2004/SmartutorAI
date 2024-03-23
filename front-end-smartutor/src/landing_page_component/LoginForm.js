import React, { useState,useEffect,useContext } from 'react';
import { useNavigate } from "react-router-dom"

import Modal from 'react-bootstrap/Modal';
import { Form, Button, Container } from 'react-bootstrap';
import axios from 'axios';
import userService from './UserSerive';
import { UserContext } from './UserContext';
const LoginForm = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate()

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    setErrorMessage('');
    setEmailAddress('');
    setPassword('');
  };

  const handleShow = () => setShow(true);

  const handleSubmit = () => {
    // e.preventDefault();

    if (!emailAddress || !password) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    axios
      .post('http://127.0.0.1:8000/api/custom-login/', {
        email: emailAddress,
        password: password,
      })
      .then((response) => {
        // Handle success (for example, authentication succeeded)
        console.log('Login successful', response.data);
        // console.log(response)
        const token = response.data.access_token;
        const user=response.data.user;
        // Store token in localStorage
        console.log(token)
        setUser(user);
        localStorage.setItem('token', token);
        localStorage.setItem('user', user);
        console.log(localStorage['token'])
        // console.log(localStorage)
        console.log(localStorage.getItem('user'))
        
        handleClose();
        navigate('/homepage'); // Close the modal or perform other actions upon successful login
      })
      .catch((error) => {
        // Handle error (for example, display an error message)
        console.error('Error during login:', error);
        setErrorMessage('Login failed. Please try again.');
      });
  };

  const { userData } = useContext(UserContext);
  console.log(userData)

  // const [users, setUsers] = useState([]);

  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     try {
  //       const response = await userService.get('/api/users/'); // Your Django endpoint to fetch users
  //       setUsers(response.data);
  //       console.log(response.data)
  //     } catch (error) {
  //       console.error('Failed to fetch users', error);
  //     }
  //   };

  //   fetchUsers();
  // }, []);

  return (
    <>
      <Button variant="primary" onClick={handleShow} style={{background:'white',backgroundColor:'#f66b1d',borderColor:'#f66b1d'}}>
        Login
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title style={{color:'#1f5692'}}>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="email" className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="password" className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
              {errorMessage && (
                <p className="text-danger">{errorMessage}</p>
              )}
              <div style={{ textAlign: 'center' }}>
                <Button variant="primary" type="submit" onClick={handleSubmit}  style={{background:'white',backgroundColor:'#f66b1d',borderColor:'#f66b1d'}}>
                  Login
                </Button>
                <p className="mt-2">
                  <a href="#" style={{color:'#1f5692'}}>Forgot Password?</a>
                </p>
              </div>
              <div style={{ textAlign: 'center', marginTop: '3%' }}>
                <p>or login with:</p>
                {/* Social login buttons */}
              </div>
            </Form>
          </Container>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default LoginForm;

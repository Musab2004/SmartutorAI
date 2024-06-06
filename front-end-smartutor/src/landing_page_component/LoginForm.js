import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import { Form, Button, Container } from "react-bootstrap";
import axios from "axios";
import { UserContext } from "./UserContext";
import ForgotPasswordForm from "./ForgotPasswordForm";
const LoginForm = ({ show, setShow }) => {
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const [emailAddress, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    const handleClose = () => {
        setShow(false);
        setErrorMessage("");
        setEmailAddress("");
        setPassword("");
    };

    const handleForgotPassword = () => {
        setShow(false);
        setShowForgotPassword(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!emailAddress || !password) {
            setErrorMessage("Please fill in all fields");
            return;
        }

        axios
            .post("http://127.0.0.1:8000/api/custom-login/", {
                email: emailAddress,
                password: password,
            })
            .then((response) => {
                const token = response.data.access_token;
                const user = response.data.user;
                setUser(user);
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(user));

                handleClose();
                navigate("/homepage");
            })
            .catch((error) => {
                console.error("Error during login:", error);
                setErrorMessage("Login failed. Please try again.");
            });
    };

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title style={{ color: "#1f5692" }}>Login</Modal.Title>
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
                            {errorMessage && <p className="text-danger">{errorMessage}</p>}
                            <div style={{ textAlign: "center" }}>
                                <Button
                                    variant="primary"
                                    type="submit"
                                    onClick={handleSubmit}
                                    style={{
                                        background: "white",
                                        backgroundColor: "#f66b1d",
                                        borderColor: "#f66b1d",
                                    }}
                                >
                                    Login
                                </Button>
                                <p className="mt-2">
                                    <a href="#" style={{ color: "#1f5692" }} onClick={handleForgotPassword}>
                                        Forgot Password?
                                    </a>
                                </p>
                            </div>
                        </Form>
                    </Container>
                </Modal.Body>
            </Modal>

            <ForgotPasswordForm show={showForgotPassword} setShow={setShowForgotPassword} />
        </>
    );
};

export default LoginForm;

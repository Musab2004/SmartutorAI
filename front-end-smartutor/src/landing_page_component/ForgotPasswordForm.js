import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Form, Button, Container } from "react-bootstrap";
import axios from "axios";
import emailjs from 'emailjs-com';

const ForgotPasswordForm = ({ show, setShow }) => {
    const [emailAddress, setEmailAddress] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [step, setStep] = useState(1);
    const [errorMessage, setErrorMessage] = useState("");
    const [generatedCode, setGeneratedCode] = useState("");

    const handleClose = () => {
        setShow(false);
        setEmailAddress("");
        setVerificationCode("");
        setNewPassword("");
        setStep(1);
        setErrorMessage("");
        setGeneratedCode("");
    };

    const sendVerificationCode = (code) => {
        console.log(emailAddress)
        const templateParams = {
            email: emailAddress,
            code: code,
        };

        emailjs.send('service_ep7k7kp', 'template_33i9hbq', templateParams, 'ESTStH_BKN13hacuc')
            .then((response) => {
                console.log('SUCCESS!', response.status, response.text);
                setStep(2);
                setErrorMessage("");
            }, (error) => {
                console.error('FAILED...', error);
                setErrorMessage("Failed to send verification email. Please try again.");
            });
    };

    const handleSubmitEmail = (e) => {
        e.preventDefault();

        if (!emailAddress) {
            setErrorMessage("Please enter your email address");
            return;
        }

        const code = Math.floor(1000 + Math.random() * 9000).toString();
        setGeneratedCode(code);
        sendVerificationCode(code);
    };

    const handleSubmitCode = (e) => {
        e.preventDefault();

        if (!verificationCode || !newPassword) {
            setErrorMessage("Please fill in all fields");
            return;
        }

        if (verificationCode !== generatedCode) {
            setErrorMessage("Incorrect verification code");
            return;
        }

        axios
            .post("http://127.0.0.1:8000/api/update-password/", {
                email: emailAddress,
                code: verificationCode,
                new_password: newPassword,
            })
            .then((response) => {
                handleClose();
                alert("Password reset successfully!");
            })
            .catch((error) => {
                console.error("Error during password reset:", error);
                setErrorMessage("Failed to reset password. Please try again.");
            });
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title style={{ color: "#1f5692" }}>Forgot Password</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    {step === 1 && (
                        <Form onSubmit={handleSubmitEmail}>
                            <Form.Group controlId="email" className="mb-3">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter email"
                                    value={emailAddress}
                                    onChange={(e) => setEmailAddress(e.target.value)}
                                />
                            </Form.Group>
                            {errorMessage && <p className="text-danger">{errorMessage}</p>}
                            <div style={{ textAlign: "center" }}>
                                <Button
                                    variant="primary"
                                    type="submit"
                                    style={{
                                        background: "white",
                                        backgroundColor: "#f66b1d",
                                        borderColor: "#f66b1d",
                                    }}
                                >
                                    Send Verification Code
                                </Button>
                            </div>
                        </Form>
                    )}
                    {step === 2 && (
                        <Form onSubmit={handleSubmitCode}>
                            <Form.Group controlId="code" className="mb-3">
                                <Form.Label>Verification Code</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter verification code"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group controlId="newPassword" className="mb-3">
                                <Form.Label>New Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </Form.Group>
                            {errorMessage && <p className="text-danger">{errorMessage}</p>}
                            <div style={{ textAlign: "center" }}>
                                <Button
                                    variant="primary"
                                    type="submit"
                                    style={{
                                        background: "white",
                                        backgroundColor: "#f66b1d",
                                        borderColor: "#f66b1d",
                                    }}
                                >
                                    Reset Password
                                </Button>
                            </div>
                        </Form>
                    )}
                </Container>
            </Modal.Body>
        </Modal>
    );
};

export default ForgotPasswordForm;

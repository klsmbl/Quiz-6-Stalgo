import { useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { ensureAdminUser, getUsers, saveUsers } from "../utils/storage";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    phoneNumber: "",
    firstName: "",
    lastName: "",
    location: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [submitMessage, setSubmitMessage] = useState(null);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  function validateForm() {
    const nextErrors = {};
    const requiredFields = {
      email: "Email is required.",
      username: "Username is required.",
      phoneNumber: "Phone number is required.",
      firstName: "First name is required.",
      lastName: "Last name is required.",
      location: "Location is required.",
      gender: "Gender is required.",
      password: "Password is required.",
      confirmPassword: "Confirm password is required.",
    };

    Object.entries(requiredFields).forEach(([field, message]) => {
      if (!formData[field].trim()) {
        nextErrors[field] = message;
      }
    });

    if (formData.email && !emailPattern.test(formData.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (formData.password && formData.password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters long.";
    }

    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    return nextErrors;
  }

  function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validateForm();
    setErrors(nextErrors);
    setSubmitMessage(null);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    ensureAdminUser();

    const storedUsers = getUsers();
    const emailExists = storedUsers.some((user) => user.email === formData.email);

    if (emailExists) {
      setSubmitMessage({
        type: "danger",
        text: "An account with that email already exists.",
      });
      return;
    }

    const newUser = {
      email: formData.email,
      username: formData.username,
      phoneNumber: formData.phoneNumber,
      firstName: formData.firstName,
      lastName: formData.lastName,
      location: formData.location,
      gender: formData.gender,
      password: formData.password,
      role: "User",
    };

    saveUsers([...storedUsers, newUser]);
    setSubmitMessage({
      type: "success",
      text: "Registration successful. Your account has been created with the User role.",
    });

    navigate("/signin", {
      replace: true,
      state: {
        message: "Registration successful. Sign in using your email and password.",
      },
    });
  }

  return (
    <main className="auth-page py-5">
      <Container>
        <Row className="justify-content-center align-items-stretch g-4">
          <Col lg={5}>
            <div className="auth-panel auth-panel-secondary h-100">
              <p className="auth-eyebrow">New Customer Registration</p>
              <h1 className="display-6 fw-bold mb-3">Create your marketplace account.</h1>
              <p className="text-white-50 mb-4">
                Register to book services, manage upcoming appointments, and receive cleaning updates in one place.
              </p>
              <div className="role-note">
                <span className="role-note-label">Assigned Role</span>
                <strong>User</strong>
                <p className="mb-0 text-white-50">Admin and Seller roles remain reserved for platform approval workflows.</p>
              </div>
            </div>
          </Col>
          <Col lg={7}>
            <Card className="auth-card border-0 shadow-lg">
              <Card.Body className="p-4 p-md-5">
                <div className="mb-4">
                  <h2 className="h3 mb-2">Register</h2>
                  <p className="text-muted mb-0">Complete the form below to create your account.</p>
                </div>

                {submitMessage ? <Alert variant={submitMessage.type}>{submitMessage.text}</Alert> : null}

                <Form noValidate onSubmit={handleSubmit}>
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group controlId="signUpEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          placeholder="name@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          isInvalid={Boolean(errors.email)}
                        />
                        <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="signUpUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                          type="text"
                          name="username"
                          placeholder="Choose a username"
                          value={formData.username}
                          onChange={handleChange}
                          isInvalid={Boolean(errors.username)}
                        />
                        <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="signUpPhoneNumber">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                          type="text"
                          name="phoneNumber"
                          placeholder="09XX XXX XXXX"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          isInvalid={Boolean(errors.phoneNumber)}
                        />
                        <Form.Control.Feedback type="invalid">{errors.phoneNumber}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="signUpLocation">
                        <Form.Label>Location</Form.Label>
                        <Form.Control
                          type="text"
                          name="location"
                          placeholder="City, Province"
                          value={formData.location}
                          onChange={handleChange}
                          isInvalid={Boolean(errors.location)}
                        />
                        <Form.Control.Feedback type="invalid">{errors.location}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="signUpFirstName">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="firstName"
                          placeholder="First name"
                          value={formData.firstName}
                          onChange={handleChange}
                          isInvalid={Boolean(errors.firstName)}
                        />
                        <Form.Control.Feedback type="invalid">{errors.firstName}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="signUpLastName">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="lastName"
                          placeholder="Last name"
                          value={formData.lastName}
                          onChange={handleChange}
                          isInvalid={Boolean(errors.lastName)}
                        />
                        <Form.Control.Feedback type="invalid">{errors.lastName}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="signUpGender">
                        <Form.Label>Gender</Form.Label>
                        <Form.Select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          isInvalid={Boolean(errors.gender)}
                        >
                          <option value="">Select gender</option>
                          <option value="Female">Female</option>
                          <option value="Male">Male</option>
                          <option value="Non-binary">Non-binary</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">{errors.gender}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="signUpPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="password"
                          placeholder="Minimum 8 characters"
                          value={formData.password}
                          onChange={handleChange}
                          isInvalid={Boolean(errors.password)}
                        />
                        <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="signUpConfirmPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="confirmPassword"
                          placeholder="Confirm password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          isInvalid={Boolean(errors.confirmPassword)}
                        />
                        <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Button type="submit" variant="dark" size="lg" className="w-100 fw-semibold mt-4">
                    Create Account
                  </Button>
                </Form>

                <p className="text-muted mt-4 mb-0">
                  Already registered? <Link to="/signin">Go to sign in.</Link>
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
}

export default SignUp;
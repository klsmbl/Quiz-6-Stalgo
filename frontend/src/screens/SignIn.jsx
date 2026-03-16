import { useMemo, useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ensureAdminUser, getDefaultAdminCredentials, getUsers, setCurrentUser } from "../utils/storage";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function SignIn() {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [submitMessage, setSubmitMessage] = useState(null);

  const registrationMessage = useMemo(() => location.state?.message || "", [location.state]);
  const adminCredentials = useMemo(() => getDefaultAdminCredentials(), []);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  function validateForm() {
    const nextErrors = {};

    if (!formData.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!emailPattern.test(formData.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!formData.password.trim()) {
      nextErrors.password = "Password is required.";
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
    const matchedUser = storedUsers.find(
      (user) => user.email === formData.email && user.password === formData.password,
    );

    if (!matchedUser) {
      setSubmitMessage({
        type: "danger",
        text: "No account matched that email and password combination.",
      });
      return;
    }

    setCurrentUser(matchedUser);

    setSubmitMessage({
      type: "success",
      text: `Welcome back, ${matchedUser.firstName}. You are signed in as ${matchedUser.role}.`,
    });

    const destinationByRole = {
      Admin: "/admin/users",
      Seller: "/seller/dashboard",
      User: "/",
    };

    navigate(destinationByRole[matchedUser.role] || "/", {
      replace: true,
    });
  }

  return (
    <main className="auth-page py-5">
      <Container>
        <Row className="justify-content-center align-items-stretch g-4">
          <Col lg={5}>
            <div className="auth-panel auth-panel-primary h-100">
              <p className="auth-eyebrow">Customer Login</p>
              <h1 className="display-6 fw-bold mb-3">Access your bookings and cleaning orders.</h1>
              <p className="text-white-50 mb-0">
                Sign in using your email address and password to manage appointments, payments, and order history.
              </p>
            </div>
          </Col>
          <Col lg={5}>
            <Card className="auth-card border-0 shadow-lg">
              <Card.Body className="p-4 p-md-5">
                <div className="mb-4">
                  <h2 className="h3 mb-2">Sign In</h2>
                  <p className="text-muted mb-0">Use your email and password to continue.</p>
                </div>

                <Alert variant="light" className="admin-hint">
                  Demo Admin: {adminCredentials.email} / {adminCredentials.password}
                </Alert>

                {registrationMessage ? <Alert variant="success">{registrationMessage}</Alert> : null}
                {submitMessage ? <Alert variant={submitMessage.type}>{submitMessage.text}</Alert> : null}

                <Form noValidate onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="signInEmail">
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

                  <Form.Group className="mb-4" controlId="signInPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      isInvalid={Boolean(errors.password)}
                    />
                    <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                  </Form.Group>

                  <Button type="submit" variant="dark" size="lg" className="w-100 fw-semibold">
                    Sign In
                  </Button>
                </Form>

                <p className="text-muted mt-4 mb-0">
                  Need an account? <Link to="/signup">Create one here.</Link>
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
}

export default SignIn;
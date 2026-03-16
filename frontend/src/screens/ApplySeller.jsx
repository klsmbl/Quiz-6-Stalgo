import { useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ApplySeller() {
  const [formData, setFormData] = useState({
    email: "",
    expertiseTitle: "",
    yearsOfExperience: "",
    serviceArea: "",
    phoneNumber: "",
    paypalEmail: "",
    professionalSummary: "",
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

    if (!formData.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!emailPattern.test(formData.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!formData.expertiseTitle.trim()) {
      nextErrors.expertiseTitle = "Cleaning expertise is required.";
    }

    if (!formData.yearsOfExperience.trim()) {
      nextErrors.yearsOfExperience = "Years of experience is required.";
    }

    if (!formData.serviceArea.trim()) {
      nextErrors.serviceArea = "Service area is required.";
    }

    if (!formData.phoneNumber.trim()) {
      nextErrors.phoneNumber = "Phone number is required.";
    }

    if (!formData.paypalEmail.trim()) {
      nextErrors.paypalEmail = "PayPal email is required.";
    } else if (!emailPattern.test(formData.paypalEmail)) {
      nextErrors.paypalEmail = "Enter a valid PayPal email address.";
    }

    if (!formData.professionalSummary.trim()) {
      nextErrors.professionalSummary = "Professional summary is required.";
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

    const storedUsers = JSON.parse(localStorage.getItem("cleanLinkUsers") || "[]");
    const registeredUser = storedUsers.find((user) => user.email === formData.email);

    if (!registeredUser) {
      setSubmitMessage({
        type: "danger",
        text: "No customer account is registered with that email. Create a user account before applying as a cleaning expert.",
      });
      return;
    }

    const existingApplications = JSON.parse(localStorage.getItem("cleanLinkSellerApplications") || "[]");
    const duplicateApplication = existingApplications.find(
      (application) => application.email === formData.email && application.status === "Pending Admin Approval",
    );

    if (duplicateApplication) {
      setSubmitMessage({
        type: "warning",
        text: "A seller application for this account is already pending admin review.",
      });
      return;
    }

    const application = {
      ...formData,
      roleRequested: "Seller",
      currentRole: registeredUser.role,
      status: "Pending Admin Approval",
      submittedAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "cleanLinkSellerApplications",
      JSON.stringify([...existingApplications, application]),
    );

    setSubmitMessage({
      type: "success",
      text: "Application submitted successfully. Your request to become a Seller is now pending admin approval.",
    });

    setFormData({
      email: "",
      expertiseTitle: "",
      yearsOfExperience: "",
      serviceArea: "",
      phoneNumber: "",
      paypalEmail: "",
      professionalSummary: "",
    });
  }

  return (
    <main className="auth-page py-5">
      <Container>
        <Row className="justify-content-center align-items-stretch g-4">
          <Col lg={5}>
            <div className="auth-panel seller-panel h-100">
              <p className="auth-eyebrow">Seller Application</p>
              <h1 className="display-6 fw-bold mb-3">Apply to become a cleaning expert on the platform.</h1>
              <p className="text-white-50 mb-4">
                Submit your service background, coverage area, and PayPal merchant email so the platform can review your eligibility.
              </p>
              <div className="role-note">
                <span className="role-note-label">Approval Policy</span>
                <strong>Admin approval required</strong>
                <p className="mb-0 text-white-50">
                  Your role remains <strong>User</strong> until an Admin approves the application and upgrades your account to <strong>Seller</strong>.
                </p>
              </div>
            </div>
          </Col>

          <Col lg={7}>
            <Card className="auth-card border-0 shadow-lg">
              <Card.Body className="p-4 p-md-5">
                <div className="mb-4">
                  <h2 className="h3 mb-2">Apply as Cleaning Expert</h2>
                  <p className="text-muted mb-0">
                    Use the same email as your customer account so the Admin can review and upgrade the correct profile.
                  </p>
                </div>

                {submitMessage ? <Alert variant={submitMessage.type}>{submitMessage.text}</Alert> : null}

                <Form noValidate onSubmit={handleSubmit}>
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group controlId="applySellerEmail">
                        <Form.Label>Account Email</Form.Label>
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
                      <Form.Group controlId="applySellerPhoneNumber">
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
                      <Form.Group controlId="applySellerExpertiseTitle">
                        <Form.Label>Cleaning Expertise</Form.Label>
                        <Form.Control
                          type="text"
                          name="expertiseTitle"
                          placeholder="Carpet, sofa, mattress, office cleaning"
                          value={formData.expertiseTitle}
                          onChange={handleChange}
                          isInvalid={Boolean(errors.expertiseTitle)}
                        />
                        <Form.Control.Feedback type="invalid">{errors.expertiseTitle}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="applySellerExperience">
                        <Form.Label>Years of Experience</Form.Label>
                        <Form.Control
                          type="text"
                          name="yearsOfExperience"
                          placeholder="e.g. 4 years"
                          value={formData.yearsOfExperience}
                          onChange={handleChange}
                          isInvalid={Boolean(errors.yearsOfExperience)}
                        />
                        <Form.Control.Feedback type="invalid">{errors.yearsOfExperience}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="applySellerServiceArea">
                        <Form.Label>Service Area</Form.Label>
                        <Form.Control
                          type="text"
                          name="serviceArea"
                          placeholder="City, district, or coverage zone"
                          value={formData.serviceArea}
                          onChange={handleChange}
                          isInvalid={Boolean(errors.serviceArea)}
                        />
                        <Form.Control.Feedback type="invalid">{errors.serviceArea}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="applySellerPayPalEmail">
                        <Form.Label>PayPal Merchant Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="paypalEmail"
                          placeholder="merchant@example.com"
                          value={formData.paypalEmail}
                          onChange={handleChange}
                          isInvalid={Boolean(errors.paypalEmail)}
                        />
                        <Form.Control.Feedback type="invalid">{errors.paypalEmail}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col xs={12}>
                      <Form.Group controlId="applySellerSummary">
                        <Form.Label>Professional Summary</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={5}
                          name="professionalSummary"
                          placeholder="Describe your cleaning experience, equipment, and the types of services you provide."
                          value={formData.professionalSummary}
                          onChange={handleChange}
                          isInvalid={Boolean(errors.professionalSummary)}
                        />
                        <Form.Control.Feedback type="invalid">{errors.professionalSummary}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Button type="submit" variant="dark" size="lg" className="w-100 fw-semibold mt-4">
                    Submit Seller Application
                  </Button>
                </Form>

                <p className="text-muted mt-4 mb-0">
                  Need a customer account first? <Link to="/signup">Register here.</Link>
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
}

export default ApplySeller;
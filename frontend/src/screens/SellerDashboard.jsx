import { useMemo, useState } from "react";
import { Alert, Badge, Button, Card, Col, Container, Form, Row, Table } from "react-bootstrap";
import { getCurrentUser, getSellerServices, saveSellerServices } from "../utils/storage";

function SellerDashboard() {
  const currentUser = useMemo(() => getCurrentUser(), []);
  const [services, setServices] = useState(() =>
    getSellerServices().filter((service) => service.sellerEmail === currentUser?.email),
  );
  const [formData, setFormData] = useState({
    serviceName: "",
    description: "",
    price: "",
    duration: "",
    image: "",
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

    if (!formData.serviceName.trim()) {
      nextErrors.serviceName = "service_name is required.";
    }

    if (!formData.description.trim()) {
      nextErrors.description = "description is required.";
    }

    if (!formData.price.trim()) {
      nextErrors.price = "price is required.";
    } else if (Number(formData.price) <= 0 || Number.isNaN(Number(formData.price))) {
      nextErrors.price = "price must be a valid number greater than 0.";
    }

    if (!formData.duration.trim()) {
      nextErrors.duration = "duration is required.";
    }

    if (!formData.image.trim()) {
      nextErrors.image = "image is required.";
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

    const allServices = getSellerServices();
    const newService = {
      id: `${currentUser.email}-${Date.now()}`,
      sellerEmail: currentUser.email,
      sellerName: `${currentUser.firstName} ${currentUser.lastName}`,
      serviceName: formData.serviceName,
      description: formData.description,
      price: Number(formData.price),
      duration: formData.duration,
      image: formData.image,
      createdAt: new Date().toISOString(),
    };

    const nextServices = [...allServices, newService];
    saveSellerServices(nextServices);
    setServices(nextServices.filter((service) => service.sellerEmail === currentUser.email));
    setSubmitMessage({
      type: "success",
      text: "Cleaning service added successfully.",
    });
    setFormData({
      serviceName: "",
      description: "",
      price: "",
      duration: "",
      image: "",
    });
  }

  return (
    <main className="app-page py-5">
      <Container>
        <div className="hero-panel mb-4">
          <Badge bg="dark" className="mb-3 px-3 py-2 text-uppercase hero-badge">
            Seller Dashboard
          </Badge>
          <h1 className="fw-bold mb-2">Manage Your Cleaning Services</h1>
          <p className="text-muted mb-0 hero-copy">
            Add and organize your carpet and upholstery services as an approved cleaning expert.
          </p>
        </div>

        <Row className="g-4">
          <Col lg={7}>
            <Card className="auth-card border-0 shadow-sm">
              <Card.Body className="p-4">
                <h2 className="h4 mb-3">Add New Cleaning Service</h2>
                <p className="text-muted mb-4">
                  Examples: "Deep Carpet Steam Cleaning", "Sofa Fabric Shampoo Cleaning", "Mattress Anti-Allergen Cleaning", "Pet Stain Removal Treatment"
                </p>

                {submitMessage ? <Alert variant={submitMessage.type}>{submitMessage.text}</Alert> : null}

                <Form noValidate onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="sellerServiceName">
                    <Form.Label>service_name</Form.Label>
                    <Form.Control
                      type="text"
                      name="serviceName"
                      placeholder="Deep Carpet Steam Cleaning"
                      value={formData.serviceName}
                      onChange={handleChange}
                      isInvalid={Boolean(errors.serviceName)}
                    />
                    <Form.Control.Feedback type="invalid">{errors.serviceName}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="sellerServiceDescription">
                    <Form.Label>description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="description"
                      placeholder="Describe the cleaning process and outcome."
                      value={formData.description}
                      onChange={handleChange}
                      isInvalid={Boolean(errors.description)}
                    />
                    <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
                  </Form.Group>

                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group controlId="sellerServicePrice">
                        <Form.Label>price</Form.Label>
                        <Form.Control
                          type="number"
                          min="1"
                          step="0.01"
                          name="price"
                          placeholder="75"
                          value={formData.price}
                          onChange={handleChange}
                          isInvalid={Boolean(errors.price)}
                        />
                        <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="sellerServiceDuration">
                        <Form.Label>duration</Form.Label>
                        <Form.Control
                          type="text"
                          name="duration"
                          placeholder="1 - 2 hours"
                          value={formData.duration}
                          onChange={handleChange}
                          isInvalid={Boolean(errors.duration)}
                        />
                        <Form.Control.Feedback type="invalid">{errors.duration}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mt-3" controlId="sellerServiceImage">
                    <Form.Label>image</Form.Label>
                    <Form.Control
                      type="text"
                      name="image"
                      placeholder="/images/my-cleaning-service.jpg"
                      value={formData.image}
                      onChange={handleChange}
                      isInvalid={Boolean(errors.image)}
                    />
                    <Form.Control.Feedback type="invalid">{errors.image}</Form.Control.Feedback>
                  </Form.Group>

                  <Button type="submit" variant="dark" className="mt-4 w-100 fw-semibold" size="lg">
                    Add Service
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={5}>
            <Card className="admin-card border-0 shadow-sm h-100">
              <Card.Body className="p-4">
                <h2 className="h5 mb-3">Your Listed Services</h2>
                <div className="table-responsive">
                  <Table className="admin-table align-middle mb-0">
                    <thead>
                      <tr>
                        <th>service_name</th>
                        <th>price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {services.length === 0 ? (
                        <tr>
                          <td colSpan={2} className="text-muted text-center py-4">
                            No services listed yet.
                          </td>
                        </tr>
                      ) : (
                        services.map((service) => (
                          <tr key={service.id}>
                            <td>{service.serviceName}</td>
                            <td>${service.price.toFixed(2)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
}

export default SellerDashboard;
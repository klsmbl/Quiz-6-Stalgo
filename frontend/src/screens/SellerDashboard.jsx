import { useMemo, useState } from "react";
import { Alert, Badge, Button, Card, Col, Container, Form, Modal, Row, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addService, deleteService, updateService } from "../redux/actions/serviceActions";
import { getSellerApplications } from "../utils/storage";

function SellerDashboard() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const sellerServices = useSelector((state) => state.services.sellerServices);
  const services = useMemo(
    () => sellerServices.filter((service) => service.sellerEmail === currentUser?.email),
    [sellerServices, currentUser],
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
  const [editingService, setEditingService] = useState(null);
  const [editFormData, setEditFormData] = useState({
    serviceName: "",
    description: "",
    price: "",
    duration: "",
    image: "",
  });
  const [editErrors, setEditErrors] = useState({});

  const sellerPayPalEmail = useMemo(() => {
    const approvedApplication = getSellerApplications().find(
      (application) => application.email === currentUser?.email && application.status === "Approved",
    );

    return approvedApplication?.paypalEmail || currentUser?.email;
  }, [currentUser]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  function handleEditChange(event) {
    const { name, value } = event.target;

    setEditFormData((currentData) => ({
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

  function validateEditForm() {
    const nextErrors = {};

    if (!editFormData.serviceName.trim()) {
      nextErrors.serviceName = "service_name is required.";
    }

    if (!editFormData.description.trim()) {
      nextErrors.description = "description is required.";
    }

    if (!editFormData.price.toString().trim()) {
      nextErrors.price = "price is required.";
    } else if (Number(editFormData.price) <= 0 || Number.isNaN(Number(editFormData.price))) {
      nextErrors.price = "price must be a valid number greater than 0.";
    }

    if (!editFormData.duration.trim()) {
      nextErrors.duration = "duration is required.";
    }

    if (!editFormData.image.trim()) {
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

    const newService = {
      id: `${currentUser.email}-${Date.now()}`,
      sellerEmail: currentUser.email,
      sellerName: `${currentUser.firstName} ${currentUser.lastName}`,
      sellerPayPalEmail,
      serviceName: formData.serviceName,
      description: formData.description,
      price: Number(formData.price),
      duration: formData.duration,
      image: formData.image,
      createdAt: new Date().toISOString(),
    };

    dispatch(addService(newService, sellerServices));
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

  function openEditModal(service) {
    setEditingService(service);
    setEditFormData({
      serviceName: service.serviceName,
      description: service.description,
      price: service.price,
      duration: service.duration,
      image: service.image,
    });
    setEditErrors({});
  }

  function closeEditModal() {
    setEditingService(null);
    setEditErrors({});
  }

  function handleEditSubmit(event) {
    event.preventDefault();

    const nextErrors = validateEditForm();
    setEditErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    dispatch(
      updateService(
        {
          id: editingService.id,
          serviceName: editFormData.serviceName,
          description: editFormData.description,
          price: Number(editFormData.price),
          duration: editFormData.duration,
          image: editFormData.image,
        },
        sellerServices,
      ),
    );

    setSubmitMessage({
      type: "success",
      text: "Service updated successfully.",
    });
    closeEditModal();
  }

  function handleDeleteService(serviceId) {
    dispatch(deleteService(serviceId, sellerServices));
    setSubmitMessage({
      type: "warning",
      text: "Service deleted successfully.",
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
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {services.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="text-muted text-center py-4">
                            No services listed yet.
                          </td>
                        </tr>
                      ) : (
                        services.map((service) => (
                          <tr key={service.id}>
                            <td>{service.serviceName}</td>
                            <td>${service.price.toFixed(2)}</td>
                            <td className="text-end">
                              <div className="d-inline-flex gap-2">
                                <Button variant="outline-dark" size="sm" onClick={() => openEditModal(service)}>
                                  Edit
                                </Button>
                                <Button variant="outline-danger" size="sm" onClick={() => handleDeleteService(service.id)}>
                                  Delete
                                </Button>
                              </div>
                            </td>
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

        <Modal show={Boolean(editingService)} onHide={closeEditModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Edit Cleaning Service</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleEditSubmit} noValidate>
            <Modal.Body>
              <Form.Group className="mb-3" controlId="editServiceName">
                <Form.Label>service_name</Form.Label>
                <Form.Control
                  type="text"
                  name="serviceName"
                  value={editFormData.serviceName}
                  onChange={handleEditChange}
                  isInvalid={Boolean(editErrors.serviceName)}
                />
                <Form.Control.Feedback type="invalid">{editErrors.serviceName}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="editServiceDescription">
                <Form.Label>description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditChange}
                  isInvalid={Boolean(editErrors.description)}
                />
                <Form.Control.Feedback type="invalid">{editErrors.description}</Form.Control.Feedback>
              </Form.Group>

              <Row className="g-3">
                <Col md={6}>
                  <Form.Group controlId="editServicePrice">
                    <Form.Label>price</Form.Label>
                    <Form.Control
                      type="number"
                      name="price"
                      min="1"
                      step="0.01"
                      value={editFormData.price}
                      onChange={handleEditChange}
                      isInvalid={Boolean(editErrors.price)}
                    />
                    <Form.Control.Feedback type="invalid">{editErrors.price}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="editServiceDuration">
                    <Form.Label>duration</Form.Label>
                    <Form.Control
                      type="text"
                      name="duration"
                      value={editFormData.duration}
                      onChange={handleEditChange}
                      isInvalid={Boolean(editErrors.duration)}
                    />
                    <Form.Control.Feedback type="invalid">{editErrors.duration}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mt-3" controlId="editServiceImage">
                <Form.Label>image</Form.Label>
                <Form.Control
                  type="text"
                  name="image"
                  value={editFormData.image}
                  onChange={handleEditChange}
                  isInvalid={Boolean(editErrors.image)}
                />
                <Form.Control.Feedback type="invalid">{editErrors.image}</Form.Control.Feedback>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline-secondary" onClick={closeEditModal}>
                Cancel
              </Button>
              <Button type="submit" variant="dark">
                Save Changes
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Container>
    </main>
  );
}

export default SellerDashboard;
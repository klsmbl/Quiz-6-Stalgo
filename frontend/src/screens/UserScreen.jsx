import { useMemo, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Container,
  Form,
  Modal,
  Tab,
  Table,
  Tabs,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  reviewSellerApplication,
  setSellerApplications,
} from "../redux/actions/sellerApplicationActions";
import { setUsers } from "../redux/actions/userActions";

function UserScreen() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const users = useSelector((state) => state.users.users);
  const applications = useSelector((state) => state.sellerApplications.applications);
  const [activeTab, setActiveTab] = useState("users");
  const [submitMessage, setSubmitMessage] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [editErrors, setEditErrors] = useState({});
  const [approveModalApplication, setApproveModalApplication] = useState(null);
  const [declineModalApplication, setDeclineModalApplication] = useState(null);
  const [merchantId, setMerchantId] = useState("");
  const [reasonForDecline, setReasonForDecline] = useState("");
  const [approvalErrors, setApprovalErrors] = useState({});

  const pendingApplicationsCount = useMemo(
    () => applications.filter((application) => application.status === "Pending Admin Approval").length,
    [applications],
  );

  function openEditModal(user) {
    setEditingUser(user);
    setEditFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
    setEditErrors({});
  }

  function closeEditModal() {
    setEditingUser(null);
    setEditErrors({});
  }

  function handleEditChange(event) {
    const { name, value } = event.target;

    setEditFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  function validateEditForm() {
    const nextErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!editFormData.firstName.trim()) {
      nextErrors.firstName = "First name is required.";
    }

    if (!editFormData.lastName.trim()) {
      nextErrors.lastName = "Last name is required.";
    }

    if (!editFormData.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!emailPattern.test(editFormData.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    const duplicateEmail = users.find(
      (user) => user.email === editFormData.email && user.email !== editingUser.email,
    );

    if (duplicateEmail) {
      nextErrors.email = "Another account already uses that email address.";
    }

    return nextErrors;
  }

  function handleEditSubmit(event) {
    event.preventDefault();

    const nextErrors = validateEditForm();
    setEditErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const nextUsers = users.map((user) => {
      if (user.email !== editingUser.email) {
        return user;
      }

      return {
        ...user,
        firstName: editFormData.firstName,
        lastName: editFormData.lastName,
        email: editFormData.email,
      };
    });

    const nextApplications = applications.map((application) => {
      if (application.email !== editingUser.email) {
        return application;
      }

      return {
        ...application,
        email: editFormData.email,
      };
    });

    dispatch(setUsers(nextUsers));
    dispatch(setSellerApplications(nextApplications));
    setSubmitMessage({
      type: "success",
      text: "User account updated successfully.",
    });
    closeEditModal();
  }

  function handleDeleteUser(userEmail) {
    if (userEmail === currentUser?.email) {
      setSubmitMessage({
        type: "warning",
        text: "You cannot delete the admin account currently signed in.",
      });
      return;
    }

    const nextUsers = users.filter((user) => user.email !== userEmail);
    const nextApplications = applications.filter((application) => application.email !== userEmail);

    dispatch(setUsers(nextUsers));
    dispatch(setSellerApplications(nextApplications));
    setSubmitMessage({
      type: "success",
      text: "User account deleted successfully.",
    });
  }

  function openApproveModal(application) {
    setApproveModalApplication(application);
    setMerchantId("");
    setApprovalErrors({});
  }

  function closeApproveModal() {
    setApproveModalApplication(null);
    setMerchantId("");
    setApprovalErrors({});
  }

  function openDeclineModal(application) {
    setDeclineModalApplication(application);
    setReasonForDecline("");
    setApprovalErrors({});
  }

  function closeDeclineModal() {
    setDeclineModalApplication(null);
    setReasonForDecline("");
    setApprovalErrors({});
  }

  function updateApplicationStatus(applicationEmail, nextStatus, details = {}) {
    dispatch(
      reviewSellerApplication(
        {
          email: applicationEmail,
          status: nextStatus,
          merchantId: details.merchantId || "",
          reasonForDecline: details.reasonForDecline || "",
        },
        applications,
        users,
      ),
    );

    if (nextStatus === "Approved") {
      const nextUsers = users.map((user) =>
        user.email === applicationEmail
          ? {
              ...user,
              role: "Seller",
            }
          : user,
      );
      dispatch(setUsers(nextUsers));
    }

    setSubmitMessage({
      type: nextStatus === "Approved" ? "success" : "warning",
      text:
        nextStatus === "Approved"
          ? "Seller application approved and user role upgraded to Seller."
          : "Seller application declined.",
    });
  }

  function handleApproveSubmit(event) {
    event.preventDefault();

    const nextErrors = {};

    if (!merchantId.trim()) {
      nextErrors.merchantId = "merchant_id is required before approval.";
    }

    setApprovalErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    updateApplicationStatus(approveModalApplication.email, "Approved", {
      merchantId,
    });
    closeApproveModal();
  }

  function handleDeclineSubmit(event) {
    event.preventDefault();

    const nextErrors = {};

    if (!reasonForDecline.trim()) {
      nextErrors.reasonForDecline = "reason_for_decline is required.";
    }

    setApprovalErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    updateApplicationStatus(declineModalApplication.email, "Declined", {
      reasonForDecline,
    });
    closeDeclineModal();
  }

  return (
    <main className="app-page py-5">
      <Container>
        <div className="hero-panel mb-4">
          <Badge bg="dark" className="mb-3 px-3 py-2 text-uppercase hero-badge">
            Admin Panel
          </Badge>
          <h1 className="fw-bold mb-2">User Management</h1>
          <p className="text-muted mb-0 hero-copy">
            Review marketplace users, update customer accounts, and process cleaning expert applications from one admin workspace.
          </p>
        </div>

        {submitMessage ? <Alert variant={submitMessage.type}>{submitMessage.text}</Alert> : null}

        <Card className="admin-card border-0 shadow-sm">
          <Card.Body className="p-4">
            <Tabs
              activeKey={activeTab}
              onSelect={(tabKey) => setActiveTab(tabKey || "users")}
              className="mb-4 admin-tabs"
            >
              <Tab eventKey="users" title={`Users (${users.length})`}>
                <div className="table-responsive">
                  <Table hover className="align-middle admin-table">
                    <thead>
                      <tr>
                        <th>first_name</th>
                        <th>last_name</th>
                        <th>email</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.email}>
                          <td>{user.firstName}</td>
                          <td>{user.lastName}</td>
                          <td>{user.email}</td>
                          <td className="text-end">
                            <div className="d-inline-flex gap-2">
                              <Button variant="outline-dark" size="sm" onClick={() => openEditModal(user)}>
                                Edit
                              </Button>
                              <Button variant="outline-danger" size="sm" onClick={() => handleDeleteUser(user.email)}>
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Tab>

              <Tab
                eventKey="applications"
                title={`Seller Applications (${pendingApplicationsCount})`}
              >
                <div className="table-responsive">
                  <Table hover className="align-middle admin-table">
                    <thead>
                      <tr>
                        <th>email</th>
                        <th>expertise</th>
                        <th>service_area</th>
                        <th>status</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center text-muted py-4">
                            No seller applications submitted yet.
                          </td>
                        </tr>
                      ) : (
                        applications.map((application) => (
                          <tr key={`${application.email}-${application.submittedAt}`}>
                            <td>{application.email}</td>
                            <td>{application.expertiseTitle}</td>
                            <td>{application.serviceArea}</td>
                            <td>
                              <Badge bg={application.status === "Approved" ? "success" : application.status === "Declined" ? "secondary" : "warning"} text={application.status === "Pending Admin Approval" ? "dark" : undefined}>
                                {application.status}
                              </Badge>
                            </td>
                            <td className="text-end">
                              <div className="d-inline-flex gap-2">
                                <Button
                                  variant="outline-success"
                                  size="sm"
                                  disabled={application.status === "Approved"}
                                  onClick={() => openApproveModal(application)}
                                >
                                  Approve
                                </Button>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  disabled={application.status === "Declined"}
                                  onClick={() => openDeclineModal(application)}
                                >
                                  Decline
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </div>
              </Tab>
            </Tabs>
          </Card.Body>
        </Card>

        <Modal show={Boolean(editingUser)} onHide={closeEditModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Edit User Account</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleEditSubmit} noValidate>
            <Modal.Body>
              <Form.Group className="mb-3" controlId="editFirstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={editFormData.firstName}
                  onChange={handleEditChange}
                  isInvalid={Boolean(editErrors.firstName)}
                />
                <Form.Control.Feedback type="invalid">{editErrors.firstName}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="editLastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={editFormData.lastName}
                  onChange={handleEditChange}
                  isInvalid={Boolean(editErrors.lastName)}
                />
                <Form.Control.Feedback type="invalid">{editErrors.lastName}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="editEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={editFormData.email}
                  onChange={handleEditChange}
                  isInvalid={Boolean(editErrors.email)}
                />
                <Form.Control.Feedback type="invalid">{editErrors.email}</Form.Control.Feedback>
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

        <Modal show={Boolean(approveModalApplication)} onHide={closeApproveModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Approve Seller Application</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleApproveSubmit} noValidate>
            <Modal.Body>
              <p className="text-muted mb-3">
                Assign the merchant_id before approving this seller account.
              </p>
              <Form.Group controlId="approveMerchantId">
                <Form.Label>merchant_id</Form.Label>
                <Form.Control
                  type="text"
                  value={merchantId}
                  onChange={(event) => setMerchantId(event.target.value)}
                  isInvalid={Boolean(approvalErrors.merchantId)}
                  placeholder="MERCHANT-12345"
                />
                <Form.Control.Feedback type="invalid">{approvalErrors.merchantId}</Form.Control.Feedback>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline-secondary" onClick={closeApproveModal}>
                Cancel
              </Button>
              <Button type="submit" variant="success">
                Confirm Approval
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

        <Modal show={Boolean(declineModalApplication)} onHide={closeDeclineModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Decline Seller Application</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleDeclineSubmit} noValidate>
            <Modal.Body>
              <p className="text-muted mb-3">
                Enter reason_for_decline to document why this seller application is declined.
              </p>
              <Form.Group controlId="declineReason">
                <Form.Label>reason_for_decline</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={reasonForDecline}
                  onChange={(event) => setReasonForDecline(event.target.value)}
                  isInvalid={Boolean(approvalErrors.reasonForDecline)}
                  placeholder="Application does not meet seller requirements"
                />
                <Form.Control.Feedback type="invalid">{approvalErrors.reasonForDecline}</Form.Control.Feedback>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline-secondary" onClick={closeDeclineModal}>
                Cancel
              </Button>
              <Button type="submit" variant="danger">
                Confirm Decline
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Container>
    </main>
  );
}

export default UserScreen;
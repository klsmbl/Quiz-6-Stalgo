import { Badge, Card, Col, Container, Row, Table } from "react-bootstrap";
import { useSelector } from "react-redux";

function UserProfile() {
  const currentUser = useSelector((state) => state.auth.currentUser);
  const orders = useSelector((state) => state.orders.orders).filter(
    (order) => order.userEmail === currentUser?.email,
  );

  return (
    <main className="app-page py-5">
      <Container>
        <div className="hero-panel mb-4">
          <Badge bg="dark" className="mb-3 px-3 py-2 text-uppercase hero-badge">
            User Profile
          </Badge>
          <h1 className="fw-bold mb-2">Account Overview</h1>
          <p className="text-muted mb-0 hero-copy">
            Review your profile information and track your service bookings.
          </p>
        </div>

        <Card className="auth-card border-0 shadow-sm mb-4">
          <Card.Body className="p-4">
            <h2 className="h5 mb-3">User Information</h2>
            <Row className="g-3">
              <Col md={6}>
                <div className="profile-item"><span>first name</span><strong>{currentUser?.firstName}</strong></div>
              </Col>
              <Col md={6}>
                <div className="profile-item"><span>last name</span><strong>{currentUser?.lastName}</strong></div>
              </Col>
              <Col md={6}>
                <div className="profile-item"><span>email</span><strong>{currentUser?.email}</strong></div>
              </Col>
              <Col md={6}>
                <div className="profile-item"><span>phone number</span><strong>{currentUser?.phoneNumber}</strong></div>
              </Col>
              <Col md={6}>
                <div className="profile-item"><span>location</span><strong>{currentUser?.location}</strong></div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card className="admin-card border-0 shadow-sm">
          <Card.Body className="p-4">
            <h2 className="h5 mb-3">Orders Table</h2>
            <div className="table-responsive">
              <Table className="admin-table align-middle mb-0">
                <thead>
                  <tr>
                    <th>order_id</th>
                    <th>service_name</th>
                    <th>price</th>
                    <th>status</th>
                    <th>date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center text-muted py-4">
                        No bookings found yet.
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.orderId}>
                        <td>{order.orderId}</td>
                        <td>{order.serviceName}</td>
                        <td>${Number(order.price).toFixed(2)}</td>
                        <td>{order.status}</td>
                        <td>{new Date(order.date).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </main>
  );
}

export default UserProfile;

import { Badge, Card, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import services from "../data/services";

function HomeScreen() {
  return (
    <main className="app-page py-5">
      <Container>
        <div className="hero-panel mb-5">
          <Badge bg="dark" className="mb-3 px-3 py-2 text-uppercase hero-badge">
            Carpet & Upholstery Marketplace
          </Badge>
          <h1 className="fw-bold">Find Trusted Cleaning Experts</h1>
          <p className="text-muted mb-0 hero-copy">
            Browse top-rated services for carpets, sofas, mattresses, and more.
          </p>
        </div>

        <Row className="g-4">
          {services.map((service) => (
            <Col key={service.id} sm={12} md={6} lg={4}>
              <Card as={Link} to={`/service/${service.id}`} className="service-card h-100 text-decoration-none border-0 shadow-sm">
                <Card.Img
                  variant="top"
                  src={service.sampleImage}
                  alt={service.serviceName}
                  style={{ height: "220px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title className="text-dark fs-5">
                    {service.serviceName}
                  </Card.Title>
                  <Card.Text className="text-muted" style={{ minHeight: "72px" }}>
                    {service.description}
                  </Card.Text>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-dark fw-semibold">Rating: {service.rating}</span>
                    <Badge bg="warning" text="dark">
                      ${service.price.toFixed(2)}
                    </Badge>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </main>
  );
}

export default HomeScreen;
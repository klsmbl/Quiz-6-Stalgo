import { Badge, Button, Card, Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function HomeScreen() {
  const catalogServices = useSelector((state) => state.services.catalogServices);
  const sellerServices = useSelector((state) => state.services.sellerServices);
  const services = [...catalogServices, ...sellerServices];

  return (
    <main className="app-page py-5">
      <Container>
        <section className="hero-panel mb-5">
          <Row className="align-items-center g-4">
            <Col lg={7}>
              <Badge bg="primary" className="mb-3 px-3 py-2 text-uppercase hero-badge">
                Trusted Home Service Marketplace
              </Badge>
              <h1 className="hero-title mb-3">
                Professional Carpet & Upholstery Cleaning Services
              </h1>
              <p className="text-muted mb-4 hero-copy">
                Find trusted experts to clean your carpets, sofas, and upholstery.
                Compare prices, ratings, and service duration in one place.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Button as={Link} to="/#services" variant="primary" size="lg" className="hero-btn-primary fw-semibold">
                  Book a Cleaning Service
                </Button>
                <Button as={Link} to="/apply-seller" variant="outline-primary" size="lg" className="fw-semibold">
                  Become a Seller
                </Button>
              </div>
            </Col>
            <Col lg={5}>
              <div className="hero-image-wrap">
                <img
                  src="/carpet%20cleaning.jpg"
                  alt="Professional carpet cleaning"
                  className="hero-image"
                />
              </div>
            </Col>
          </Row>
        </section>

        <section id="services">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
            <h2 className="section-title mb-0">Available Services</h2>
            <span className="text-muted">{services.length} services found</span>
          </div>

          <Row className="g-4">
          {services.map((service) => (
            <Col key={service.id} sm={12} md={6} lg={4}>
              <Card as={Link} to={`/service/${service.id}`} className="service-card h-100 text-decoration-none border-0 shadow-sm">
                <div className="service-image-wrap">
                  <Card.Img
                    variant="top"
                    src={service.sampleImage || service.image}
                    alt={service.serviceName}
                    style={{ height: "220px", objectFit: "cover" }}
                  />
                </div>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <Badge bg="success" className="service-rating-badge">
                      Rating: {service.rating || "New"}
                    </Badge>
                    <span className="service-price">${service.price.toFixed(2)}</span>
                  </div>
                  <Card.Title className="text-dark fs-5">
                    {service.serviceName}
                  </Card.Title>
                  <Card.Text className="text-muted" style={{ minHeight: "72px" }}>
                    {service.description}
                  </Card.Text>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-dark fw-semibold">Expert: {service.nameOfTheExpert || service.sellerName || "Marketplace Seller"}</span>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
          </Row>
        </section>
      </Container>
    </main>
  );
}

export default HomeScreen;
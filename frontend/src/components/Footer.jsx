import { Col, Container, Row } from "react-bootstrap";

function Footer() {
  return (
    <footer className="site-footer mt-auto py-5">
      <Container>
        <Row className="g-4 align-items-start">
          <Col md={6}>
            <p className="footer-kicker mb-2">Carpet & Upholstery Cleaning Services</p>
            <h2 className="h4 mb-3">Professional service discovery for homes and businesses.</h2>
            <p className="text-muted mb-0">
              Find trusted experts, review service details, and book cleaning appointments with confidence.
            </p>
          </Col>
          <Col md={3}>
            <h3 className="h6 text-uppercase mb-3">Marketplace</h3>
            <p className="text-muted mb-2">Browse Services</p>
            <p className="text-muted mb-2">Expert Applications</p>
            <p className="text-muted mb-0">Customer Accounts</p>
          </Col>
          <Col md={3}>
            <h3 className="h6 text-uppercase mb-3">Support</h3>
            <p className="text-muted mb-2">Secure PayPal checkout</p>
            <p className="text-muted mb-2">Order tracking</p>
            <p className="text-muted mb-0">Service assistance</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
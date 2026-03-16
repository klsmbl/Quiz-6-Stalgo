import { Button, Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { getServiceById } from "../data/services";

function buildPayPalCheckoutUrl(service) {
  const searchParams = new URLSearchParams({
    cmd: "_xclick",
    business: service.sellerPayPalEmail,
    item_name: service.serviceName,
    amount: service.price.toFixed(2),
    currency_code: "USD",
  });

  return `https://www.paypal.com/cgi-bin/webscr?${searchParams.toString()}`;
}

function DetailScreen() {
  const { id } = useParams();
  const service = getServiceById(id);

  if (!service) {
    return (
      <main className="app-page py-5">
        <Container>
          <Button as={Link} to="/" variant="outline-dark" className="mb-4">
            Back to Services
          </Button>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <h1 className="h3 mb-2">Service Not Found</h1>
              <p className="text-muted mb-0">
                The selected cleaning service could not be found.
              </p>
            </Card.Body>
          </Card>
        </Container>
      </main>
    );
  }

  const paypalCheckoutUrl = buildPayPalCheckoutUrl(service);

  return (
    <main className="app-page py-5">
      <Container>
        <Button as={Link} to="/" variant="outline-dark" className="mb-4">
          Back to Services
        </Button>

        <Row className="g-4 align-items-start">
          <Col lg={7}>
            <Card className="service-detail-card border-0 shadow-sm overflow-hidden">
              <Card.Img
                variant="top"
                src={service.sampleImage}
                alt={service.serviceName}
                style={{ height: "420px", objectFit: "cover" }}
              />
              <Card.Body className="p-4">
                <h1 className="h2 mb-3">{service.serviceName}</h1>
                <p className="text-muted mb-0">{service.description}</p>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={5}>
            <Card className="detail-sidebar border-0 shadow-sm">
              <Card.Body className="p-4">
                <h2 className="h4 mb-3">Service Details</h2>
                <ListGroup variant="flush">
                  <ListGroup.Item className="px-0 d-flex justify-content-between">
                    <span className="fw-semibold">Rating</span>
                    <span>{service.rating}</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="px-0 d-flex justify-content-between">
                    <span className="fw-semibold">Price</span>
                    <span>${service.price.toFixed(2)}</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="px-0 d-flex justify-content-between">
                    <span className="fw-semibold">Duration</span>
                    <span>{service.durationOfService}</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="px-0 d-flex justify-content-between">
                    <span className="fw-semibold">Expert</span>
                    <span>{service.nameOfTheExpert}</span>
                  </ListGroup.Item>
                </ListGroup>

                <Button
                  as="a"
                  href={paypalCheckoutUrl}
                  target="_blank"
                  rel="noreferrer"
                  variant="warning"
                  size="lg"
                  className="w-100 mt-4 fw-semibold"
                >
                  Book Service
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
}

export default DetailScreen;
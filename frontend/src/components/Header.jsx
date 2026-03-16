import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";

function Header() {
  return (
    <header className="site-header">
      <Navbar expand="lg" className="site-navbar py-3">
        <Container>
          <Navbar.Brand as={Link} to="/" className="site-brand">
            CleanLink Marketplace
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navigation" />
          <Navbar.Collapse id="main-navigation">
            <Nav className="ms-auto align-items-lg-center gap-lg-2">
              <Nav.Link as={NavLink} to="/" end>
                Home
              </Nav.Link>
              <Nav.Link as={NavLink} to="/apply-seller">
                Apply as Expert
              </Nav.Link>
              <Nav.Link as={NavLink} to="/signin">
                Sign In
              </Nav.Link>
              <Button as={Link} to="/signup" variant="warning" className="fw-semibold px-4 ms-lg-2">
                Register
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;
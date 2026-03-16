import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { signOut } from "../redux/actions/authActions";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.currentUser);

  function handleSignOut() {
    dispatch(signOut());
    navigate("/signin");
  }

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
              {currentUser ? (
                <Nav.Link as={NavLink} to="/profile">
                  Profile
                </Nav.Link>
              ) : null}
              {currentUser?.role === "Admin" ? (
                <Nav.Link as={NavLink} to="/admin/users">
                  Admin Panel
                </Nav.Link>
              ) : null}
              {currentUser?.role === "Seller" ? (
                <Nav.Link as={NavLink} to="/seller/dashboard">
                  Seller Dashboard
                </Nav.Link>
              ) : null}
              {currentUser ? (
                <>
                  <Navbar.Text className="header-user-label ms-lg-3 me-lg-2">
                    {currentUser.firstName} {currentUser.lastName} · {currentUser.role}
                  </Navbar.Text>
                  <Button variant="outline-dark" className="fw-semibold px-4" onClick={handleSignOut}>
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Nav.Link as={NavLink} to="/signin">
                    Sign In
                  </Nav.Link>
                  <Button as={Link} to="/signup" variant="warning" className="fw-semibold px-4 ms-lg-2">
                    Register
                  </Button>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;
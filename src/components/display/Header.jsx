import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Header = ({ name }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    content: "",
  });

  const onClickHandler = (e) => {
    e.preventDefault();
    if (formData.content) {
      navigate("/searchresultpage", { state: formData.content });
    }
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Navbar bg="light" expand="lg" sticky="top" style={{fontFamily:"sans-serif"}}>
      <Container fluid>
        <Navbar.Brand>{name}</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px", fontSize:"large" }}
            navbarScroll
          >
            <Nav.Link href="#feed">Feed</Nav.Link>
            <Nav.Link href="/addnewpost">New...</Nav.Link>
            <Nav.Link href="/chatlist">Messages</Nav.Link>
            <NavDropdown title="Me" id="navbarScrollingDropdown">
              <NavDropdown.Item href="/myposts">My Posts</NavDropdown.Item>
              <NavDropdown.Item href="#myinvolvement">Commented On...</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="/about">About</Nav.Link>
            <Nav.Link href="/signout">Logout/Login</Nav.Link>
          </Nav>
          <Form style={{ display: "flex", alignItems: "center" }}>
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
              name="content"
              value={formData.content}
              onChange={onChange}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  onClickHandler(event);
                }
              }}
            />
            <Button
              variant="outline-success"
              onClick={onClickHandler}
              className="me-2"
            >
              Search
            </Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;

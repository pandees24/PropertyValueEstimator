import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const Header = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>Property Value Estimator</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/">
              <Nav.Link>Search</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/map">
              <Nav.Link>Map View</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/compare">
              <Nav.Link>Compare</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/trends">
              <Nav.Link>Price Trends</Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;

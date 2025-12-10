import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-light mt-5 py-4">
      <Container>
        <Row>
          <Col md={6}>
            <h5>Property Value Estimator</h5>
            <p>Advanced property valuation powered by machine learning</p>
          </Col>
          <Col md={6} className="text-md-end">
            <p>&copy; 2024 Property Value Estimator. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;

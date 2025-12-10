import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import axios from 'axios';

const PropertySearch = () => {
  const [searchParams, setSearchParams] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    propertyType: 'house',
    bedrooms: '',
    bathrooms: ''
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/properties/search', searchParams);
      setResults(response.data);
    } catch (err) {
      setError('Failed to search properties. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEstimate = async (property) => {
    try {
      const response = await axios.post('http://localhost:5000/api/estimate', {
        location: property.location,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        sqft: property.sqft,
        propertyType: property.propertyType
      });
      // Update property with estimated value
      setResults(prev => prev.map(p =>
        p.id === property.id ? { ...p, estimatedValue: response.data.estimatedValue } : p
      ));
    } catch (err) {
      console.error('Estimation error:', err);
    }
  };

  return (
    <Container className="py-4">
      <Row>
        <Col lg={4}>
          <Card className="mb-4">
            <Card.Header>
              <h4>Property Search</h4>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSearch}>
                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={searchParams.location}
                    onChange={handleInputChange}
                    placeholder="Enter city or zip code"
                    required
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Min Price</Form.Label>
                      <Form.Control
                        type="number"
                        name="minPrice"
                        value={searchParams.minPrice}
                        onChange={handleInputChange}
                        placeholder="0"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Max Price</Form.Label>
                      <Form.Control
                        type="number"
                        name="maxPrice"
                        value={searchParams.maxPrice}
                        onChange={handleInputChange}
                        placeholder="1000000"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Property Type</Form.Label>
                  <Form.Select
                    name="propertyType"
                    value={searchParams.propertyType}
                    onChange={handleInputChange}
                  >
                    <option value="house">House</option>
                    <option value="apartment">Apartment</option>
                    <option value="condo">Condo</option>
                    <option value="townhouse">Townhouse</option>
                  </Form.Select>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Bedrooms</Form.Label>
                      <Form.Control
                        type="number"
                        name="bedrooms"
                        value={searchParams.bedrooms}
                        onChange={handleInputChange}
                        min="0"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Bathrooms</Form.Label>
                      <Form.Control
                        type="number"
                        name="bathrooms"
                        value={searchParams.bathrooms}
                        onChange={handleInputChange}
                        min="0"
                        step="0.5"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? 'Searching...' : 'Search Properties'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          {error && <Alert variant="danger">{error}</Alert>}

          <div className="results">
            <h4>Search Results ({results.length})</h4>
            {results.map((property) => (
              <Card key={property.id} className="mb-3">
                <Card.Body>
                  <Row>
                    <Col md={8}>
                      <h5>{property.address}</h5>
                      <p className="text-muted">{property.location}</p>
                      <p>
                        {property.bedrooms} bed • {property.bathrooms} bath • {property.sqft} sqft
                      </p>
                      <p className="text-primary fw-bold">
                        Listed: ${property.price?.toLocaleString()}
                      </p>
                      {property.estimatedValue && (
                        <p className="text-success fw-bold">
                          Estimated: ${property.estimatedValue?.toLocaleString()}
                        </p>
                      )}
                    </Col>
                    <Col md={4} className="text-end">
                      <Button
                        variant="outline-primary"
                        onClick={() => handleEstimate(property)}
                        className="mb-2"
                      >
                        Get Estimate
                      </Button>
                      <br />
                      <Button variant="outline-secondary">
                        View Details
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default PropertySearch;

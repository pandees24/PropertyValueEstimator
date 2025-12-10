import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import axios from 'axios';

const PriceTrends = () => {
  const [trendsData, setTrendsData] = useState([]);
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('house');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load default trends data
    fetchTrendsData();
  }, []);

  const fetchTrendsData = async (searchLocation = '', searchPropertyType = 'house') => {
    setLoading(true);
    setError('');

    try {
      const params = {};
      if (searchLocation) params.location = searchLocation;
      if (searchPropertyType) params.propertyType = searchPropertyType;

      const response = await axios.get('http://localhost:5000/api/trends', { params });
      setTrendsData(response.data);
    } catch (err) {
      setError('Failed to fetch price trends. Please try again.');
      console.error('Trends error:', err);
      // Set sample data for demonstration
      setTrendsData([
        { month: 'Jan', averagePrice: 450000, medianPrice: 420000, sales: 25 },
        { month: 'Feb', averagePrice: 460000, medianPrice: 430000, sales: 30 },
        { month: 'Mar', averagePrice: 455000, medianPrice: 425000, sales: 28 },
        { month: 'Apr', averagePrice: 470000, medianPrice: 440000, sales: 35 },
        { month: 'May', averagePrice: 475000, medianPrice: 445000, sales: 32 },
        { month: 'Jun', averagePrice: 480000, medianPrice: 450000, sales: 38 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTrendsData(location, propertyType);
  };

  const formatCurrency = (value) => {
    return `$${value?.toLocaleString()}`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow">
          <p className="mb-1"><strong>{label}</strong></p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="mb-0">
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h4>Price Trends Analysis</h4>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSearch} className="mb-4">
                <Row>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Location</Form.Label>
                      <Form.Control
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Enter city or leave empty for all"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Property Type</Form.Label>
                      <Form.Select
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value)}
                      >
                        <option value="house">House</option>
                        <option value="apartment">Apartment</option>
                        <option value="condo">Condo</option>
                        <option value="townhouse">Townhouse</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4} className="d-flex align-items-end">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={loading}
                      className="w-100"
                    >
                      {loading ? 'Loading...' : 'Update Trends'}
                    </Button>
                  </Col>
                </Row>
              </Form>

              {error && <Alert variant="danger">{error}</Alert>}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Header>
              <h4>Price Trends Over Time</h4>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={trendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={formatCurrency} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="averagePrice"
                    stroke="#8884d8"
                    strokeWidth={2}
                    name="Average Price"
                  />
                  <Line
                    type="monotone"
                    dataKey="medianPrice"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    name="Median Price"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="mb-4">
            <Card.Header>
              <h4>Monthly Sales Volume</h4>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={trendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#ffc658" name="Sales" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h4>Market Summary</h4>
            </Card.Header>
            <Card.Body>
              {trendsData.length > 0 && (
                <>
                  <p><strong>Current Average:</strong> {formatCurrency(trendsData[trendsData.length - 1]?.averagePrice)}</p>
                  <p><strong>Current Median:</strong> {formatCurrency(trendsData[trendsData.length - 1]?.medianPrice)}</p>
                  <p><strong>Monthly Sales:</strong> {trendsData[trendsData.length - 1]?.sales}</p>
                  <p>
                    <strong>Trend:</strong>{' '}
                    {trendsData.length > 1 && (
                      <span className={
                        trendsData[trendsData.length - 1].averagePrice > trendsData[trendsData.length - 2].averagePrice
                          ? 'text-success'
                          : 'text-danger'
                      }>
                        {trendsData[trendsData.length - 1].averagePrice > trendsData[trendsData.length - 2].averagePrice
                          ? '↗️ Rising'
                          : '↘️ Falling'
                        }
                      </span>
                    )}
                  </p>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PriceTrends;

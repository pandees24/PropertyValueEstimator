import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapView = () => {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState([40.7128, -74.0060]); // Default to NYC

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/properties');
      setProperties(response.data);

      // Calculate center based on properties
      if (response.data.length > 0) {
        const avgLat = response.data.reduce((sum, p) => sum + p.latitude, 0) / response.data.length;
        const avgLng = response.data.reduce((sum, p) => sum + p.longitude, 0) / response.data.length;
        setMapCenter([avgLat, avgLng]);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
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
      setSelectedProperty({ ...property, estimatedValue: response.data.estimatedValue });
    } catch (error) {
      console.error('Estimation error:', error);
    }
  };

  if (loading) {
    return (
      <Container className="py-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row>
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Header>
              <h4>Property Map</h4>
            </Card.Header>
            <Card.Body className="p-0">
              <div style={{ height: '600px', width: '100%' }}>
                <MapContainer
                  center={mapCenter}
                  zoom={10}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  {properties.map((property) => (
                    <Marker
                      key={property.id}
                      position={[property.latitude, property.longitude]}
                      eventHandlers={{
                        click: () => setSelectedProperty(property),
                      }}
                    >
                      <Popup>
                        <div>
                          <h6>{property.address}</h6>
                          <p>{property.location}</p>
                          <p>{property.bedrooms} bed • {property.bathrooms} bath</p>
                          <p className="fw-bold">${property.price?.toLocaleString()}</p>
                          <Button
                            size="sm"
                            onClick={() => handleEstimate(property)}
                          >
                            Get Estimate
                          </Button>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="mb-4">
            <Card.Header>
              <h4>Property Details</h4>
            </Card.Header>
            <Card.Body>
              {selectedProperty ? (
                <div>
                  <h5>{selectedProperty.address}</h5>
                  <p className="text-muted">{selectedProperty.location}</p>
                  <hr />
                  <p><strong>Type:</strong> {selectedProperty.propertyType}</p>
                  <p><strong>Bedrooms:</strong> {selectedProperty.bedrooms}</p>
                  <p><strong>Bathrooms:</strong> {selectedProperty.bathrooms}</p>
                  <p><strong>Square Feet:</strong> {selectedProperty.sqft}</p>
                  <p><strong>Listed Price:</strong> ${selectedProperty.price?.toLocaleString()}</p>
                  {selectedProperty.estimatedValue && (
                    <p><strong>Estimated Value:</strong> ${selectedProperty.estimatedValue?.toLocaleString()}</p>
                  )}
                  <Button
                    variant="primary"
                    className="w-100 mt-3"
                    onClick={() => handleEstimate(selectedProperty)}
                  >
                    Get New Estimate
                  </Button>
                </div>
              ) : (
                <p className="text-muted">Click on a property marker to view details</p>
              )}
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h4>Map Statistics</h4>
            </Card.Header>
            <Card.Body>
              <p><strong>Total Properties:</strong> {properties.length}</p>
              <p><strong>Average Price:</strong> $
                {properties.length > 0
                  ? Math.round(properties.reduce((sum, p) => sum + p.price, 0) / properties.length).toLocaleString()
                  : 0
                }
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MapView;

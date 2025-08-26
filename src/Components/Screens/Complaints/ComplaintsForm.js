import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Card, Row, Col, Alert, Container } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from "../../AuthContext/AuthContext";
import baseURL from '../../ApiUrl/Apiurl';
import NavScreen from '../../Screens/Navbar/Navbar';
import "./ComplaintsForm.css";

const ComplaintForm = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { service_request, company, customer } = location.state || {};

  // ✅ Dropdown choices
  const COMPLAINT_TYPE_CHOICES = ['Service Delay', 'Engineer Behavior', 'Spare Issue', 'Other'];
  const STATUS_CHOICES = ['Open', 'In Progress', 'Resolved', 'Closed'];
  const ESCALATION_LEVEL_CHOICES = ['None', 'Service Manager', 'GM'];

  const [formData, setFormData] = useState({
    complaint_type: '',
    complaint_details: '',
    status: 'Open',
    escalation_level: 'None',
    service_manager_email: '',
    gm_email: '',
    resolution_details: '',
    service_request: service_request || '',
    company: company || (user?.company_id || ''),
    customer: customer || (user?.customer_id || ''),
    created_by: user?.customer_id || '',
    updated_by: user?.customer_id || ''
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('success');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(`${baseURL}/customer-complaints/`, formData, {
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (response.status === 201) {
        setAlertVariant('success');
        setAlertMessage('🎉 Customer Complaint Submitted Successfully!');
        setShowAlert(true);

        // Auto redirect after 2s
        setTimeout(() => navigate('/request'), 2000);
      }
    } catch (error) {
      setAlertVariant('danger');
      setAlertMessage('❌ Failed to submit complaint. Please try again.');
      setShowAlert(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="complaint-form-page">
      <NavScreen className="navbar-fixed" />

      <div className="complaint-form-wrapper">
        <Container className="d-flex justify-content-center h-100">
          <Card className="complaint-form-card shadow-sm w-100">
            
            {/* ✅ Heading */}
            <Card.Header className="bg-white border-0 pb-0">
              <h3 className="fw-bold text-center text-primary m-0">
                Customer Complaints
              </h3>
            </Card.Header>

            <Card.Body className="form-scroll p-4">
              {showAlert && (
                <Alert 
                  variant={alertVariant} 
                  onClose={() => setShowAlert(false)} 
                  dismissible 
                  className="fw-semibold text-center"
                >
                  {alertMessage}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold">Complaint Type</Form.Label>
                      <Form.Select
                        name="complaint_type"
                        value={formData.complaint_type}
                        onChange={handleChange}
                        required
                      >
                        <option value="">-- Select Complaint Type --</option>
                        {COMPLAINT_TYPE_CHOICES.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold">Status</Form.Label>
                      <Form.Select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        required
                      >
                        {STATUS_CHOICES.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Complaint Details</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="complaint_details"
                    placeholder="Please provide detailed information..."
                    value={formData.complaint_details}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Escalation Level</Form.Label>
                  <Form.Select
                    name="escalation_level"
                    value={formData.escalation_level}
                    onChange={handleChange}
                    required
                  >
                    {ESCALATION_LEVEL_CHOICES.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold">Service Manager Email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="manager@example.com"
                        name="service_manager_email"
                        value={formData.service_manager_email}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold">GM Email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="gm@example.com"
                        name="gm_email"
                        value={formData.gm_email}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">Resolution Details (Optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="resolution_details"
                    placeholder="If you have any suggested resolution..."
                    value={formData.resolution_details}
                    onChange={handleChange}
                  />
                </Form.Group>

                <div className="d-flex justify-content-between">
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => navigate('/request')}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="primary" 
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </div>
  );
};

export default ComplaintForm;

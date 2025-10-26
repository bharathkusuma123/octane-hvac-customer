import React, { useState, useContext, useEffect } from 'react';
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
  const { service_request, company, customer, request_status } = location.state || {};

  // ✅ Dropdown choices
  const COMPLAINT_TYPE_CHOICES = ['Service Delay', 'Engineer Behavior', 'Spare Issue', 'Other'];
  const ESCALATION_LEVEL_CHOICES = ['None', 'Service Manager', 'GM'];

  const [formData, setFormData] = useState({ 
    complaint_type: '',
    complaint_details: '',
    status: request_status || 'Open',
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

  const [companyData, setCompanyData] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('success');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingCompany, setLoadingCompany] = useState(false);

  // Fetch company details when component mounts or company changes
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      const companyId = company || user?.company_id;
      
      if (!companyId) {
        console.warn('⚠️ No company ID available');
        return;
      }

      setLoadingCompany(true);
      try {
        console.log(`🔄 Fetching company details for ID: ${companyId}`);
        const response = await axios.get(
          `${baseURL}/companies/${companyId}/`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          }
        );

        if (response.data.status === 'success') {
          console.log('✅ Company details fetched successfully:', response.data.data);
          setCompanyData(response.data.data);
        } else {
          console.warn('⚠️ Unexpected response format:', response.data);
        }
      } catch (error) {
        console.error('❌ Error fetching company details:', error);
        if (error.response) {
          console.error('❌ Server responded with:', error.response.data);
        }
      } finally {
        setLoadingCompany(false);
      }
    };

    fetchCompanyDetails();
  }, [company, user?.company_id]);

  // Update escalation emails when escalation level or company data changes
  useEffect(() => {
    if (!companyData) return;

    let service_manager_email = '';
    let gm_email = '';

    switch (formData.escalation_level) {
      case 'Service Manager':
        service_manager_email = companyData.service_email || '';
        break;
      case 'GM':
        gm_email = companyData.gm_email || '';
        break;
      default:
        // For 'None' or any other value, clear both emails
        service_manager_email = '';
        gm_email = '';
        break;
    }

    setFormData(prev => ({
      ...prev,
      service_manager_email,
      gm_email
    }));

    console.log(`🔄 Escalation level changed to: ${formData.escalation_level}`);
    console.log(`📧 Service Manager Email: ${service_manager_email}`);
    console.log(`📧 GM Email: ${gm_email}`);

  }, [formData.escalation_level, companyData]);

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

    // Prepare payload with appropriate escalation emails
    const payload = {
      ...formData,
      user_id: user?.customer_id,
      company_id: user?.company_id,
      // Ensure only the relevant email is sent based on escalation level
      service_manager_email: formData.escalation_level === 'Service Manager' ? formData.service_manager_email : '',
      gm_email: formData.escalation_level === 'GM' ? formData.gm_email : ''
    };

    console.log('🚀 Submitting customer complaint...');
    console.log('📝 Payload being sent:', payload);
    console.log('🏢 Company Data:', companyData);

    try {
      const response = await axios.post(
        `${baseURL}/customer-complaints/`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        }
      );

      console.log('✅ Response received:', response);

      if (response.status === 201) {
        console.log('🎉 Complaint submitted successfully!');
        setAlertVariant('success');
        setAlertMessage('🎉 Customer Complaint Submitted Successfully!');
        setShowAlert(true);

        setTimeout(() => {
          console.log('🔀 Redirecting to /request...');
          navigate('/request');
        }, 2000);
      } else {
        console.warn('⚠️ Unexpected response status:', response.status);
      }
    } catch (error) {
      console.error('❌ Error submitting complaint:', error);
      if (error.response) {
        console.error('❌ Server responded with:', error.response.data);
      }
      setAlertVariant('danger');
      setAlertMessage('❌ Failed to submit complaint. Please try again.');
      setShowAlert(true);
    } finally {
      setIsSubmitting(false);
      console.log('🟡 Submission process completed.');
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
              {companyData && (
                <p className="text-center text-muted mb-0 mt-2">
                  Company: <strong>{companyData.company_name}</strong>
                </p>
              )}
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

              {loadingCompany && (
                <Alert variant="info" className="fw-semibold text-center">
                  🔄 Loading company details...
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
                      <Form.Label className="fw-semibold">Complaint Status</Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.status}
                        readOnly
                        className="bg-light"
                      />
                      <Form.Text className="text-muted">
                        Status inherited from service request
                      </Form.Text>
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
                  
                  {/* Display escalation email information */}
                  {formData.escalation_level === 'Service Manager' && formData.service_manager_email && (
                    <Form.Text className="text-success">
                      📧 Will be escalated to: <strong>{formData.service_manager_email}</strong>
                    </Form.Text>
                  )}
                  {formData.escalation_level === 'GM' && formData.gm_email && (
                    <Form.Text className="text-success">
                      📧 Will be escalated to: <strong>{formData.gm_email}</strong>
                    </Form.Text>
                  )}
                  {formData.escalation_level === 'None' && (
                    <Form.Text className="text-muted">
                      No email escalation will be sent
                    </Form.Text>
                  )}
                </Form.Group>

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
                    disabled={isSubmitting || loadingCompany}
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
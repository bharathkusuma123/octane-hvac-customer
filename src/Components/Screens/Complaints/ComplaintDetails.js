import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Button, Row, Col, Badge } from 'react-bootstrap';

const ComplaintDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { complaintData } = location.state || {};

  if (!complaintData) {
    return (
      <div className="container mt-4">
        <Card>
          <Card.Body>
            <h3>No Complaint Data Found</h3>
            <Button variant="primary" onClick={() => navigate(-1)}>
              Go Back
            </Button>
          </Card.Body>
        </Card>
      </div>
    );
  }

  const formatToIndianDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      
      return `${day}-${month}-${year} ${hours}:${minutes}`;
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'open': return 'warning';
      case 'in progress': return 'primary';
      case 'resolved': return 'success';
      case 'closed': return 'secondary';
      default: return 'light';
    }
  };

  return (
    <div className="container mt-4">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Complaint Details</h4>
          <Button variant="light" onClick={() => navigate(-1)}>
            Back to Requests
          </Button>
        </Card.Header>
        <Card.Body>
          <Row className="mb-4">
            <Col md={6}>
              <h5 className="text-primary">Complaint Information</h5>
              <p><strong>Complaint ID:</strong> {complaintData.complaint_id}</p>
              <p><strong>Service Request ID:</strong> {complaintData.service_request}</p>
              <p><strong>Complaint Type:</strong> {complaintData.complaint_type}</p>
              <p><strong>Status:</strong> 
                <Badge bg={getStatusVariant(complaintData.status)} className="ms-2">
                  {complaintData.status}
                </Badge>
              </p>
            </Col>
            <Col md={6}>
              <h5 className="text-primary">Timeline</h5>
              <p><strong>Complaint Date:</strong> {formatToIndianDate(complaintData.complaint_date)}</p>
              <p><strong>Created At:</strong> {formatToIndianDate(complaintData.created_at)}</p>
              <p><strong>Updated At:</strong> {formatToIndianDate(complaintData.updated_at)}</p>
              {complaintData.resolved_at && (
                <p><strong>Resolved At:</strong> {formatToIndianDate(complaintData.resolved_at)}</p>
              )}
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={12}>
              <h5 className="text-primary">Complaint Details</h5>
              <Card>
                <Card.Body>
                  <p className="mb-0">{complaintData.complaint_details || 'No details provided'}</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={6}>
              <h5 className="text-primary">Escalation Information</h5>
              <p><strong>Escalation Level:</strong> {complaintData.escalation_level || 'N/A'}</p>
              <p><strong>Service Manager Email:</strong> {complaintData.service_manager_email || 'N/A'}</p>
              <p><strong>GM Email:</strong> {complaintData.gm_email || 'N/A'}</p>
            </Col>
            <Col md={6}>
              <h5 className="text-primary">Resolution Details</h5>
              <Card>
                <Card.Body>
                  <p className="mb-0">{complaintData.resolution_details || 'No resolution details available yet'}</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* <Row>
            <Col md={12}>
              <h5 className="text-primary">User Information</h5>
              <p><strong>Created By:</strong> {complaintData.created_by}</p>
              <p><strong>Updated By:</strong> {complaintData.updated_by}</p>
              <p><strong>Customer ID:</strong> {complaintData.customer}</p>
              <p><strong>Company ID:</strong> {complaintData.company}</p>
            </Col>
          </Row> */}
        </Card.Body>
        <Card.Footer className="bg-light">
          <div className="d-flex justify-content-end">
            <Button variant="primary" onClick={() => navigate(-1)}>
              Back to Requests
            </Button>
          </div>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default ComplaintDetails;
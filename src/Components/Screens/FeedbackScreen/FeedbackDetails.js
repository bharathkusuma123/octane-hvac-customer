import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Button, Row, Col, Badge, ListGroup } from 'react-bootstrap';

const FeedbackDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { feedbackData } = location.state || {};

  if (!feedbackData) {
    return (
      <div className="container mt-4">
        <Card>
          <Card.Body>
            <h3>No Feedback Data Found</h3>
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

  const getRatingColor = (rating) => {
    const ratingNum = parseInt(rating);
    if (ratingNum >= 4) return 'success';
    if (ratingNum >= 3) return 'warning';
    return 'danger';
  };

  const getRatingText = (rating) => {
    const ratingNum = parseInt(rating);
    switch (ratingNum) {
      case 1: return 'Very Poor';
      case 2: return 'Poor';
      case 3: return 'Average';
      case 4: return 'Good';
      case 5: return 'Excellent';
      default: return 'Not Rated';
    }
  };

  return (
    <div className="container mt-4">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Feedback Details</h4>
          <Button variant="light" onClick={() => navigate(-1)}>
            Back to Requests
          </Button>
        </Card.Header>
        <Card.Body>
          <Row className="mb-4">
            <Col md={6}>
              <h5 className="text-primary">Feedback Information</h5>
              <p><strong>Survey ID:</strong> {feedbackData.survey_id}</p>
              <p><strong>Service Request ID:</strong> {feedbackData.service_request}</p>
              <p><strong>Total Questions:</strong> {feedbackData.questions?.length || 0}</p>
              <p><strong>Total Responses:</strong> {feedbackData.responses?.length || 0}</p>
            </Col>
            <Col md={6}>
              <h5 className="text-primary">Timeline</h5>
              <p><strong>Submitted At:</strong> {formatToIndianDate(feedbackData.submitted_at)}</p>
              <p><strong>Created At:</strong> {formatToIndianDate(feedbackData.created_at)}</p>
              <p><strong>Updated At:</strong> {formatToIndianDate(feedbackData.updated_at)}</p>
            </Col>
          </Row>

          {feedbackData.suggestions && (
            <Row className="mb-4">
              <Col md={12}>
                <h5 className="text-primary">Customer Suggestions</h5>
                <Card>
                  <Card.Body>
                    <p className="mb-0">{feedbackData.suggestions}</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          <Row className="mb-4">
            <Col md={12}>
              <h5 className="text-primary">Question Responses</h5>
              {feedbackData.responses && feedbackData.responses.length > 0 ? (
                <ListGroup>
                  {feedbackData.responses.map((response, index) => (
                    <ListGroup.Item key={response.response_id || index}>
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <h6 className="mb-1">Question: {response.question}</h6>
                          {response.reason && (
                            <p className="mb-1"><strong>Reason:</strong> {response.reason}</p>
                          )}
                          <small className="text-muted">
                            Response ID: {response.response_id}
                          </small>
                        </div>
                        <div className="text-end ms-3">
                          <Badge bg={getRatingColor(response.rating_response)} className="fs-6">
                            Rating: {response.rating_response}/5
                          </Badge>
                          <div className="small text-muted mt-1">
                            {getRatingText(response.rating_response)}
                          </div>
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <Card>
                  <Card.Body>
                    <p className="text-center mb-0">No responses available</p>
                  </Card.Body>
                </Card>
              )}
            </Col>
          </Row>
{/* 
          <Row>
            <Col md={12}>
              <h5 className="text-primary">User Information</h5>
              <p><strong>Created By:</strong> {feedbackData.created_by}</p>
              <p><strong>Updated By:</strong> {feedbackData.updated_by}</p>
              <p><strong>Customer ID:</strong> {feedbackData.customer}</p>
              <p><strong>Company ID:</strong> {feedbackData.company}</p>
              {feedbackData.service_engineer && (
                <p><strong>Service Engineer:</strong> {feedbackData.service_engineer}</p>
              )}
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

export default FeedbackDetails;
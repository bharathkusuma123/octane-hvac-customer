import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from "../../Components/AuthContext/AuthContext";
import baseURL from './../../Components/ApiUrl/Apiurl';
import { useNavigate } from 'react-router-dom';
import DelegateNavbar from "../DelegateNavbar/DelegateNavbar";
import { Card, Button, Form, Row, Col } from 'react-bootstrap';

const RequestScreenDelegate = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [closedRequestIds, setClosedRequestIds] = useState([]);
  const [submittedFeedbackRequests, setSubmittedFeedbackRequests] = useState([]);
  const [submittedComplaintRequests, setSubmittedComplaintRequests] = useState([]);
  const [complaintsData, setComplaintsData] = useState([]);
  const [feedbackData, setFeedbackData] = useState([]);

  const { user } = useContext(AuthContext);
  const company_id = user?.company_id;
  const delegate_id = user?.delegate_id;
  const navigate = useNavigate();

  // Function to format date to Indian format (dd-mm-yyyy)
  const formatToIndianDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      
      return `${day}-${month}-${year}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  // Function to format datetime to Indian format with time
  const formatToIndianDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      
      return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  // Fetch service requests for the delegate
  useEffect(() => {
    if (company_id && delegate_id) {
      axios.get(`${baseURL}/service-pools/?company_id=${company_id}&user_id=${delegate_id}`)
        .then((response) => {
          const responseData = response.data;
          let requestsArray = [];
          
          if (Array.isArray(responseData)) {
            requestsArray = responseData;
          } else if (responseData && Array.isArray(responseData.data)) {
            requestsArray = responseData.data;
          }
          
          const sortedRequests = requestsArray.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );

          setRequests(sortedRequests);
          setFilteredRequests(sortedRequests);
          
          // Get closed request IDs
          const closedIds = sortedRequests
            .filter(req => (req.status || req.request_status || req.state || req.ServiceStatus)?.toLowerCase() === 'closed')
            .map(req => req.request_id);

          setClosedRequestIds(closedIds);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching service requests:', error);
          setLoading(false);
        });
    }
  }, [company_id, delegate_id]);

  // Fetch survey data to check for submitted feedback
  useEffect(() => {
    if (delegate_id) {
      axios.get(`${baseURL}/customer-surveys/?user_id=${delegate_id}&company_id=${company_id}`)
        .then((response) => {
          try {
            // Handle different response structures
            const data = Array.isArray(response.data) ? response.data : 
                        (response.data?.data && Array.isArray(response.data.data) ? response.data.data : []);
            
            const feedbackSubmittedRequests = data.map(
              survey => survey.service_request
            );
            setSubmittedFeedbackRequests(feedbackSubmittedRequests);
            setFeedbackData(data);
          } catch (error) {
            console.error('Error processing survey data:', error);
            setSubmittedFeedbackRequests([]);
            setFeedbackData([]);
          }
        })
        .catch((error) => {
          console.error('Error fetching survey data:', error);
          setSubmittedFeedbackRequests([]);
          setFeedbackData([]);
        });
    }
  }, [delegate_id, company_id]);

  // Fetch complaints data for delegate
  useEffect(() => {
    if (delegate_id) {
      axios.get(`${baseURL}/customer-complaints/?user_id=${delegate_id}&company_id=${company_id}`)
        .then((response) => {
          try {
            const data = Array.isArray(response.data) ? response.data : 
                        (response.data?.data && Array.isArray(response.data.data) ? response.data.data : []);
            
            // Extract service_request IDs from complaints to track which requests have complaints submitted
            const complaintRequestIds = data.map(complaint => complaint.service_request);
            setSubmittedComplaintRequests(complaintRequestIds);
            setComplaintsData(data);
          } catch (error) {
            console.error('Error processing complaints data:', error);
            setSubmittedComplaintRequests([]);
            setComplaintsData([]);
          }
        })
        .catch((error) => {
          console.error('Error fetching complaints data:', error);
          setSubmittedComplaintRequests([]);
          setComplaintsData([]);
        });
    }
  }, [delegate_id, company_id]);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredRequests(requests);
    } else {
      const filtered = requests.filter(request => 
        String(request.request_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(request.service_item).toLowerCase().includes(searchTerm.toLowerCase()) ||
        formatToIndianDate(request.preferred_date).toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(request.preferred_time).toLowerCase().includes(searchTerm.toLowerCase()) ||
        (request.request_details && String(request.request_details).toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredRequests(filtered);
    }
    setCurrentPage(1);
  }, [searchTerm, requests]);

  const handleComplaintClick = (requestId) => {
    navigate('/delegate-complaint-form', { 
      state: { 
        service_request: requestId,
        company: company_id,
        delegate: delegate_id
      } 
    });
  };

  const handleViewComplaint = (requestId) => {
    // Find the complaint for this service request
    const complaint = complaintsData.find(comp => comp.service_request === requestId);
    if (complaint) {
      navigate('/complaint-details', { 
        state: { 
          complaintData: complaint 
        } 
      });
    }
  };

  const handleViewFeedback = (requestId) => {
    // Find the feedback for this service request
    const feedback = feedbackData.find(fb => fb.service_request === requestId);
    if (feedback) {
      navigate('/feedback-details', { 
        state: { 
          feedbackData: feedback 
        } 
      });
    }
  };

  const totalPages = Math.ceil(filteredRequests.length / rowsPerPage);
  const paginatedData = filteredRequests.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRaiseRequest = () => {
    navigate('/delegate-request');
  };

  // Check if complaint is submitted for a request
  const isComplaintSubmitted = (requestId) => {
    return submittedComplaintRequests.includes(requestId);
  };

  // Check if feedback is submitted for a request
  const isFeedbackSubmitted = (requestId) => {
    return submittedFeedbackRequests.includes(requestId);
  };

  if (loading) {
    return <div className="text-center mt-4">Loading requests...</div>;
  }

  return (
    <div className="request-screen-wrapper">
      <DelegateNavbar/>
      <h2 className="text-center mb-4">Request Screen</h2>

      <Card className="toolbar-card shadow-sm p-3 mb-4">
        <Row className="align-items-center g-3">
          <Col xs="auto">
            <Form.Label className="mb-0 fw-semibold">Show:</Form.Label>
          </Col>
          <Col xs="auto">
            <Form.Select
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              className="rows-select"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
            </Form.Select>
          </Col>

          {/* Raise Request Button */}
          <Col xs="auto">
            <Button variant="primary" onClick={handleRaiseRequest}>
              Raise Request
            </Button>
          </Col>

          <Col className="ms-auto">
            <Form.Control
              type="text"
              placeholder="Search by ID, Service, Date..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </Col>
        </Row>
      </Card>

      <Row className="g-4">
        {paginatedData.length === 0 ? (
          <p className="text-center">No {searchTerm ? 'matching' : ''} requests found.</p>
        ) : (
          paginatedData.map((req, index) => (
            <Col xs={12} sm={6} md={4} key={index}>
              <Card className="request-card h-100 shadow-sm">
                <Card.Body>
                  <Card.Title className="mb-3 text-primary fw-bold">
                    Request ID: {req.request_id}
                  </Card.Title>
                  <Card.Text>
                    <strong>Status:</strong> <span className={`status-badge ${req.status?.toLowerCase()}`}>{req.status || 'N/A'}</span><br />
                    <strong>Service Item ID:</strong> {req.service_item}<br />
                    <strong>Preferred Service Date:</strong> {formatToIndianDate(req.preferred_date)}<br />
                    <strong>Preferred Service Time:</strong> {req.preferred_time}<br />
                    <strong>Requested At:</strong> {formatToIndianDateTime(req.created_at)}<br />
                    <strong>Details:</strong> {req.request_details || 'N/A'}
                  </Card.Text>
                </Card.Body>
                <Card.Footer className="bg-white border-top-0 d-flex flex-column gap-2">
                  
                  {/* Complaint Buttons - Both buttons shown, but Complaints disabled if submitted */}
                  <div className="d-flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex-fill"
                      onClick={() => handleComplaintClick(req.request_id)}
                      disabled={isComplaintSubmitted(req.request_id)}
                    >
                      {isComplaintSubmitted(req.request_id) ? 'Complaint Submitted' : 'Raise Complaint'}
                    </Button>
                    
                    {isComplaintSubmitted(req.request_id) && (
                      <Button
                        variant="info"
                        size="sm"
                        className="flex-fill"
                        onClick={() => handleViewComplaint(req.request_id)}
                      >
                        View Complaint
                      </Button>
                    )}
                  </div>
                  
                  {/* Feedback Buttons - Show only for closed requests */}
                  {closedRequestIds.includes(req.request_id) && (
                    <div className="d-flex gap-2">
                      <Button
                        variant={isFeedbackSubmitted(req.request_id) ? "success" : "primary"}
                        size="sm"
                        className="flex-fill"
                        onClick={() => !isFeedbackSubmitted(req.request_id) && navigate(`/delegate-feedback/${req.request_id}`, {
                          state: {
                            delegateId: delegate_id
                          }
                        })}
                        disabled={isFeedbackSubmitted(req.request_id)}
                      >
                        {isFeedbackSubmitted(req.request_id) ? 'Feedback Submitted' : 'Give Feedback'}
                      </Button>
                      
                      {isFeedbackSubmitted(req.request_id) && (
                        <Button
                          variant="info"
                          size="sm"
                          className="flex-fill"
                          onClick={() => handleViewFeedback(req.request_id)}
                        >
                          View Feedback
                        </Button>
                      )}
                    </div>
                  )}
                </Card.Footer>
              </Card>
            </Col>
          ))
        )}
      </Row>

      <div className="d-flex justify-content-center align-items-center mt-4 gap-3 flex-wrap">
        <Button
          variant="primary"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </Button>
        <span className="fw-semibold">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="primary"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default RequestScreenDelegate;
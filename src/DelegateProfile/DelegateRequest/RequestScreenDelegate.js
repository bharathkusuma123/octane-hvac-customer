import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from "../../Components/AuthContext/AuthContext";
import baseURL from './../../Components/ApiUrl/Apiurl';
import { useNavigate } from 'react-router-dom';
import DelegateNavbar from "../DelegateNavbar/DelegateNavbar";

const RequestScreenDelegate = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [closedRequestIds, setClosedRequestIds] = useState([]);
  const [submittedFeedbackRequests, setSubmittedFeedbackRequests] = useState([]);

  const { user } = useContext(AuthContext);
  const company_id = user?.company_id;
  const delegate_id = user?.delegate_id;
  const navigate = useNavigate();

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
          } catch (error) {
            console.error('Error processing survey data:', error);
            setSubmittedFeedbackRequests([]);
          }
        })
        .catch((error) => {
          console.error('Error fetching survey data:', error);
          setSubmittedFeedbackRequests([]);
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
        String(request.preferred_date).toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(request.preferred_time).toLowerCase().includes(searchTerm.toLowerCase()) ||
        (request.request_details && String(request.request_details).toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredRequests(filtered);
    }
    setCurrentPage(1);
  }, [searchTerm, requests]);

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

  if (loading) {
    return <div className="text-center mt-4">Loading requests...</div>;
  }

  return (
    <div className="request-screen-wrapper">
      <DelegateNavbar/>
      <h2 className="text-center mt-1 mb-4">Request Screen</h2>

      {/* Updated layout for mobile responsiveness */}
      <div className="mb-3">
        {/* First row: Show dropdown and Raise Request button */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div className="d-flex align-items-center">
            <span className="me-2 text-nowrap">Show:</span>
            <select
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              className="form-select d-inline-block w-auto me-3"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
            </select>
          </div>
          
          <button 
            className="btn btn-primary"
            onClick={handleRaiseRequest}
          >
            Raise Request
          </button>
        </div>

        {/* Second row: Search field */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by ID, Service, Date..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="form-control w-100"
          />
        </div>
      </div>

      <div className="table-container table-responsive p-0">
        <table className="table table-bordered table-hover mb-0">
          <thead className="table-secondary">
            <tr>
              <th>S.No</th>
              <th>Request ID</th>
              <th>Service Item ID</th>
              <th>Preferred Date</th>
              <th>Preferred Time</th>
              <th>Request Details</th>
              <th>Feedback</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">
                  {searchTerm ? 'No matching requests found.' : 'No requests found.'}
                </td>
              </tr>
            ) : (
              paginatedData.map((req, index) => (
                <tr key={index}>
                  <td>{(currentPage - 1) * rowsPerPage + index + 1}</td>
                  <td>{req.request_id}</td>
                  <td>{req.service_item}</td>
                 <td>{new Date(req.preferred_date).toLocaleDateString('en-IN')}</td>
                  <td>{req.preferred_time}</td>
                  <td>{req.request_details}</td>
                  <td>
                    {closedRequestIds.includes(req.request_id) && (
                      <button
                        className={`btn btn-sm mt-2 ${
                          submittedFeedbackRequests.includes(req.request_id) 
                            ? 'btn-secondary' 
                            : 'btn-success'
                        }`}
                        onClick={() => navigate(`/delegate-feedback/${req.request_id}`, {
                          state: {
                            delegateId: delegate_id
                          }
                        })}
                        disabled={submittedFeedbackRequests.includes(req.request_id)}
                      >
                        {submittedFeedbackRequests.includes(req.request_id) 
                          ? 'Feedback Submitted' 
                          : 'Give Feedback'}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-center align-items-center mt-3 gap-3 flex-wrap">
        <button
          className="btn btn-primary"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>
        <span className="fw-semibold">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="btn btn-primary"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default RequestScreenDelegate;
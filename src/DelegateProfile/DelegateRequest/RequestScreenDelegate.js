// import React, { useEffect, useState, useContext } from 'react';
// import axios from 'axios';
// import { AuthContext } from "../../Components/AuthContext/AuthContext";
// import { useDelegateServiceItems } from "../../Components/AuthContext/DelegateServiceItemContext";
// import baseURL from './../../Components/ApiUrl/Apiurl';
// import { useNavigate } from 'react-router-dom';
// import DelegateNavbar from "../DelegateNavbar/DelegateNavbar";
// import { Card, Button, Form, Row, Col, Alert, Spinner } from 'react-bootstrap';

// const RequestScreenDelegate = () => {
//   const [requests, setRequests] = useState([]);
//   const [filteredRequests, setFilteredRequests] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [closedRequestIds, setClosedRequestIds] = useState([]);
//   const [submittedFeedbackRequests, setSubmittedFeedbackRequests] = useState([]);
//   const [submittedComplaintRequests, setSubmittedComplaintRequests] = useState([]);
//   const [complaintsData, setComplaintsData] = useState([]);
//   const [feedbackData, setFeedbackData] = useState([]);

//   const { user } = useContext(AuthContext);
//   const company_id = user?.company_id;
//   const delegate_id = user?.delegate_id;
//   const navigate = useNavigate();

//   // Use the enhanced context
//   const { selectedServiceItem, serviceItems, loading: serviceItemsLoading } = useDelegateServiceItems();

//   // Function to format date to Indian format (dd-mm-yyyy)
//   const formatToIndianDate = (dateString) => {
//     if (!dateString) return 'N/A';
    
//     try {
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) return 'Invalid Date';
      
//       const day = String(date.getDate()).padStart(2, '0');
//       const month = String(date.getMonth() + 1).padStart(2, '0');
//       const year = date.getFullYear();
      
//       return `${day}-${month}-${year}`;
//     } catch (error) {
//       console.error('Error formatting date:', error);
//       return 'Invalid Date';
//     }
//   };

//   // Function to format datetime to Indian format with time
//   const formatToIndianDateTime = (dateString) => {
//     if (!dateString) return 'N/A';
    
//     try {
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) return 'Invalid Date';
      
//       const day = String(date.getDate()).padStart(2, '0');
//       const month = String(date.getMonth() + 1).padStart(2, '0');
//       const year = date.getFullYear();
//       const hours = String(date.getHours()).padStart(2, '0');
//       const minutes = String(date.getMinutes()).padStart(2, '0');
//       const seconds = String(date.getSeconds()).padStart(2, '0');
      
//       return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
//     } catch (error) {
//       console.error('Error formatting date:', error);
//       return 'Invalid Date';
//     }
//   };

//   // Get service item name from service_item ID
//   const getServiceItemName = (serviceItemId) => {
//     const item = serviceItems.find(item => item.service_item === serviceItemId);
//     return item ? item.service_item_name || serviceItemId : serviceItemId;
//   };

//   // Fetch service requests for the delegate - filtered by selected service item
//   useEffect(() => {
//     if (company_id && delegate_id && !serviceItemsLoading) {
//       setLoading(true);
//       axios.get(`${baseURL}/service-pools/?company_id=${company_id}&user_id=${delegate_id}`)
//         .then((response) => {
//           const responseData = response.data;
//           let requestsArray = [];
          
//           if (Array.isArray(responseData)) {
//             requestsArray = responseData;
//           } else if (responseData && Array.isArray(responseData.data)) {
//             requestsArray = responseData.data;
//           }
          
//           // Filter requests by selected service item if one is selected
//           let filteredRequestsArray = requestsArray;
//           if (selectedServiceItem) {
//             filteredRequestsArray = requestsArray.filter(
//               req => req.service_item === selectedServiceItem
//             );
//           }
          
//           const sortedRequests = filteredRequestsArray.sort(
//             (a, b) => new Date(b.created_at) - new Date(a.created_at)
//           );

//           setRequests(sortedRequests);
//           setFilteredRequests(sortedRequests);
          
//           // Get closed request IDs
//           const closedIds = sortedRequests
//             .filter(req => (req.status || req.request_status || req.state || req.ServiceStatus)?.toLowerCase() === 'closed')
//             .map(req => req.request_id);

//           setClosedRequestIds(closedIds);
//           setLoading(false);
//         })
//         .catch((error) => {
//           console.error('Error fetching service requests:', error);
//           setLoading(false);
//         });
//     }
//   }, [company_id, delegate_id, selectedServiceItem, serviceItemsLoading]);

//   // Rest of your existing code remains the same for feedback, complaints, etc...
//   // [Keep all your existing useEffect hooks and functions for feedback, complaints, etc.]
//   useEffect(() => {
//     if (delegate_id) {
//       axios.get(`${baseURL}/customer-surveys/?user_id=${delegate_id}&company_id=${company_id}`)
//         .then((response) => {
//           try {
//             // Handle different response structures
//             const data = Array.isArray(response.data) ? response.data : 
//                         (response.data?.data && Array.isArray(response.data.data) ? response.data.data : []);
            
//             const feedbackSubmittedRequests = data.map(
//               survey => survey.service_request
//             );
//             setSubmittedFeedbackRequests(feedbackSubmittedRequests);
//             setFeedbackData(data);
//           } catch (error) {
//             console.error('Error processing survey data:', error);
//             setSubmittedFeedbackRequests([]);
//             setFeedbackData([]);
//           }
//         })
//         .catch((error) => {
//           console.error('Error fetching survey data:', error);
//           setSubmittedFeedbackRequests([]);
//           setFeedbackData([]);
//         });
//     }
//   }, [delegate_id, company_id]);

//   // Fetch complaints data for delegate
//   useEffect(() => {
//     if (delegate_id) {
//       axios.get(`${baseURL}/customer-complaints/?user_id=${delegate_id}&company_id=${company_id}`)
//         .then((response) => {
//           try {
//             const data = Array.isArray(response.data) ? response.data : 
//                         (response.data?.data && Array.isArray(response.data.data) ? response.data.data : []);
            
//             // Extract service_request IDs from complaints to track which requests have complaints submitted
//             const complaintRequestIds = data.map(complaint => complaint.service_request);
//             setSubmittedComplaintRequests(complaintRequestIds);
//             setComplaintsData(data);
//           } catch (error) {
//             console.error('Error processing complaints data:', error);
//             setSubmittedComplaintRequests([]);
//             setComplaintsData([]);
//           }
//         })
//         .catch((error) => {
//           console.error('Error fetching complaints data:', error);
//           setSubmittedComplaintRequests([]);
//           setComplaintsData([]);
//         });
//     }
//   }, [delegate_id, company_id]);

//   useEffect(() => {
//     if (searchTerm === '') {
//       setFilteredRequests(requests);
//     } else {
//       const filtered = requests.filter(request => 
//         String(request.request_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
//         String(request.service_item).toLowerCase().includes(searchTerm.toLowerCase()) ||
//         formatToIndianDate(request.preferred_date).toLowerCase().includes(searchTerm.toLowerCase()) ||
//         String(request.preferred_time).toLowerCase().includes(searchTerm.toLowerCase()) ||
//         (request.request_details && String(request.request_details).toLowerCase().includes(searchTerm.toLowerCase()))
//       );
//       setFilteredRequests(filtered);
//     }
//     setCurrentPage(1);
//   }, [searchTerm, requests]);

//   const handleComplaintClick = (requestId) => {
//     navigate('/delegate-complaint-form', { 
//       state: { 
//         service_request: requestId,
//         company: company_id,
//         customer: delegate_id
//       } 
//     });
//   };

//   const handleViewComplaint = (requestId) => {
//     const complaint = complaintsData.find(comp => comp.service_request === requestId);
//     if (complaint) {
//       navigate('/complaint-details', { 
//         state: { 
//           complaintData: complaint 
//         } 
//       });
//     }
//   };

//   const handleViewFeedback = (requestId) => {
//     const feedback = feedbackData.find(fb => fb.service_request === requestId);
//     if (feedback) {
//       navigate('/feedback-details', { 
//         state: { 
//           feedbackData: feedback 
//         } 
//       });
//     }
//   };

//   const totalPages = Math.ceil(filteredRequests.length / rowsPerPage);
//   const paginatedData = filteredRequests.slice(
//     (currentPage - 1) * rowsPerPage,
//     currentPage * rowsPerPage
//   );

//   const handleRowsPerPageChange = (e) => {
//     setRowsPerPage(Number(e.target.value));
//     setCurrentPage(1);
//   };

//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= totalPages) {
//       setCurrentPage(newPage);
//     }
//   };

//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   const handleRaiseRequest = () => {
//     navigate('/delegate-request');
//   };

//   const isComplaintSubmitted = (requestId) => {
//     return submittedComplaintRequests.includes(requestId);
//   };

//   const isFeedbackSubmitted = (requestId) => {
//     return submittedFeedbackRequests.includes(requestId);
//   };

//   if (serviceItemsLoading) {
//     return (
//       <div className="request-screen-wrapper">
//         <DelegateNavbar/>
//         <div className="text-center mt-4">
//           <Spinner animation="border" role="status">
//             <span className="visually-hidden">Loading service items...</span>
//           </Spinner>
//           <p>Loading service items...</p>
//         </div>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="request-screen-wrapper">
//         <DelegateNavbar/>
//         <div className="text-center mt-4">
//           <Spinner animation="border" role="status">
//             <span className="visually-hidden">Loading requests...</span>
//           </Spinner>
//           <p>Loading requests...</p>
//         </div>
//       </div>
//     );
//   }
//   // NEW: Handle Edit Request
//   const handleEditRequest = (request) => {
//     navigate('/delegate-request', { 
//       state: { 
//         editMode: true,
//         requestData: request 
//       }
//     });
//   };

//   // NEW: Check if request is editable (only allow editing for certain statuses)
//   const isEditable = (request) => {
//     const nonEditableStatuses = ['closed', 'completed', 'in progress', 'assigned'];
//     return !nonEditableStatuses.includes(request.status?.toLowerCase());
//   };

//   return (
//     <div className="request-screen-wrapper">
//       <DelegateNavbar/>
//       <h2 className="text-center mb-4">Request Screen</h2>

//       {/* Show selected service item info */}
//       {selectedServiceItem && (
//         <Alert variant="info" className="mb-3">
//           Showing requests for Service Item: <strong>{getServiceItemName(selectedServiceItem)}</strong>
//         </Alert>
//       )}

//       <Card className="toolbar-card shadow-sm p-3 mb-4">
//         <Row className="align-items-center g-3">
//           <Col xs="auto">
//             <Form.Label className="mb-0 fw-semibold">Show:</Form.Label>
//           </Col>
//           <Col xs="auto">
//             <Form.Select
//               value={rowsPerPage}
//               onChange={handleRowsPerPageChange}
//               className="rows-select"
//             >
//               <option value={5}>5</option>
//               <option value={10}>10</option>
//               <option value={25}>25</option>
//             </Form.Select>
//           </Col>

//           <Col xs="auto">
//             <Button variant="primary" onClick={handleRaiseRequest}>
//               Raise Request
//             </Button>
//           </Col>

//           <Col className="ms-auto">
//             <Form.Control
//               type="text"
//               placeholder="Search by ID, Service, Date..."
//               value={searchTerm}
//               onChange={handleSearchChange}
//               className="search-input"
//             />
//           </Col>
//         </Row>
//       </Card>

//       {!selectedServiceItem ? (
//         <Alert variant="warning" className="text-center">
//           Please select a Service Item from the dropdown in the navbar to view requests.
//         </Alert>
//       ) : (
//         <>
//           <Row className="g-4">
//             {paginatedData.length === 0 ? (
//               <p className="text-center">No {searchTerm ? 'matching' : ''} requests found for the selected service item.</p>
//             ) : (
//               paginatedData.map((req, index) => (
//                 <Col xs={12} sm={6} md={4} key={index}>
//                   <Card className="request-card h-100 shadow-sm">
//                     <Card.Body>
//                       <Card.Title className="mb-3 text-primary fw-bold">
//                         Request ID: {req.request_id}
//                       </Card.Title>
//                       <Card.Text>
//                         <strong>Status:</strong> <span className={`status-badge ${req.status?.toLowerCase()}`}>{req.status || 'N/A'}</span><br />
//                         <strong>Service Item:</strong> {getServiceItemName(req.service_item)}<br />
//                         <strong>Preferred Service Date:</strong> {formatToIndianDate(req.preferred_date)}<br />
//                         <strong>Preferred Service Time:</strong> {req.preferred_time}<br />
//                         <strong>Requested At:</strong> {formatToIndianDateTime(req.created_at)}<br />
//                         <strong>Details:</strong> {req.request_details || 'N/A'}
//                       </Card.Text>
//                     </Card.Body>
//                     <Card.Footer className="bg-white border-top-0 d-flex flex-column gap-2">
//                       {/* NEW: Edit Request Button - Only show for editable requests */}
//                   {isEditable(req) && (
//                     <Button
//                       variant="warning"
//                       size="sm"
//                       className="w-100"
//                       onClick={() => handleEditRequest(req)}
//                     >
//                       Edit Request
//                     </Button>
//                     )}
                      
//                       <div className="d-flex gap-2">
//                         <Button
//                           variant="secondary"
//                           size="sm"
//                           className="flex-fill"
//                           onClick={() => handleComplaintClick(req.request_id)}
//                           disabled={isComplaintSubmitted(req.request_id)}
//                         >
//                           {isComplaintSubmitted(req.request_id) ? 'Complaint Submitted' : 'Raise Complaint'}
//                         </Button>
                        
//                         {isComplaintSubmitted(req.request_id) && (
//                           <Button
//                             variant="info"
//                             size="sm"
//                             className="flex-fill"
//                             onClick={() => handleViewComplaint(req.request_id)}
//                           >
//                             View Complaint
//                           </Button>
//                         )}
//                       </div>
                      
//                       {closedRequestIds.includes(req.request_id) && (
//                         <div className="d-flex gap-2">
//                           <Button
//                             variant={isFeedbackSubmitted(req.request_id) ? "success" : "primary"}
//                             size="sm"
//                             className="flex-fill"
//                             onClick={() => !isFeedbackSubmitted(req.request_id) && navigate(`/delegate-feedback/${req.request_id}`, {
//                               state: {
//                                 delegateId: delegate_id
//                               }
//                             })}
//                             disabled={isFeedbackSubmitted(req.request_id)}
//                           >
//                             {isFeedbackSubmitted(req.request_id) ? 'Feedback Submitted' : 'Give Feedback'}
//                           </Button>
                          
//                           {isFeedbackSubmitted(req.request_id) && (
//                             <Button
//                               variant="info"
//                               size="sm"
//                               className="flex-fill"
//                               onClick={() => handleViewFeedback(req.request_id)}
//                             >
//                               View Feedback
//                             </Button>
//                           )}
//                         </div>
//                       )}
//                     </Card.Footer>
//                   </Card>
//                 </Col>
//               ))
//             )}
//           </Row>

//           <div className="d-flex justify-content-center align-items-center mt-4 gap-3 flex-wrap">
//             <Button
//               variant="primary"
//               disabled={currentPage === 1}
//               onClick={() => handlePageChange(currentPage - 1)}
//             >
//               Previous
//             </Button>
//             <span className="fw-semibold">
//               Page {currentPage} of {totalPages}
//             </span>
//             <Button
//               variant="primary"
//               disabled={currentPage === totalPages}
//               onClick={() => handlePageChange(currentPage + 1)}
//             >
//               Next
//             </Button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default RequestScreenDelegate;

// import React, { useEffect, useState, useContext } from 'react';
// import axios from 'axios';
// import { AuthContext } from "../../Components/AuthContext/AuthContext";
// import { useDelegateServiceItems } from "../../Components/AuthContext/DelegateServiceItemContext";
// import baseURL from './../../Components/ApiUrl/Apiurl';
// import { useNavigate } from 'react-router-dom';
// import DelegateNavbar from "../DelegateNavbar/DelegateNavbar";
// import { Card, Button, Form, Row, Col, Alert, Spinner } from 'react-bootstrap';

// const RequestScreenDelegate = () => {
//   const [requests, setRequests] = useState([]);
//   const [filteredRequests, setFilteredRequests] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [closedRequestIds, setClosedRequestIds] = useState([]);
//   const [submittedFeedbackRequests, setSubmittedFeedbackRequests] = useState([]);
//   const [submittedComplaintRequests, setSubmittedComplaintRequests] = useState([]);
//   const [complaintsData, setComplaintsData] = useState([]);
//   const [feedbackData, setFeedbackData] = useState([]);

//   const { user } = useContext(AuthContext);
//   const company_id = user?.company_id;
//   const delegate_id = user?.delegate_id;
//   const navigate = useNavigate();

//   // Use the enhanced context - get permissions
//   const { 
//     selectedServiceItem, 
//     serviceItems, 
//     serviceItemPermissions,
//     loading: serviceItemsLoading 
//   } = useDelegateServiceItems();

//   // Function to format date to Indian format (dd-mm-yyyy)
//   const formatToIndianDate = (dateString) => {
//     if (!dateString) return 'N/A';
    
//     try {
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) return 'Invalid Date';
      
//       const day = String(date.getDate()).padStart(2, '0');
//       const month = String(date.getMonth() + 1).padStart(2, '0');
//       const year = date.getFullYear();
      
//       return `${day}-${month}-${year}`;
//     } catch (error) {
//       console.error('Error formatting date:', error);
//       return 'Invalid Date';
//     }
//   };

//   // Function to format datetime to Indian format with time
//   const formatToIndianDateTime = (dateString) => {
//     if (!dateString) return 'N/A';
    
//     try {
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) return 'Invalid Date';
      
//       const day = String(date.getDate()).padStart(2, '0');
//       const month = String(date.getMonth() + 1).padStart(2, '0');
//       const year = date.getFullYear();
//       const hours = String(date.getHours()).padStart(2, '0');
//       const minutes = String(date.getMinutes()).padStart(2, '0');
//       const seconds = String(date.getSeconds()).padStart(2, '0');
      
//       return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
//     } catch (error) {
//       console.error('Error formatting date:', error);
//       return 'Invalid Date';
//     }
//   };

//   // Get service item name from service_item ID
//   const getServiceItemName = (serviceItemId) => {
//     const item = serviceItems.find(item => item.service_item === serviceItemId);
//     return item ? item.service_item_name || serviceItemId : serviceItemId;
//   };

//   // Fetch service requests for the delegate - filtered by selected service item
//   useEffect(() => {
//     if (company_id && delegate_id && !serviceItemsLoading) {
//       setLoading(true);
//       axios.get(`${baseURL}/service-pools/?company_id=${company_id}&user_id=${delegate_id}`)
//         .then((response) => {
//           const responseData = response.data;
//           let requestsArray = [];
          
//           if (Array.isArray(responseData)) {
//             requestsArray = responseData;
//           } else if (responseData && Array.isArray(responseData.data)) {
//             requestsArray = responseData.data;
//           }
          
//           // Filter requests by selected service item if one is selected
//           let filteredRequestsArray = requestsArray;
//           if (selectedServiceItem) {
//             filteredRequestsArray = requestsArray.filter(
//               req => req.service_item === selectedServiceItem
//             );
//           }
          
//           const sortedRequests = filteredRequestsArray.sort(
//             (a, b) => new Date(b.created_at) - new Date(a.created_at)
//           );

//           setRequests(sortedRequests);
//           setFilteredRequests(sortedRequests);
          
//           // Get closed request IDs
//           const closedIds = sortedRequests
//             .filter(req => (req.status || req.request_status || req.state || req.ServiceStatus)?.toLowerCase() === 'closed')
//             .map(req => req.request_id);

//           setClosedRequestIds(closedIds);
//           setLoading(false);
//         })
//         .catch((error) => {
//           console.error('Error fetching service requests:', error);
//           setLoading(false);
//         });
//     }
//   }, [company_id, delegate_id, selectedServiceItem, serviceItemsLoading]);

//   // Rest of your existing code for feedback, complaints, etc...
//   useEffect(() => {
//     if (delegate_id) {
//       axios.get(`${baseURL}/customer-surveys/?user_id=${delegate_id}&company_id=${company_id}`)
//         .then((response) => {
//           try {
//             // Handle different response structures
//             const data = Array.isArray(response.data) ? response.data : 
//                         (response.data?.data && Array.isArray(response.data.data) ? response.data.data : []);
            
//             const feedbackSubmittedRequests = data.map(
//               survey => survey.service_request
//             );
//             setSubmittedFeedbackRequests(feedbackSubmittedRequests);
//             setFeedbackData(data);
//           } catch (error) {
//             console.error('Error processing survey data:', error);
//             setSubmittedFeedbackRequests([]);
//             setFeedbackData([]);
//           }
//         })
//         .catch((error) => {
//           console.error('Error fetching survey data:', error);
//           setSubmittedFeedbackRequests([]);
//           setFeedbackData([]);
//         });
//     }
//   }, [delegate_id, company_id]);

//   // Fetch complaints data for delegate
//   useEffect(() => {
//     if (delegate_id) {
//       axios.get(`${baseURL}/customer-complaints/?user_id=${delegate_id}&company_id=${company_id}`)
//         .then((response) => {
//           try {
//             const data = Array.isArray(response.data) ? response.data : 
//                         (response.data?.data && Array.isArray(response.data.data) ? response.data.data : []);
            
//             // Extract service_request IDs from complaints to track which requests have complaints submitted
//             const complaintRequestIds = data.map(complaint => complaint.service_request);
//             setSubmittedComplaintRequests(complaintRequestIds);
//             setComplaintsData(data);
//           } catch (error) {
//             console.error('Error processing complaints data:', error);
//             setSubmittedComplaintRequests([]);
//             setComplaintsData([]);
//           }
//         })
//         .catch((error) => {
//           console.error('Error fetching complaints data:', error);
//           setSubmittedComplaintRequests([]);
//           setComplaintsData([]);
//         });
//     }
//   }, [delegate_id, company_id]);

//   useEffect(() => {
//     if (searchTerm === '') {
//       setFilteredRequests(requests);
//     } else {
//       const filtered = requests.filter(request => 
//         String(request.request_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
//         String(request.service_item).toLowerCase().includes(searchTerm.toLowerCase()) ||
//         formatToIndianDate(request.preferred_date).toLowerCase().includes(searchTerm.toLowerCase()) ||
//         String(request.preferred_time).toLowerCase().includes(searchTerm.toLowerCase()) ||
//         (request.request_details && String(request.request_details).toLowerCase().includes(searchTerm.toLowerCase()))
//       );
//       setFilteredRequests(filtered);
//     }
//     setCurrentPage(1);
//   }, [searchTerm, requests]);

//   const handleComplaintClick = (requestId) => {
//     navigate('/delegate-complaint-form', { 
//       state: { 
//         service_request: requestId,
//         company: company_id,
//         customer: delegate_id
//       } 
//     });
//   };

//   const handleViewComplaint = (requestId) => {
//     const complaint = complaintsData.find(comp => comp.service_request === requestId);
//     if (complaint) {
//       navigate('/complaint-details', { 
//         state: { 
//           complaintData: complaint 
//         } 
//       });
//     }
//   };

//   const handleViewFeedback = (requestId) => {
//     const feedback = feedbackData.find(fb => fb.service_request === requestId);
//     if (feedback) {
//       navigate('/feedback-details', { 
//         state: { 
//           feedbackData: feedback 
//         } 
//       });
//     }
//   };

//   const totalPages = Math.ceil(filteredRequests.length / rowsPerPage);
//   const paginatedData = filteredRequests.slice(
//     (currentPage - 1) * rowsPerPage,
//     currentPage * rowsPerPage
//   );

//   const handleRowsPerPageChange = (e) => {
//     setRowsPerPage(Number(e.target.value));
//     setCurrentPage(1);
//   };

//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= totalPages) {
//       setCurrentPage(newPage);
//     }
//   };

//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   const handleRaiseRequest = () => {
//     navigate('/delegate-request');
//   };

//   const isComplaintSubmitted = (requestId) => {
//     return submittedComplaintRequests.includes(requestId);
//   };

//   const isFeedbackSubmitted = (requestId) => {
//     return submittedFeedbackRequests.includes(requestId);
//   };

//   // NEW: Check permissions for Raise Request button
//   const canRaiseServiceRequest = serviceItemPermissions?.can_raise_service_request;
  
//   // NEW: Check permissions for Raise Complaint button
//   const canLogCustomerComplaints = serviceItemPermissions?.can_log_customer_complaints;

//   // NEW: Handle Edit Request
//   const handleEditRequest = (request) => {
//     navigate('/delegate-request', { 
//       state: { 
//         editMode: true,
//         requestData: request 
//       }
//     });
//   };

//   // NEW: Check if request is editable (only allow editing for certain statuses)
//   const isEditable = (request) => {
//     const nonEditableStatuses = ['closed', 'completed', 'in progress', 'assigned'];
//     return !nonEditableStatuses.includes(request.status?.toLowerCase());
//   };

//   if (serviceItemsLoading) {
//     return (
//       <div className="request-screen-wrapper">
//         <DelegateNavbar/>
//         <div className="text-center mt-4">
//           <Spinner animation="border" role="status">
//             <span className="visually-hidden">Loading service items...</span>
//           </Spinner>
//           <p>Loading service items...</p>
//         </div>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="request-screen-wrapper">
//         <DelegateNavbar/>
//         <div className="text-center mt-4">
//           <Spinner animation="border" role="status">
//             <span className="visually-hidden">Loading requests...</span>
//           </Spinner>
//           <p>Loading requests...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="request-screen-wrapper">
//       <DelegateNavbar/>
//       <h2 className="text-center mb-4">Request Screen</h2>

//       {/* Show selected service item info */}
//       {selectedServiceItem && (
//         <Alert variant="info" className="mb-3">
//           Showing requests for Service Item: <strong>{getServiceItemName(selectedServiceItem)}</strong>
//           <br />
//           Permissions: 
//           {canRaiseServiceRequest && <span className="badge bg-success ms-2">Can Raise Requests</span>}
//           {canLogCustomerComplaints && <span className="badge bg-success ms-2">Can Log Complaints</span>}
//         </Alert>
//       )}

//       <Card className="toolbar-card shadow-sm p-3 mb-4">
//         <Row className="align-items-center g-3">
//           <Col xs="auto">
//             <Form.Label className="mb-0 fw-semibold">Show:</Form.Label>
//           </Col>
//           <Col xs="auto">
//             <Form.Select
//               value={rowsPerPage}
//               onChange={handleRowsPerPageChange}
//               className="rows-select"
//             >
//               <option value={5}>5</option>
//               <option value={10}>10</option>
//               <option value={25}>25</option>
//             </Form.Select>
//           </Col>

//           {/* Conditionally show Raise Request button based on permissions */}
//           {canRaiseServiceRequest && (
//             <Col xs="auto">
//               <Button variant="primary" onClick={handleRaiseRequest}>
//                 Raise Request
//               </Button>
//             </Col>
//           )}

//           <Col className="ms-auto">
//             <Form.Control
//               type="text"
//               placeholder="Search by ID, Service, Date..."
//               value={searchTerm}
//               onChange={handleSearchChange}
//               className="search-input"
//             />
//           </Col>
//         </Row>
//       </Card>

//       {!selectedServiceItem ? (
//         <Alert variant="warning" className="text-center">
//           Please select a Service Item from the dropdown in the navbar to view requests.
//         </Alert>
//       ) : (
//         <>
//           <Row className="g-4">
//             {paginatedData.length === 0 ? (
//               <p className="text-center">No {searchTerm ? 'matching' : ''} requests found for the selected service item.</p>
//             ) : (
//               paginatedData.map((req, index) => (
//                 <Col xs={12} sm={6} md={4} key={index}>
//                   <Card className="request-card h-100 shadow-sm">
//                     <Card.Body>
//                       <Card.Title className="mb-3 text-primary fw-bold">
//                         Request ID: {req.request_id}
//                       </Card.Title>
//                       <Card.Text>
//                         <strong>Status:</strong> <span className={`status-badge ${req.status?.toLowerCase()}`}>{req.status || 'N/A'}</span><br />
//                         <strong>Service Item:</strong> {getServiceItemName(req.service_item)}<br />
//                         <strong>Preferred Service Date:</strong> {formatToIndianDate(req.preferred_date)}<br />
//                         <strong>Preferred Service Time:</strong> {req.preferred_time}<br />
//                         <strong>Requested At:</strong> {formatToIndianDateTime(req.created_at)}<br />
//                         <strong>Details:</strong> {req.request_details || 'N/A'}
//                       </Card.Text>
//                     </Card.Body>
//                     <Card.Footer className="bg-white border-top-0 d-flex flex-column gap-2">
//                       {/* NEW: Edit Request Button - Only show for editable requests */}
//                       {isEditable(req) && (
//                         <Button
//                           variant="warning"
//                           size="sm"
//                           className="w-100"
//                           onClick={() => handleEditRequest(req)}
//                         >
//                           Edit Request
//                         </Button>
//                       )}
                      
//                       <div className="d-flex gap-2">
//                         {/* Conditionally show Raise Complaint button based on permissions */}
//                         {canLogCustomerComplaints && (
//                           <Button
//                             variant="secondary"
//                             size="sm"
//                             className="flex-fill"
//                             onClick={() => handleComplaintClick(req.request_id)}
//                             disabled={isComplaintSubmitted(req.request_id)}
//                           >
//                             {isComplaintSubmitted(req.request_id) ? 'Complaint Submitted' : 'Raise Complaint'}
//                           </Button>
//                         )}
                        
//                         {isComplaintSubmitted(req.request_id) && (
//                           <Button
//                             variant="info"
//                             size="sm"
//                             className="flex-fill"
//                             onClick={() => handleViewComplaint(req.request_id)}
//                           >
//                             View Complaint
//                           </Button>
//                         )}
//                       </div>
                      
//                       {closedRequestIds.includes(req.request_id) && (
//                         <div className="d-flex gap-2">
//                           <Button
//                             variant={isFeedbackSubmitted(req.request_id) ? "success" : "primary"}
//                             size="sm"
//                             className="flex-fill"
//                             onClick={() => !isFeedbackSubmitted(req.request_id) && navigate(`/delegate-feedback/${req.request_id}`, {
//                               state: {
//                                 delegateId: delegate_id
//                               }
//                             })}
//                             disabled={isFeedbackSubmitted(req.request_id)}
//                           >
//                             {isFeedbackSubmitted(req.request_id) ? 'Feedback Submitted' : 'Give Feedback'}
//                           </Button>
                          
//                           {isFeedbackSubmitted(req.request_id) && (
//                             <Button
//                               variant="info"
//                               size="sm"
//                               className="flex-fill"
//                               onClick={() => handleViewFeedback(req.request_id)}
//                             >
//                               View Feedback
//                             </Button>
//                           )}
//                         </div>
//                       )}
//                     </Card.Footer>
//                   </Card>
//                 </Col>
//               ))
//             )}
//           </Row>

//           <div className="d-flex justify-content-center align-items-center mt-4 gap-3 flex-wrap">
//             <Button
//               variant="primary"
//               disabled={currentPage === 1}
//               onClick={() => handlePageChange(currentPage - 1)}
//             >
//               Previous
//             </Button>
//             <span className="fw-semibold">
//               Page {currentPage} of {totalPages}
//             </span>
//             <Button
//               variant="primary"
//               disabled={currentPage === totalPages}
//               onClick={() => handlePageChange(currentPage + 1)}
//             >
//               Next
//             </Button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default RequestScreenDelegate;

  //===================================================
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from "../../Components/AuthContext/AuthContext";
import { useDelegateServiceItems } from "../../Components/AuthContext/DelegateServiceItemContext";
import baseURL from './../../Components/ApiUrl/Apiurl';
import { useNavigate } from 'react-router-dom';
import DelegateNavbar from "../DelegateNavbar/DelegateNavbar";
import { Card, Button, Form, Row, Col, Alert, Spinner } from 'react-bootstrap';

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
  const [serviceItemsList, setServiceItemsList] = useState([]); // NEW: Store service items from API

  const { user } = useContext(AuthContext);
  const company_id = user?.company_id;
  const delegate_id = user?.delegate_id;
  const navigate = useNavigate();

  // Use the enhanced context - get permissions
  const { 
    selectedServiceItem, 
    serviceItems, 
    serviceItemPermissions,
    loading: serviceItemsLoading 
  } = useDelegateServiceItems();

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

  // UPDATED: Get service item name from service_item ID by matching with serviceItemsList
  const getServiceItemName = (serviceItemId) => {
    if (!serviceItemId) return 'N/A';
    
    // First check in the serviceItemsList from API
    const itemFromApi = serviceItemsList.find(item => item.service_item_id === serviceItemId);
    if (itemFromApi) {
      return itemFromApi.service_item_name || serviceItemId;
    }
    
    // Fallback to context service items
    const itemFromContext = serviceItems.find(item => item.service_item === serviceItemId);
    return itemFromContext ? itemFromContext.service_item_name || serviceItemId : serviceItemId;
  };

  // NEW: Fetch service items from API to get service_item_name
  useEffect(() => {
    if (company_id && delegate_id) {
      axios.get(`${baseURL}/service-items/?user_id=${delegate_id}&company_id=${company_id}`)
        .then((response) => {
          try {
            const data = Array.isArray(response.data) ? response.data : 
                        (response.data?.data && Array.isArray(response.data.data) ? response.data.data : []);
            setServiceItemsList(data);
          } catch (error) {
            console.error('Error processing service items data:', error);
            setServiceItemsList([]);
          }
        })
        .catch((error) => {
          console.error('Error fetching service items:', error);
          setServiceItemsList([]);
        });
    }
  }, [company_id, delegate_id]);

  // Fetch service requests for the delegate - filtered by selected service item
  useEffect(() => {
    if (company_id && delegate_id && !serviceItemsLoading) {
      setLoading(true);
      axios.get(`${baseURL}/service-pools/?company_id=${company_id}&user_id=${delegate_id}`)
        .then((response) => {
          const responseData = response.data;
          let requestsArray = [];
          
          if (Array.isArray(responseData)) {
            requestsArray = responseData;
          } else if (responseData && Array.isArray(responseData.data)) {
            requestsArray = responseData.data;
          }
          
          // Filter requests by selected service item if one is selected
          let filteredRequestsArray = requestsArray;
          if (selectedServiceItem) {
            filteredRequestsArray = requestsArray.filter(
              req => req.service_item === selectedServiceItem
            );
          }
          
          const sortedRequests = filteredRequestsArray.sort(
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
  }, [company_id, delegate_id, selectedServiceItem, serviceItemsLoading]);

  // Rest of your existing code for feedback, complaints, etc...
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
        // Also search by service item name
        getServiceItemName(request.service_item).toLowerCase().includes(searchTerm.toLowerCase()) ||
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
        customer: delegate_id
      } 
    });
  };

  const handleViewComplaint = (requestId) => {
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

  const isComplaintSubmitted = (requestId) => {
    return submittedComplaintRequests.includes(requestId);
  };

  const isFeedbackSubmitted = (requestId) => {
    return submittedFeedbackRequests.includes(requestId);
  };

  // NEW: Check permissions for Raise Request button
  const canRaiseServiceRequest = serviceItemPermissions?.can_raise_service_request;
  
  // NEW: Check permissions for Raise Complaint button
  const canLogCustomerComplaints = serviceItemPermissions?.can_log_customer_complaints;

  // NEW: Handle Edit Request
  const handleEditRequest = (request) => {
    navigate('/delegate-request', { 
      state: { 
        editMode: true,
        requestData: request 
      }
    });
  };

  // NEW: Check if request is editable (only allow editing for certain statuses)
  const isEditable = (request) => {
    const nonEditableStatuses = ['closed', 'completed', 'in progress', 'assigned'];
    return !nonEditableStatuses.includes(request.status?.toLowerCase());
  };

  if (serviceItemsLoading) {
    return (
      <div className="request-screen-wrapper">
        <DelegateNavbar/>
        <div className="text-center mt-4">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading service items...</span>
          </Spinner>
          <p>Loading service items...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="request-screen-wrapper">
        <DelegateNavbar/>
        <div className="text-center mt-4">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading requests...</span>
          </Spinner>
          <p>Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="request-screen-wrapper">
      <DelegateNavbar/>
      <h2 className="text-center mb-4">Request Screen</h2>

      {/* Show selected service item info */}
      {selectedServiceItem && (
        <Alert variant="info" className="mb-3">
          Showing requests for Service Item: <strong>{getServiceItemName(selectedServiceItem)}</strong>
          <br />
          Permissions: 
          {canRaiseServiceRequest && <span className="badge bg-success ms-2">Can Raise Requests</span>}
          {canLogCustomerComplaints && <span className="badge bg-success ms-2">Can Log Complaints</span>}
        </Alert>
      )}

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

          {/* Conditionally show Raise Request button based on permissions */}
          {canRaiseServiceRequest && (
            <Col xs="auto">
              <Button variant="primary" onClick={handleRaiseRequest}>
                Raise Request
              </Button>
            </Col>
          )}

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

      {!selectedServiceItem ? (
        <Alert variant="warning" className="text-center">
          Please select a Service Item from the dropdown in the navbar to view requests.
        </Alert>
      ) : (
        <>
          <Row className="g-4">
            {paginatedData.length === 0 ? (
              <p className="text-center">No {searchTerm ? 'matching' : ''} requests found for the selected service item.</p>
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
                        <strong>Service Item:</strong> {getServiceItemName(req.service_item)}<br />
                        <strong>Preferred Service Date:</strong> {formatToIndianDate(req.preferred_date)}<br />
                        <strong>Preferred Service Time:</strong> {req.preferred_time}<br />
                        <strong>Requested At:</strong> {formatToIndianDateTime(req.created_at)}<br />
                        <strong>Details:</strong> {req.request_details || 'N/A'}
                      </Card.Text>
                    </Card.Body>
                    <Card.Footer className="bg-white border-top-0 d-flex flex-column gap-2">
                      {/* NEW: Edit Request Button - Only show for editable requests */}
                      {isEditable(req) && (
                        <Button
                          variant="warning"
                          size="sm"
                          className="w-100"
                          onClick={() => handleEditRequest(req)}
                        >
                          Edit Request
                        </Button>
                      )}
                      
                      <div className="d-flex gap-2">
                        {/* Conditionally show Raise Complaint button based on permissions */}
                        {canLogCustomerComplaints && (
                          <Button
                            variant="secondary"
                            size="sm"
                            className="flex-fill"
                            onClick={() => handleComplaintClick(req.request_id)}
                            disabled={isComplaintSubmitted(req.request_id)}
                          >
                            {isComplaintSubmitted(req.request_id) ? 'Complaint Submitted' : 'Raise Complaint'}
                          </Button>
                        )}
                        
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
        </>
      )}
    </div>
  );
};

export default RequestScreenDelegate;
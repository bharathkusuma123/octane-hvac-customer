// import React, { useEffect, useState, useContext } from 'react';
// import NavScreen from '../../Screens/Navbar/Navbar';
// import axios from 'axios';
// import './Request.css';
// import { AuthContext } from "../../AuthContext/AuthContext";
// import baseURL from '../../ApiUrl/Apiurl';
// import { useNavigate } from 'react-router-dom';
// import { Card, Button, Form, Row, Col } from 'react-bootstrap';

// const RequestScreen = () => {
//   const [requests, setRequests] = useState([]);
//   const [filteredRequests, setFilteredRequests] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [submittedFeedbackRequests, setSubmittedFeedbackRequests] = useState([]);
//   const [closedRequestIds, setClosedRequestIds] = useState([]);

//   const { user } = useContext(AuthContext);
//   const userId = user?.customer_id;
//   const company_id = user?.company_id;
//   const navigate = useNavigate();

//   const [serviceItems, setServiceItems] = useState([]);
// useEffect(() => {
//   if (user?.customer_id) {
//     axios
//       .get(`${baseURL}/service-items/?user_id=${userId}&company_id=${company_id}`)
//       .then((response) => {
//         if (Array.isArray(response.data?.data)) {
//           setServiceItems(response.data.data);
//         }
//       })
//       .catch((error) => {
//         console.error('Error fetching service items:', error);
//       });
//   }
// }, [user?.customer_id]);


//   useEffect(() => {
//     if (user?.customer_id) {
//       axios
//         .get(`${baseURL}/service-pools/?user_id=${userId}&company_id=${company_id}`)
//         .then((response) => {
//           if (response.data?.status === 'success') {
//             const customerRequests = response.data.data
//               .filter((req) => req.customer === user.customer_id)
//               .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

//             setRequests(customerRequests);
//             setFilteredRequests(customerRequests);

//             const closedIds = customerRequests
//               .filter(req => (req.status || req.request_status || req.state || req.ServiceStatus)?.toLowerCase() === 'closed')
//               .map(req => req.request_id);

//             setClosedRequestIds(closedIds);
//           }
//         })
//         .catch((error) => {
//           console.error('Error fetching service requests:', error);
//         });
//     }
//   }, [user?.customer_id]);

//   useEffect(() => {
//     if (user?.customer_id) {
//       axios
//         .get(`${baseURL}/customer-surveys/?user_id=${userId}&company_id=${company_id}`)
//         .then((response) => {
//           const data = response.data?.data || response.data;
//           if (Array.isArray(data)) {
//             const feedbackSubmittedRequests = data.map(survey => survey.service_request);
//             setSubmittedFeedbackRequests(feedbackSubmittedRequests);
//           }
//         })
//         .catch((error) => {
//           console.error('Error fetching survey data:', error);
//         });
//     }
//   }, [user?.customer_id]);

//   useEffect(() => {
//     if (searchTerm === '') {
//       setFilteredRequests(requests);
//     } else {
//       const filtered = requests.filter(request =>
//         request.request_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         request.service_item.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         request.preferred_date.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         request.preferred_time.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         (request.request_details && request.request_details.toLowerCase().includes(searchTerm.toLowerCase()))
//       );
//       setFilteredRequests(filtered);
//     }
//     setCurrentPage(1);
//   }, [searchTerm, requests]);

//   const handleComplaintClick = (requestId) => {
//     navigate('/complaint-form', { 
//       state: { 
//         service_request: requestId,
//         company: user?.company_id,
//         customer: user?.customer_id
//       } 
//     });
//   };

//   const totalPages = Math.ceil(filteredRequests.length / rowsPerPage);
//   const paginatedData = filteredRequests.slice(
//     (currentPage - 1) * rowsPerPage,
//     currentPage * rowsPerPage
//   );

//   return (
//     <div className="request-screen-wrapper">
//       <h2 className="text-center mb-4">Request Screen</h2>

//       <Card className="toolbar-card shadow-sm p-3 mb-4">
//         <Row className="align-items-center g-3">
//           <Col xs="auto">
//             <Form.Label className="mb-0 fw-semibold">Show:</Form.Label>
//           </Col>
//           <Col xs="auto">
//             <Form.Select
//               value={rowsPerPage}
//               onChange={(e) => {
//                 setRowsPerPage(Number(e.target.value));
//                 setCurrentPage(1);
//               }}
//               className="rows-select"
//             >
//               <option value={5}>5</option>
//               <option value={10}>10</option>
//               <option value={25}>25</option>
//             </Form.Select>
//           </Col>

//           {/* 🔘 Add Request Button */}
//           <Col xs="auto">
//             <Button variant="primary" onClick={() => navigate('/service-form')}>
//               Add Request
//             </Button>
//           </Col>

//           <Col className="ms-auto">
//             <Form.Control
//               type="text"
//               placeholder="Search by ID, Service, Date..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="search-input"
//             />
//           </Col>
//         </Row>
//       </Card>

//       <Row className="g-4">
//         {paginatedData.length === 0 ? (
//           <p className="text-center">No {searchTerm ? 'matching' : ''} requests found.</p>
//         ) : (
//           paginatedData.map((req, index) => (
//             <Col xs={12} sm={6} md={4} key={index}>
//               <Card className="request-card h-100 shadow-sm">
//                 <Card.Body>
//                   <Card.Title className="mb-3 text-primary fw-bold">
//                     Request ID: {req.request_id}
//                   </Card.Title>
//                   <Card.Text>
//                   <strong>Service Item:</strong>{" "}
// {
//   serviceItems.find(item => item.service_item_id === req.service_item)?.service_item_name
//   || req.service_item
// }
// <br />

//                     <strong>Preferred Service Date:</strong> {req.preferred_date}<br />
//                     <strong>Preferred Service Time:</strong> {req.preferred_time}<br />
//                 <strong>Requested At:</strong>{" "}
// {new Date(req.created_at).toLocaleString()}
// <br />

//                     <strong>Details:</strong> {req.request_details || 'N/A'}
//                   </Card.Text>
//                 </Card.Body>
//                 <Card.Footer className="bg-white border-top-0 d-flex flex-column gap-2">
//                   {/* Customer Complaints Button */}
//                   <Button
//                     variant="secondary"
//                     size="sm"
//                     className="w-100"
//                     onClick={() => handleComplaintClick(req.request_id)}
//                   >
//                     Customer Complaints
//                   </Button>
                  
//                   {closedRequestIds.includes(req.request_id) && (
//                     <Button
//                       variant={submittedFeedbackRequests.includes(req.request_id) ? "success" : "primary"}
//                       size="sm"
//                       className="w-100"
//                       onClick={() => navigate(`/feedback/${req.request_id}`)}
//                       disabled={submittedFeedbackRequests.includes(req.request_id)}
//                     >
//                       {submittedFeedbackRequests.includes(req.request_id)
//                         ? 'Feedback Submitted'
//                         : 'Give Feedback'}
//                     </Button>
//                   )}
//                 </Card.Footer>
//               </Card>
//             </Col>
//           ))
//         )}
//       </Row>

//       <div className="d-flex justify-content-center align-items-center mt-4 gap-3 flex-wrap">
//         <Button
//           onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//           disabled={currentPage === 1}
//         >
//           Previous
//         </Button>
//         <span className="fw-semibold">Page {currentPage} of {totalPages}</span>
//         <Button
//           onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//           disabled={currentPage === totalPages}
//         >
//           Next
//         </Button>
//       </div>

//       <NavScreen />
//     </div>
//   );
// };

// export default RequestScreen;


// import React, { useEffect, useState, useContext } from 'react';
// import NavScreen from '../../Screens/Navbar/Navbar';
// import axios from 'axios';
// import './Request.css';
// import { AuthContext } from "../../AuthContext/AuthContext";
// import baseURL from '../../ApiUrl/Apiurl';
// import { useNavigate } from 'react-router-dom';
// import { Card, Button, Form, Row, Col } from 'react-bootstrap';

// const RequestScreen = () => {
//   const [requests, setRequests] = useState([]);
//   const [filteredRequests, setFilteredRequests] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [submittedFeedbackRequests, setSubmittedFeedbackRequests] = useState([]);
//   const [closedRequestIds, setClosedRequestIds] = useState([]);

//   const { user } = useContext(AuthContext);
//   const userId = user?.customer_id;
//   const company_id = user?.company_id;
//   const navigate = useNavigate();

//   const [serviceItems, setServiceItems] = useState([]);

//   useEffect(() => {
//     if (user?.customer_id) {
//       axios
//         .get(`${baseURL}/service-items/?user_id=${userId}&company_id=${company_id}`)
//         .then((response) => {
//           if (Array.isArray(response.data?.data)) {
//             setServiceItems(response.data.data);
//           }
//         })
//         .catch((error) => {
//           console.error('Error fetching service items:', error);
//         });
//     }
//   }, [user?.customer_id]);

//   useEffect(() => {
//     if (user?.customer_id) {
//       axios
//         .get(`${baseURL}/service-pools/?user_id=${userId}&company_id=${company_id}`)
//         .then((response) => {
//           if (response.data?.status === 'success') {
//             const customerRequests = response.data.data
//               .filter((req) => req.customer === user.customer_id)
//               .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

//             setRequests(customerRequests);
//             setFilteredRequests(customerRequests);

//             const closedIds = customerRequests
//               .filter(req => (req.status || req.request_status || req.state || req.ServiceStatus)?.toLowerCase() === 'closed')
//               .map(req => req.request_id);

//             setClosedRequestIds(closedIds);
//           }
//         })
//         .catch((error) => {
//           console.error('Error fetching service requests:', error);
//         });
//     }
//   }, [user?.customer_id]);

//   useEffect(() => {
//     if (user?.customer_id) {
//       axios
//         .get(`${baseURL}/customer-surveys/?user_id=${userId}&company_id=${company_id}`)
//         .then((response) => {
//           const data = response.data?.data || response.data;
//           if (Array.isArray(data)) {
//             const feedbackSubmittedRequests = data.map(survey => survey.service_request);
//             setSubmittedFeedbackRequests(feedbackSubmittedRequests);
//           }
//         })
//         .catch((error) => {
//           console.error('Error fetching survey data:', error);
//         });
//     }
//   }, [user?.customer_id]);

//   useEffect(() => {
//     if (searchTerm === '') {
//       setFilteredRequests(requests);
//     } else {
//       const filtered = requests.filter(request =>
//         request.request_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         request.service_item.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         request.preferred_date.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         request.preferred_time.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         (request.request_details && request.request_details.toLowerCase().includes(searchTerm.toLowerCase()))
//       );
//       setFilteredRequests(filtered);
//     }
//     setCurrentPage(1);
//   }, [searchTerm, requests]);

//   const handleComplaintClick = (requestId) => {
//     navigate('/complaint-form', { 
//       state: { 
//         service_request: requestId,
//         company: user?.company_id,
//         customer: user?.customer_id
//       } 
//     });
//   };

//   const handleEditClick = (request) => {
//     navigate('/service-form', { 
//       state: { 
//         editMode: true,
//         requestData: request 
//       } 
//     });
//   };

//   const totalPages = Math.ceil(filteredRequests.length / rowsPerPage);
//   const paginatedData = filteredRequests.slice(
//     (currentPage - 1) * rowsPerPage,
//     currentPage * rowsPerPage
//   );

//   // Check if request is editable (only allow editing for certain statuses)
//   const isEditable = (request) => {
//     const nonEditableStatuses = ['closed', 'completed', 'in progress'];
//     return !nonEditableStatuses.includes(request.status?.toLowerCase());
//   };

//   return (
//     <div className="request-screen-wrapper">
//       <h2 className="text-center mb-4">Request Screen</h2>

//       <Card className="toolbar-card shadow-sm p-3 mb-4">
//         <Row className="align-items-center g-3">
//           <Col xs="auto">
//             <Form.Label className="mb-0 fw-semibold">Show:</Form.Label>
//           </Col>
//           <Col xs="auto">
//             <Form.Select
//               value={rowsPerPage}
//               onChange={(e) => {
//                 setRowsPerPage(Number(e.target.value));
//                 setCurrentPage(1);
//               }}
//               className="rows-select"
//             >
//               <option value={5}>5</option>
//               <option value={10}>10</option>
//               <option value={25}>25</option>
//             </Form.Select>
//           </Col>

//           {/* 🔘 Add Request Button */}
//           <Col xs="auto">
//             <Button variant="primary" onClick={() => navigate('/service-form')}>
//               Add Request
//             </Button>
//           </Col>

//           <Col className="ms-auto">
//             <Form.Control
//               type="text"
//               placeholder="Search by ID, Service, Date..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="search-input"
//             />
//           </Col>
//         </Row>
//       </Card>

//       <Row className="g-4">
//         {paginatedData.length === 0 ? (
//           <p className="text-center">No {searchTerm ? 'matching' : ''} requests found.</p>
//         ) : (
//           paginatedData.map((req, index) => (
//             <Col xs={12} sm={6} md={4} key={index}>
//               <Card className="request-card h-100 shadow-sm">
//                 <Card.Body>
//                   <Card.Title className="mb-3 text-primary fw-bold">
//                     Request ID: {req.request_id}
//                   </Card.Title>
//                   <Card.Text>
//                     <strong>Status:</strong> <span className={`status-badge ${req.status?.toLowerCase()}`}>{req.status}</span><br />
//                     <strong>Service Item:</strong>{" "}
//                     {
//                       serviceItems.find(item => item.service_item_id === req.service_item)?.service_item_name
//                       || req.service_item
//                     }
//                     <br />
//                     <strong>Preferred Service Date:</strong> {req.preferred_date}<br />
//                     <strong>Preferred Service Time:</strong> {req.preferred_time}<br />
//                     <strong>Requested At:</strong>{" "}
//                     {new Date(req.created_at).toLocaleString()}
//                     <br />
//                     <strong>Details:</strong> {req.request_details || 'N/A'}
//                   </Card.Text>
//                 </Card.Body>
//                 <Card.Footer className="bg-white border-top-0 d-flex flex-column gap-2">
//                   {/* Edit Button - Only show for editable requests */}
//                   {isEditable(req) && (
//                     <Button
//                       variant="warning"
//                       size="sm"
//                       className="w-100"
//                       onClick={() => handleEditClick(req)}
//                     >
//                       Edit Request
//                     </Button>
//                   )}
                  
//                   {/* Customer Complaints Button */}
//                   <Button
//                     variant="secondary"
//                     size="sm"
//                     className="w-100"
//                     onClick={() => handleComplaintClick(req.request_id)}
//                   >
//                     Customer Complaints
//                   </Button>
                  
//                   {closedRequestIds.includes(req.request_id) && (
//                     <Button
//                       variant={submittedFeedbackRequests.includes(req.request_id) ? "success" : "primary"}
//                       size="sm"
//                       className="w-100"
//                       onClick={() => navigate(`/feedback/${req.request_id}`)}
//                       disabled={submittedFeedbackRequests.includes(req.request_id)}
//                     >
//                       {submittedFeedbackRequests.includes(req.request_id)
//                         ? 'Feedback Submitted'
//                         : 'Give Feedback'}
//                     </Button>
//                   )}
//                 </Card.Footer>
//               </Card>
//             </Col>
//           ))
//         )}
//       </Row>

//       <div className="d-flex justify-content-center align-items-center mt-4 gap-3 flex-wrap">
//         <Button
//           onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//           disabled={currentPage === 1}
//         >
//           Previous
//         </Button>
//         <span className="fw-semibold">Page {currentPage} of {totalPages}</span>
//         <Button
//           onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//           disabled={currentPage === totalPages}
//         >
//           Next
//         </Button>
//       </div>

//       <NavScreen />
//     </div>
//   );
// };

// export default RequestScreen;


// import React, { useEffect, useState, useContext } from 'react';
// import NavScreen from '../../Screens/Navbar/Navbar';
// import axios from 'axios';
// import './Request.css';
// import { AuthContext } from "../../AuthContext/AuthContext";
// import baseURL from '../../ApiUrl/Apiurl';
// import { useNavigate } from 'react-router-dom';
// import { Card, Button, Form, Row, Col } from 'react-bootstrap';

// const RequestScreen = () => {
//   const [requests, setRequests] = useState([]);
//   const [filteredRequests, setFilteredRequests] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [submittedFeedbackRequests, setSubmittedFeedbackRequests] = useState([]);
//   const [closedRequestIds, setClosedRequestIds] = useState([]);

//   const { user } = useContext(AuthContext);
//   const userId = user?.customer_id;
//   const company_id = user?.company_id;
//   const navigate = useNavigate();

//   const [serviceItems, setServiceItems] = useState([]);

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

//   useEffect(() => {
//     if (user?.customer_id) {
//       axios
//         .get(`${baseURL}/service-items/?user_id=${userId}&company_id=${company_id}`)
//         .then((response) => {
//           if (Array.isArray(response.data?.data)) {
//             setServiceItems(response.data.data);
//           }
//         })
//         .catch((error) => {
//           console.error('Error fetching service items:', error);
//         });
//     }
//   }, [user?.customer_id]);

//   useEffect(() => {
//     if (user?.customer_id) {
//       axios
//         .get(`${baseURL}/service-pools/?user_id=${userId}&company_id=${company_id}`)
//         .then((response) => {
//           if (response.data?.status === 'success') {
//             const customerRequests = response.data.data
//               .filter((req) => req.customer === user.customer_id)
//               .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

//             setRequests(customerRequests);
//             setFilteredRequests(customerRequests);

//             const closedIds = customerRequests
//               .filter(req => (req.status || req.request_status || req.state || req.ServiceStatus)?.toLowerCase() === 'closed')
//               .map(req => req.request_id);

//             setClosedRequestIds(closedIds);
//           }
//         })
//         .catch((error) => {
//           console.error('Error fetching service requests:', error);
//         });
//     }
//   }, [user?.customer_id]);

//   useEffect(() => {
//     if (user?.customer_id) {
//       axios
//         .get(`${baseURL}/customer-surveys/?user_id=${userId}&company_id=${company_id}`)
//         .then((response) => {
//           const data = response.data?.data || response.data;
//           if (Array.isArray(data)) {
//             const feedbackSubmittedRequests = data.map(survey => survey.service_request);
//             setSubmittedFeedbackRequests(feedbackSubmittedRequests);
//           }
//         })
//         .catch((error) => {
//           console.error('Error fetching survey data:', error);
//         });
//     }
//   }, [user?.customer_id]);

//   useEffect(() => {
//     if (searchTerm === '') {
//       setFilteredRequests(requests);
//     } else {
//       const filtered = requests.filter(request =>
//         request.request_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         request.service_item.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         formatToIndianDate(request.preferred_date).includes(searchTerm.toLowerCase()) ||
//         request.preferred_time.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         (request.request_details && request.request_details.toLowerCase().includes(searchTerm.toLowerCase()))
//       );
//       setFilteredRequests(filtered);
//     }
//     setCurrentPage(1);
//   }, [searchTerm, requests]);

//   const handleComplaintClick = (requestId) => {
//     navigate('/complaint-form', { 
//       state: { 
//         service_request: requestId,
//         company: user?.company_id,
//         customer: user?.customer_id
//       } 
//     });
//   };

//   const handleEditClick = (request) => {
//     navigate('/service-form', { 
//       state: { 
//         editMode: true,
//         requestData: request 
//       } 
//     });
//   };

//   const totalPages = Math.ceil(filteredRequests.length / rowsPerPage);
//   const paginatedData = filteredRequests.slice(
//     (currentPage - 1) * rowsPerPage,
//     currentPage * rowsPerPage
//   );

//   // Check if request is editable (only allow editing for certain statuses)
//   const isEditable = (request) => {
//     const nonEditableStatuses = ['closed', 'completed', 'in progress'];
//     return !nonEditableStatuses.includes(request.status?.toLowerCase());
//   };

//   return (
//     <div className="request-screen-wrapper">
//       <h2 className="text-center mb-4">Request Screen</h2>

//       <Card className="toolbar-card shadow-sm p-3 mb-4">
//         <Row className="align-items-center g-3">
//           <Col xs="auto">
//             <Form.Label className="mb-0 fw-semibold">Show:</Form.Label>
//           </Col>
//           <Col xs="auto">
//             <Form.Select
//               value={rowsPerPage}
//               onChange={(e) => {
//                 setRowsPerPage(Number(e.target.value));
//                 setCurrentPage(1);
//               }}
//               className="rows-select"
//             >
//               <option value={5}>5</option>
//               <option value={10}>10</option>
//               <option value={25}>25</option>
//             </Form.Select>
//           </Col>

//           {/* 🔘 Add Request Button */}
//           <Col xs="auto">
//             <Button variant="primary" onClick={() => navigate('/service-form')}>
//               Add Request
//             </Button>
//           </Col>

//           <Col className="ms-auto">
//             <Form.Control
//               type="text"
//               placeholder="Search by ID, Service, Date..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="search-input"
//             />
//           </Col>
//         </Row>
//       </Card>

//       <Row className="g-4">
//         {paginatedData.length === 0 ? (
//           <p className="text-center">No {searchTerm ? 'matching' : ''} requests found.</p>
//         ) : (
//           paginatedData.map((req, index) => (
//             <Col xs={12} sm={6} md={4} key={index}>
//               <Card className="request-card h-100 shadow-sm">
//                 <Card.Body>
//                   <Card.Title className="mb-3 text-primary fw-bold">
//                     Request ID: {req.request_id}
//                   </Card.Title>
//                   <Card.Text>
//                     <strong>Status:</strong> <span className={`status-badge ${req.status?.toLowerCase()}`}>{req.status}</span><br />
//                     <strong>Service Item:</strong>{" "}
//                     {
//                       serviceItems.find(item => item.service_item_id === req.service_item)?.service_item_name
//                       || req.service_item
//                     }
//                     <br />
//                     <strong>Preferred Service Date:</strong> {formatToIndianDate(req.preferred_date)}<br />
//                     <strong>Preferred Service Time:</strong> {req.preferred_time}<br />
//                     <strong>Requested At:</strong>{" "}
//                     {formatToIndianDateTime(req.created_at)}
//                     <br />
//                     <strong>Details:</strong> {req.request_details || 'N/A'}
//                   </Card.Text>
//                 </Card.Body>
//                 <Card.Footer className="bg-white border-top-0 d-flex flex-column gap-2">
//                   {/* Edit Button - Only show for editable requests */}
//                   {isEditable(req) && (
//                     <Button
//                       variant="warning"
//                       size="sm"
//                       className="w-100"
//                       onClick={() => handleEditClick(req)}
//                     >
//                       Edit Request
//                     </Button>
//                   )}
                  
//                   {/* Customer Complaints Button */}
//                   <Button
//                     variant="secondary"
//                     size="sm"
//                     className="w-100"
//                     onClick={() => handleComplaintClick(req.request_id)}
//                   >
//                     Customer Complaints
//                   </Button>
                  
//                   {closedRequestIds.includes(req.request_id) && (
//                     <Button
//                       variant={submittedFeedbackRequests.includes(req.request_id) ? "success" : "primary"}
//                       size="sm"
//                       className="w-100"
//                       onClick={() => navigate(`/feedback/${req.request_id}`)}
//                       disabled={submittedFeedbackRequests.includes(req.request_id)}
//                     >
//                       {submittedFeedbackRequests.includes(req.request_id)
//                         ? 'Feedback Submitted'
//                         : 'Give Feedback'}
//                     </Button>
//                   )}
//                 </Card.Footer>
//               </Card>
//             </Col>
//           ))
//         )}
//       </Row>

//       <div className="d-flex justify-content-center align-items-center mt-4 gap-3 flex-wrap">
//         <Button
//           onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//           disabled={currentPage === 1}
//         >
//           Previous
//         </Button>
//         <span className="fw-semibold">Page {currentPage} of {totalPages}</span>
//         <Button
//           onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//           disabled={currentPage === totalPages}
//         >
//           Next
//         </Button>
//       </div>

//       <NavScreen />
//     </div>
//   );
// };

// export default RequestScreen;


import React, { useEffect, useState, useContext } from 'react';
import NavScreen from '../../Screens/Navbar/Navbar';
import axios from 'axios';
import './Request.css';
import { AuthContext } from "../../AuthContext/AuthContext";
import baseURL from '../../ApiUrl/Apiurl';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Form, Row, Col } from 'react-bootstrap';

const RequestScreen = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [submittedFeedbackRequests, setSubmittedFeedbackRequests] = useState([]);
  const [closedRequestIds, setClosedRequestIds] = useState([]);
  const [submittedComplaintRequests, setSubmittedComplaintRequests] = useState([]);
  const [complaintsData, setComplaintsData] = useState([]);
  const [feedbackData, setFeedbackData] = useState([]);

  const { user } = useContext(AuthContext);
  const userId = user?.customer_id;
  const company_id = user?.company_id;
  const navigate = useNavigate();

  const [serviceItems, setServiceItems] = useState([]);

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

  useEffect(() => {
    if (user?.customer_id) {
      axios
        .get(`${baseURL}/service-items/?user_id=${userId}&company_id=${company_id}`)
        .then((response) => {
          if (Array.isArray(response.data?.data)) {
            setServiceItems(response.data.data);
          }
        })
        .catch((error) => {
          console.error('Error fetching service items:', error);
        });
    }
  }, [user?.customer_id]);

  useEffect(() => {
    if (user?.customer_id) {
      axios
        .get(`${baseURL}/service-pools/?user_id=${userId}&company_id=${company_id}`)
        .then((response) => {
          if (response.data?.status === 'success') {
            const customerRequests = response.data.data
              .filter((req) => req.customer === user.customer_id)
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

            setRequests(customerRequests);
            setFilteredRequests(customerRequests);

            const closedIds = customerRequests
              .filter(req => (req.status || req.request_status || req.state || req.ServiceStatus)?.toLowerCase() === 'closed')
              .map(req => req.request_id);

            setClosedRequestIds(closedIds);
          }
        })
        .catch((error) => {
          console.error('Error fetching service requests:', error);
        });
    }
  }, [user?.customer_id]);

  // Fetch feedback/survey data
  useEffect(() => {
    if (user?.customer_id) {
      axios
        .get(`${baseURL}/customer-surveys/?user_id=${userId}&company_id=${company_id}`)
        .then((response) => {
          const data = response.data?.data || response.data;
          if (Array.isArray(data)) {
            const feedbackSubmittedRequests = data.map(survey => survey.service_request);
            setSubmittedFeedbackRequests(feedbackSubmittedRequests);
            setFeedbackData(data);
          }
        })
        .catch((error) => {
          console.error('Error fetching survey data:', error);
        });
    }
  }, [user?.customer_id]);

  // Fetch complaints data
  useEffect(() => {
    if (user?.customer_id) {
      axios
        .get(`${baseURL}/customer-complaints/?user_id=${userId}&company_id=${company_id}`)
        .then((response) => {
          if (response.data?.status === 'success' && Array.isArray(response.data.data)) {
            setComplaintsData(response.data.data);
            
            // Extract service_request IDs from complaints to track which requests have complaints submitted
            const complaintRequestIds = response.data.data.map(complaint => complaint.service_request);
            setSubmittedComplaintRequests(complaintRequestIds);
          }
        })
        .catch((error) => {
          console.error('Error fetching complaints data:', error);
        });
    }
  }, [user?.customer_id]);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredRequests(requests);
    } else {
      const filtered = requests.filter(request =>
        request.request_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.service_item.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formatToIndianDate(request.preferred_date).includes(searchTerm.toLowerCase()) ||
        request.preferred_time.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (request.request_details && request.request_details.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredRequests(filtered);
    }
    setCurrentPage(1);
  }, [searchTerm, requests]);

  const handleComplaintClick = (requestId) => {
    navigate('/complaint-form', { 
      state: { 
        service_request: requestId,
        company: user?.company_id,
        customer: user?.customer_id
      } 
    });
  };

  const handleEditClick = (request) => {
    navigate('/service-form', { 
      state: { 
        editMode: true,
        requestData: request 
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

  // Check if request is editable (only allow editing for certain statuses)
  const isEditable = (request) => {
    const nonEditableStatuses = ['closed', 'completed', 'in progress'];
    return !nonEditableStatuses.includes(request.status?.toLowerCase());
  };

  // Check if complaint is submitted for a request
  const isComplaintSubmitted = (requestId) => {
    return submittedComplaintRequests.includes(requestId);
  };

  // Check if feedback is submitted for a request
  const isFeedbackSubmitted = (requestId) => {
    return submittedFeedbackRequests.includes(requestId);
  };

  return (
    <div className="request-screen-wrapper">
      <h2 className="text-center mb-4">Request Screen</h2>

      <Card className="toolbar-card shadow-sm p-3 mb-4">
        <Row className="align-items-center g-3">
          <Col xs="auto">
            <Form.Label className="mb-0 fw-semibold">Show:</Form.Label>
          </Col>
          <Col xs="auto">
            <Form.Select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="rows-select"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
            </Form.Select>
          </Col>

          {/* 🔘 Add Request Button */}
          <Col xs="auto">
            <Button variant="primary" onClick={() => navigate('/service-form')}>
              Add Request
            </Button>
          </Col>

          <Col className="ms-auto">
            <Form.Control
              type="text"
              placeholder="Search by ID, Service, Date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
                    <strong>Status:</strong> <span className={`status-badge ${req.status?.toLowerCase()}`}>{req.status}</span><br />
                    <strong>Service Item:</strong>{" "}
                    {
                      serviceItems.find(item => item.service_item_id === req.service_item)?.service_item_name
                      || req.service_item
                    }
                    <br />
                    <strong>Preferred Service Date:</strong> {formatToIndianDate(req.preferred_date)}<br />
                    <strong>Preferred Service Time:</strong> {req.preferred_time}<br />
                    <strong>Requested At:</strong>{" "}
                    {formatToIndianDateTime(req.created_at)}
                    <br />
                    <strong>Details:</strong> {req.request_details || 'N/A'}
                  </Card.Text>
                </Card.Body>
                <Card.Footer className="bg-white border-top-0 d-flex flex-column gap-2">
                  {/* Edit Button - Only show for editable requests */}
                  {isEditable(req) && (
                    <Button
                      variant="warning"
                      size="sm"
                      className="w-100"
                      onClick={() => handleEditClick(req)}
                    >
                      Edit Request
                    </Button>
                  )}
                  
                  {/* Complaint Buttons - Both buttons shown, but Customer Complaints disabled if submitted */}
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
                        onClick={() => !isFeedbackSubmitted(req.request_id) && navigate(`/feedback/${req.request_id}`)}
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
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span className="fw-semibold">Page {currentPage} of {totalPages}</span>
        <Button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>

      <NavScreen />
    </div>
  );
};

export default RequestScreen;
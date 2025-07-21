// import React, { useEffect, useState, useContext} from 'react';
// import NavScreen from '../../Screens/Navbar/Navbar';
// import axios from 'axios';
// import './Request.css';
// import { AuthContext } from "../../AuthContext/AuthContext";
// import baseURL from '../../ApiUrl/Apiurl';

// const RequestScreen = () => {
//   const [requests, setRequests] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(5);

//     const { user } = useContext(AuthContext);
//     // const userId = localStorage.getItem('userId'); // e.g., 'custid00066'
//    const userId = user?.user_id; // Use optional chaining to avoid crash if user is null
//   const userName = user?.username;
//   console.log("from context data",userId,userName);
//   console.log("userdata",user);

// useEffect(() => {
//   if (user?.customer_id) {
//     axios
//       .get(`${baseURL}/service-pools/`)
//       .then((response) => {
//         if (response.data?.status === 'success') {
//          const filteredRequests = response.data.data
//             .filter((req) => req.customer === user.customer_id)
//             .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // Sort descending by created_at

//           setRequests(filteredRequests);
//         }
//       })
//       .catch((error) => {
//         console.error('Error fetching service requests:', error);
//       });
//   }
// }, [user?.customer_id]);



//   const totalPages = Math.ceil(requests.length / rowsPerPage);
//   const paginatedData = requests.slice(
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

//   return (
//     <div className="request-screen-wrapper">
//       <h2 className="text-center mt-1 mb-4">Request Screen</h2>
//  {/* <strong>Customer ID:</strong> {user?.customer_id || 'Loading...'} */}
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <label>
//           Show:{' '}
//           <select
//             value={rowsPerPage}
//             onChange={handleRowsPerPageChange}
//             className="form-select d-inline-block w-auto"
//           >
//             <option value={5}>5</option>
//             <option value={10}>10</option>
//             <option value={25}>25</option>
//           </select>{' '}
//           entries
//         </label>
//       </div>

//       <div className="table-container table-responsive p-0">
//         <table className="table table-bordered table-hover table-striped mb-0">
//           <thead className="table-dark">
//             <tr>
//               <th>S.No</th>
//               <th>Request ID</th>
//               <th>Service Item ID</th>
//               <th>Preferred Date</th>
//               <th>Preferred Time</th>
//               <th>Request Details</th>
//             </tr>
//           </thead>
//           <tbody>
//             {paginatedData.length === 0 ? (
//               <tr>
//                 <td colSpan="5" className="text-center">
//                   No requests found.
//                 </td>
//               </tr>
//             ) : (
//               paginatedData.map((req, index) => (
//                 <tr key={index}>
//                   <td>{index+1}</td>
//                   <td>{req.request_id}</td>
//                   <td>{req.service_item}</td>
//                   <td>{req.preferred_date}</td>
//                   <td>{req.preferred_time}</td>
//                   <td>{req.request_details}</td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//        <div className="d-flex justify-content-center align-items-center mt-3 gap-3 flex-wrap">
//           <button
//             className="btn btn-primary"
//             disabled={currentPage === 1}
//             onClick={() => handlePageChange(currentPage - 1)}
//           >
//             Previous
//           </button>
//           <span className="fw-semibold">
//             Page {currentPage} of {totalPages}
//           </span>
//           <button
//             className="btn btn-primary"
//             disabled={currentPage === totalPages}
//             onClick={() => handlePageChange(currentPage + 1)}
//           >
//             Next
//           </button>
//         </div>


//       <NavScreen />
//     </div>
//   );
// };

// export default RequestScreen;









import React, { useEffect, useState, useContext} from 'react';
import NavScreen from '../../Screens/Navbar/Navbar';
import axios from 'axios';
import './Request.css';
import { AuthContext } from "../../AuthContext/AuthContext";
import baseURL from '../../ApiUrl/Apiurl';

const RequestScreen = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

  const { user } = useContext(AuthContext);
  const userId = user?.customer_id;
  const company_id = user?.company_id;
  const userName = user?.username;
  // console.log("from context data",userId,userName);
  // console.log("userdata",user);

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
          }
        })
        .catch((error) => {
          console.error('Error fetching service requests:', error);
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
        request.preferred_date.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.preferred_time.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (request.request_details && request.request_details.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredRequests(filtered);
    }
    setCurrentPage(1); // Reset to first page when searching
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

  return (
    <div className="request-screen-wrapper">
      <h2 className="text-center mt-1 mb-4">Request Screen</h2>

    <div className="d-flex justify-content-between align-items-center mb-3 flex-nowrap overflow-hidden">
  <div className="d-flex align-items-center me-2" style={{ minWidth: '150px' }}>
    <label className="mb-0 text-nowrap">
      Show:{' '}
      <select
        value={rowsPerPage}
        onChange={handleRowsPerPageChange}
        className="form-select d-inline-block w-auto"
      >
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={25}>25</option>
      </select>{' '}
      entries
    </label>
  </div>
  
  <div className="search-bar flex-grow-1">
    <input
      type="text"
      placeholder="Search..."
      value={searchTerm}
      onChange={handleSearchChange}
      className="form-control"
      style={{ minWidth: '120px' }}
    />
  </div>
</div>

      <div className="table-container table-responsive p-0">
        <table className="table table-bordered table-hover mb-0">
          <thead className="table-dark">
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
                <td colSpan="6" className="text-center">
                  {searchTerm ? 'No matching requests found.' : 'No requests found.'}
                </td>
              </tr>
            ) : (
              paginatedData.map((req, index) => (
                <tr key={index}>
                  <td>{(currentPage - 1) * rowsPerPage + index + 1}</td>
                  <td>{req.request_id}</td>
                  <td>{req.service_item}</td>
                  <td>{req.preferred_date}</td>
                  <td>{req.preferred_time}</td>
                  <td>{req.request_details}</td>
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

      <NavScreen />
    </div>
  );
};

export default RequestScreen;
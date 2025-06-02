import React, { useEffect, useState, useContext} from 'react';
import NavScreen from '../../Screens/Navbar/Navbar';
import axios from 'axios';
import './Request.css';
import { AuthContext } from "../../AuthContext/AuthContext";

const RequestScreen = () => {
  const [requests, setRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

    const { user } = useContext(AuthContext);
    // const userId = localStorage.getItem('userId'); // e.g., 'custid00066'
   const userId = user?.user_id; // Use optional chaining to avoid crash if user is null
  const userName = user?.username;
  console.log("from context data",userId,userName);
  console.log("userdata",user);

useEffect(() => {
  if (user?.customer_id) {
    axios
      .get('http://175.29.21.7:8006/service-pools/')
      .then((response) => {
        if (response.data?.status === 'success') {
          const filteredRequests = response.data.data.filter(
            (req) => req.customer === user.customer_id
          );
          setRequests(filteredRequests);
        }
      })
      .catch((error) => {
        console.error('Error fetching service requests:', error);
      });
  }
}, [user?.customer_id]);



  const totalPages = Math.ceil(requests.length / rowsPerPage);
  const paginatedData = requests.slice(
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

  return (
    <div className="request-screen-wrapper">
      <h2 className="text-center mb-4">Request Screen</h2>
 {/* <strong>Customer ID:</strong> {user?.customer_id || 'Loading...'} */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <label>
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

      <div className="table-container table-responsive p-0">
        <table className="table table-bordered table-hover table-striped mb-0">
          <thead className="table-dark">
            <tr>
              <th>S.No</th>
              <th>Request ID</th>
              <th>Service Item ID</th>
              <th>Preferred Date</th>
              <th>Preferred Time</th>
              <th>Request Details</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">
                  No requests found.
                </td>
              </tr>
            ) : (
              paginatedData.map((req, index) => (
                <tr key={index}>
                  <td>{index+1}</td>
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

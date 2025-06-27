import React, { useEffect, useState, useContext } from 'react';
import NavScreen from '../../../Components/Screens/Navbar/Navbar';
import { FaUserPlus } from 'react-icons/fa';
import { AuthContext } from "../../AuthContext/AuthContext";
import { useNavigate } from 'react-router-dom';
import './ViewDelegate.css';
import baseURL from '../../ApiUrl/Apiurl';

const AddDelegates = () => {
  const { user } = useContext(AuthContext);
  const userId = user?.customer_id;
  const navigate = useNavigate();

  const [delegates, setDelegates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchDelegates = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${baseURL}/delegates/?customer=${userId}`);
      if (response.ok) {
        const data = await response.json();
        const filtered = (data.data || [])
          .filter((d) => d.customer === userId)
          .sort((a, b) => new Date(b.registered_at) - new Date(a.registered_at));
        setDelegates(filtered);
      } else {
        console.error('Failed to fetch delegates');
      }
    } catch (error) {
      console.error('Error fetching delegates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDelegates();
  }, [userId]);

  const handleAddDelegate = () => navigate('/add-delegates');
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };
  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const filteredDelegates = delegates.filter((d) =>
    Object.values(d).some((val) =>
      val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredDelegates.length / rowsPerPage);
  const paginatedData = filteredDelegates.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="delegate-table-container">
      <div className="delegate-table-header">
        <h2 className="delegate-table-title">My Delegates</h2>
        <button onClick={handleAddDelegate} className="delegate-table-add-btn">
           Add Delegate
        </button>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3 flex-nowrap overflow-hidden">
        <div className="d-flex align-items-center me-2" style={{ minWidth: '150px' }}>
          {/* <label className="mb-0 text-nowrap">
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
          </label> */}
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
        {isLoading ? (
          <div className="loading-message">Loading delegates...</div>
        ) : paginatedData.length > 0 ? (
          <table className="table table-bordered table-hover mb-0">
            <thead className="table-dark">
              <tr>
                <th>S.No</th>
                <th>Delegate ID</th>
                <th>Mobile Number</th>
                <th>Service Item</th>
                <th>Status</th>
                <th>Registered At</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((delegate, index) => (
                <tr key={delegate.delegate_id}>
                  <td>{(currentPage - 1) * rowsPerPage + index + 1}</td>
                  <td>{delegate.delegate_id}</td>
                  <td>{delegate.delegate_mobile}</td>
                  <td>{delegate.service_item}</td>
                  <td>
                    <span className={`status-badge ${delegate.status.toLowerCase()}`}>
                      {delegate.status}
                    </span>
                  </td>
                  <td>{new Date(delegate.registered_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-delegates-message">
            {searchTerm ? 'No matching delegates found.' : 'No delegates found for your account.'}
          </div>
        )}
      </div>

      {filteredDelegates.length > 0 && (
        <div className="d-flex justify-content-center align-items-center mt-3 gap-3 flex-wrap">
          <button
            className="btn btn-primary"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>
          <span className="fw-semibold">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="btn btn-primary"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}

      <NavScreen />
    </div>
  );
};

export default AddDelegates;

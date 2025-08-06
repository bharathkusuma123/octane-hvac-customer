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
    <div className="delegate-card-container">
      <div className="delegate-card-header">
        <h2 className="delegate-card-title">My Delegates</h2>
        <button onClick={handleAddDelegate} className="delegate-card-add-btn">
          <FaUserPlus className="delegate-card-add-icon" /> Add Delegate
        </button>
      </div>

      <div className="delegate-card-search-container">
        <input
          type="text"
          placeholder="Search delegates..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="delegate-card-search-input"
        />
      </div>

      <div className="delegate-card-grid">
        {isLoading ? (
          <div className="delegate-card-loading-message">Loading delegates...</div>
        ) : paginatedData.length > 0 ? (
          paginatedData.map((delegate, index) => (
            <div key={delegate.delegate_id} className="delegate-card-item">
              <div className="delegate-card-header-section">
                <span className="delegate-card-serial">
                  {(currentPage - 1) * rowsPerPage + index + 1}
                </span>
                <span 
                  className="delegate-card-id"
                  onClick={() => navigate(`/delegate-service-items/${delegate.delegate_id}`)}
                >
                  ID: {delegate.delegate_id}
                </span>
              </div>
              
              <div className="delegate-card-body-section">
                <div className="delegate-card-field">
                  <span className="delegate-card-label">Name:</span>
                  <span className="delegate-card-value">{delegate.delegate_name}</span>
                </div>
                
                <div className="delegate-card-field">
                  <span className="delegate-card-label">Mobile:</span>
                  <span className="delegate-card-value">{delegate.delegate_mobile}</span>
                </div>
                
                <div className="delegate-card-field">
                  <span className="delegate-card-label">Status:</span>
                  <span className={`delegate-card-status delegate-card-status-${delegate.status.toLowerCase()}`}>
                    {delegate.status}
                  </span>
                </div>
                
                <div className="delegate-card-field">
                  <span className="delegate-card-label">Registered:</span>
                  <span className="delegate-card-value">
                    {new Date(delegate.registered_at).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="delegate-card-empty-message">
            {searchTerm ? 'No matching delegates found.' : 'No delegates found for your account.'}
          </div>
        )}
      </div>

      <NavScreen />
    </div>
  );
};

export default AddDelegates;
import React, { useEffect, useState, useContext } from 'react';
import NavScreen from '../../../Components/Screens/Navbar/Navbar';
import { FaUserPlus } from 'react-icons/fa';
import { AuthContext } from "../../AuthContext/AuthContext";
import { useNavigate } from 'react-router-dom';
import './ViewDelegate.css'; // Make sure to create/add these styles
import baseURL from '../../ApiUrl/Apiurl';

const AddDelegates = () => {
  const { user } = useContext(AuthContext);
  const userId = user?.customer_id;
  const [delegates, setDelegates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch delegates
const fetchDelegates = async () => {
  setIsLoading(true);
  try {
    const response = await fetch(`${baseURL}/delegates/?customer=${userId}`);
    if (response.ok) {
      const data = await response.json();
      const filteredDelegates = (data.data || [])
        .filter((delegate) => delegate.customer === userId)
        .sort((a, b) => new Date(b.registered_at) - new Date(a.registered_at)); // Sort descending
      setDelegates(filteredDelegates);
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

  const handleAddDelegate = () => {
    navigate('/add-delegates');
  };

  return (
    <div className="delegate-table-container">
      <div className="delegate-table-header">
        <h2 className="delegate-table-title">My Delegates</h2>
        <button onClick={handleAddDelegate} className="delegate-table-add-btn">
          Add Delegate
        </button>
      </div>

      <div className="table-responsive">
        {isLoading ? (
          <div className="loading-message">Loading delegates...</div>
        ) : delegates.length > 0 ? (
          <table className="delegates-table">
            <thead>
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
              {delegates.map((delegate, index) => (
                <tr key={delegate.delegate_id}>
                  <td>{index+1}</td>
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
            No delegates found for your account.
          </div>
        )}
      </div>

      <NavScreen />
    </div>
  );
};

export default AddDelegates;
import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from "../../AuthContext/AuthContext";
import { FaUserPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import NavScreen from '../../../Components/Screens/Navbar/Navbar';
import './AddDelegate.css'
import baseURL from '../../ApiUrl/Apiurl';

const AddDelegate = () => {
  const { user } = useContext(AuthContext);
  const userId = user?.customer_id;
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    service_item: '',
    delegate_mobile: '',
    customer: userId,
     delegate_id: '',
  });

  const [serviceItems, setServiceItems] = useState([]);


  useEffect(() => {
  const fetchDelegates = async () => {
    try {
      const response = await fetch(`${baseURL}/delegates/?customer=${userId}`);
      if (response.ok) {
        const result = await response.json();
        const userDelegates = result.data || [];
        const nextNumber = userDelegates.length + 1;
        const formattedNumber = String(nextNumber).padStart(2, '0');
        setForm(prev => ({
          ...prev,
          delegate_id: `${userId}-${formattedNumber}`
        }));
      } else {
        console.error('Failed to fetch delegates');
      }
    } catch (error) {
      console.error('Error fetching delegates:', error);
    }
  };

  if (userId) {
    fetchDelegates();
  }
}, [userId]);


  // Generate delegate ID
  const delegate_id = Math.floor(Math.random() * 1000000).toString();

  // Fetch service items
  useEffect(() => {
    const fetchServiceItems = async () => {
      try {
        const response = await fetch(`${baseURL}/service-items/`);
        if (response.ok) {
          const result = await response.json();
          const serviceItemsArray = result.data;
          const filteredItems = serviceItemsArray.filter(item => item.customer === userId);
          setServiceItems(filteredItems);
        } else {
          console.error('Failed to fetch service items');
        }
      } catch (error) {
        console.error('Error fetching service items:', error);
      }
    };

    fetchServiceItems();
  }, [userId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      customer: userId,
      created_by: userId,
      status: "Active",
        delegate_id: form.delegate_id
    };

    try {
      const response = await fetch(`${baseURL}/delegates/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert('Delegate added successfully!'); 
        navigate('/view-delegates'); 
      } else {
        const errorData = await response.json();
        alert('Failed to add delegate: ' + (errorData.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="container add-delegate-form">
      <div className="card">
        <div className="card-header">
          <h5 className="mb-1">Add Delegate</h5>
          {/* <p>{userId}</p> */}
          <h6 className="text" style={{ color: 'white' }}>
            Please fill in the delegate details
          </h6>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="formlabel" style={{ marginLeft: '-155px' }}>Service Item</label>
                <select
                  name="service_item"
                  value={form.service_item}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  <option value="">Select Service Item</option>
                  {serviceItems.length === 0 ? (
                    <option value="" disabled>No service items found</option>
                  ) : (
                    serviceItems.map((item) => (
                      <option key={item.service_item_id} value={item.service_item_id}>
                        {item.service_item_id} - {item.serial_number}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="col-md-6">
                <label className="formlabel" style={{ marginLeft: '-155px' }}>Mobile Number</label>
                <input
                  type="tel"
                  name="delegate_mobile"
                  value={form.delegate_mobile}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter 10-digit mobile number"
                  required
                  pattern="[0-9]{10}"
                  title="Please enter a 10-digit mobile number"
                />
              </div>

              <div className="d-flex justify-content-center mt-3 gap-3">
                <button
                  type="button"
                  className="submit-btn"
                  onClick={() => navigate('/view-delegates')}
                  style={{ background: '#ccc', color: '#000' }}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                   Add Delegate
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <NavScreen />
    </div>
  );
};

export default AddDelegate;
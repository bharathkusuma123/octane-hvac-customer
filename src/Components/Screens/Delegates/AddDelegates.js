import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from "../../AuthContext/AuthContext";
import { FaUserPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import NavScreen from '../../../Components/Screens/Navbar/Navbar';
import './AddDelegate.css'

const AddDelegate = () => {
  const { user } = useContext(AuthContext);
  const userId = user?.customer_id;
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    service_item: '',
    delegate_mobile: '',
    customer: userId,
  });

  const [serviceItems, setServiceItems] = useState([]);

  // Generate delegate ID
  const delegate_id = Math.floor(Math.random() * 1000000).toString();

  // Fetch service items
  useEffect(() => {
    const fetchServiceItems = async () => {
      try {
        const response = await fetch('http://175.29.21.7:8006/service-items/');
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
      delegate_id: delegate_id
    };

    try {
      const response = await fetch('http://175.29.21.7:8006/delegates/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert('Delegate added successfully!'); 
        navigate('/view-delegates'); // Redirect back to view delegates after successful submission
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
    <div className="service-form-container">
      <h2 className="sr-heading">Add Delegate</h2>
      
      <form className="service-form" onSubmit={handleSubmit}>
        <div className="form-group select-wrapper">
          <label htmlFor="service_item">Service Item</label>
          <select
            name="service_item"
            id="service_item"
            value={form.service_item}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="">Select Service Item</option>
            {serviceItems.length === 0 ? (
              <option value="" disabled>
                No service items available
              </option>
            ) : (
              serviceItems.map((item) => (
                <option key={item.service_item_id} value={item.service_item_id}>
                  {item.service_item_id} - {item.serial_number}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="delegate_mobile">Mobile Number</label>
          <input
            type="tel"
            name="delegate_mobile"
            id="delegate_mobile"
            value={form.delegate_mobile}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter 10-digit mobile number"
            required
            pattern="[0-9]{10}"
            title="Please enter a 10-digit mobile number"
          />
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={() => navigate('/view-delegates')}>
            Cancel
          </button>
          <button type="submit" className="submit-btn">
            <FaUserPlus style={{ marginRight: '8px' }} /> Add Delegate
          </button>
        </div>
      </form>

      <NavScreen />
    </div>
  );
};

export default AddDelegate;
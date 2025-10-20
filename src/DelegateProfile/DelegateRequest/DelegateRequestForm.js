import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from "../../Components/AuthContext/AuthContext";
import DelegateNavbar from "../DelegateNavbar/DelegateNavbar";
import './DelegateRequestForm.css';
import { useNavigate } from 'react-router-dom';
import baseURL from '../../Components/ApiUrl/Apiurl';
import { useDelegateServiceItems } from '../../Components/AuthContext/DelegateServiceItemContext';

const DelegateRequestForm = () => {
  const { user } = useContext(AuthContext);
  const [delegateId, setDelegateId] = useState('');
  const [company, setCompany] = useState('');
  const [customer, setCustomer] = useState('');
  const navigate = useNavigate();
  const { selectedServiceItem, serviceItems } = useDelegateServiceItems();

  const [formData, setFormData] = useState({
    serviceItem: selectedServiceItem || '', // Set initial value from context
    preferredDate: '',
    preferredTime: '',
    description: ''
  });

  // Update formData when selectedServiceItem changes
  useEffect(() => {
    if (selectedServiceItem) {
      setFormData(prev => ({
        ...prev,
        serviceItem: selectedServiceItem
      }));
    }
  }, [selectedServiceItem]);

  useEffect(() => {
    if (user?.delegate_id) {
      setDelegateId(user.delegate_id);

      // Fetch delegate details
      fetch(`${baseURL}/delegates/`)
        .then((res) => res.json())
        .then((data) => {
          const match = data?.data?.find(d => d.delegate_id === user.delegate_id);
          if (match) {
            setCompany(match.company || '');
            setCustomer(match.customer || '');
          }
        })
        .catch((err) => {
          console.error("Error fetching delegate data:", err);
        });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if service item is selected
    if (!selectedServiceItem) {
      alert("Please select a Service Item from the navbar dropdown first.");
      return;
    }

    // Format preferred_time to "HH:mm:ss"
    const preferredTimeFormatted = `${formData.preferredTime}:00`;

    // Get current date and time for other datetime fields
    const now = new Date().toISOString();

    const payload = {
      dynamics_service_order_no: "",
      source_type: "Machine Alert",
      request_details: formData.description,
      alert_details: "",
      requested_by: delegateId,
      preferred_date: formData.preferredDate,
      preferred_time: preferredTimeFormatted,
      status: "Open",
      estimated_completion_time: null,
      estimated_price: "0",
      est_start_datetime: now,
      est_end_datetime: now,
      act_start_datetime: now,
      act_end_datetime: now,
      act_material_cost: "0",
      act_labour_hours: "0",
      act_labour_cost: "0",
      completion_notes: "",
      created_by: delegateId,
      updated_by: delegateId,
      company: company,
      service_item: formData.serviceItem, // This will be the selectedServiceItem
      customer: customer,
      pm_group: "",
      assigned_engineer: "",
      reopened_from: "",
      user_id: customer,
      company_id: company
    };
    console.log("payload", payload);

    try {
      const response = await fetch(`${baseURL}/service-pools/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      console.log("API Response:", result);

      if (response.ok) {
        alert("Service request submitted successfully!");
        setFormData({
          serviceItem: selectedServiceItem, // Keep the selected service item
          preferredDate: '',
          preferredTime: '',
          description: ''
        });
      } else {
        console.error("Failed response:", result);
        alert("Submission failed: " + (result.message || "Please check the input."));
      }
      navigate('/delegate-display-request');

    } catch (error) {
      console.error("Submission error:", error);
      alert("Something went wrong while submitting the form.");
    }
  };

  // Get service item name for display
  const getServiceItemName = () => {
    if (!selectedServiceItem) return 'Not Selected';
    const item = serviceItems.find(item => item.service_item === selectedServiceItem);
    return item ? item.service_item_name || selectedServiceItem : selectedServiceItem;
  };

  return (
    <div className="form-container">
      <DelegateNavbar />
      <h3>Delegate Request Form</h3>

      {/* Display selected service item information */}
      <div className="service-item-info">
        {!selectedServiceItem && (
          <p className="warning-text">
            ⚠️ Please select a Service Item from the navbar dropdown first.
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Service Item Display (non-editable) */}
        <label htmlFor="serviceItemDisplay">Service Item</label>
        <input
          type="text"
          id="serviceItemDisplay"
          value={getServiceItemName()}
          disabled
          className="disabled-field"
          placeholder="Select a service item from navbar"
        />

        {/* Hidden field to store the actual service_item value */}
        <input
          type="hidden"
          name="serviceItem"
          value={selectedServiceItem}
        />

        <label htmlFor="preferredDate">Preferred Date</label>
        <input
          type="date"
          name="preferredDate"
          id="preferredDate"
          value={formData.preferredDate}
          onChange={handleChange}
          required
          disabled={!selectedServiceItem}
        />

        <label htmlFor="preferredTime">Preferred Time</label>
        <input
          type="time"
          name="preferredTime"
          id="preferredTime"
          value={formData.preferredTime}
          onChange={handleChange}
          required
          disabled={!selectedServiceItem}
        />

        <label htmlFor="description">Description</label>
        <textarea
          name="description"
          id="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          required
          disabled={!selectedServiceItem}
          placeholder={!selectedServiceItem ? "Please select a service item first" : ""}
        />

        <div className="button-group">
          <button 
            type="submit" 
            disabled={!selectedServiceItem}
            className={!selectedServiceItem ? 'disabled-button' : ''}
          >
            {!selectedServiceItem ? 'Select Service Item First' : 'Submit Request'}
          </button>
          {/* <button 
            type="button"
            onClick={() => navigate(-1)}
            className="back-button"
          >
            Back
          </button> */}
        </div>
      </form>
    </div>
  );
};

export default DelegateRequestForm;
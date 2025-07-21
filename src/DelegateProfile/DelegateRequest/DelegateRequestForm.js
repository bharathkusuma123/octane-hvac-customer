import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from "../../Components/AuthContext/AuthContext";
import DelegateNavbar from "../DelegateNavbar/DelegateNavbar";
import './DelegateRequestForm.css';

const DelegateRequestForm = () => {
  const { user } = useContext(AuthContext);
  const [delegateId, setDelegateId] = useState('');
  const [company, setCompany] = useState('');
  const [customer, setCustomer] = useState('');
  const [serviceItems, setServiceItems] = useState([]); // 👈 New state for service items

  const [formData, setFormData] = useState({
    serviceItem: '',
    preferredDate: '',
    preferredTime: '',
    description: ''
  });

  useEffect(() => {
    if (user?.delegate_id) {
      setDelegateId(user.delegate_id);

      // Fetch delegate details
      fetch('http://175.29.21.7:8006/delegates/')
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

      // Fetch service items for this delegate
      fetch('http://175.29.21.7:8006/delegate-service-item-tasks/')
        .then((res) => res.json())
        .then((data) => {
          const filteredItems = data?.data?.filter(item => item.delegate === user.delegate_id);
          setServiceItems(filteredItems || []);
        })
        .catch((err) => {
          console.error("Error fetching service items:", err);
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

  // Format preferred_time to "HH:mm:ss"
  const preferredTimeFormatted = `${formData.preferredTime}:00`;

  // Get current date and time for other datetime fields (still using full ISO format where needed)
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
    estimated_completion_time: preferredTimeFormatted, // <- FIXED format
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
    service_item: formData.serviceItem,
    customer: customer,
    pm_group: "",
    assigned_engineer: "",
    reopened_from: ""
  };
  console.log("payload", payload);

  try {
    const response = await fetch("http://175.29.21.7:8006/service-pools/", {
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
        serviceItem: '',
        preferredDate: '',
        preferredTime: '',
        description: ''
      });
    } else {
      console.error("Failed response:", result);
      alert("Submission failed: " + (result.message || "Please check the input."));
    }

  } catch (error) {
    console.error("Submission error:", error);
    alert("Something went wrong while submitting the form.");
  }
};



  return (
    <div className="form-container">
      <DelegateNavbar />
      <h3>Delegate Request Form</h3>

      <p><strong>Delegate ID:</strong> {delegateId}</p>
      <p><strong>Company:</strong> {company}</p>
      <p><strong>Customer:</strong> {customer}</p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="serviceItem">Service Item</label>
        <select
          name="serviceItem"
          id="serviceItem"
          value={formData.serviceItem}
          onChange={handleChange}
          required
        >
          <option value="">Select Service Item</option>
          {serviceItems.map(item => (
            <option key={item.item_id} value={item.service_item}>
              {item.service_item}
            </option>
          ))}
        </select>

        <label htmlFor="preferredDate">Preferred Date</label>
        <input
          type="date"
          name="preferredDate"
          id="preferredDate"
          value={formData.preferredDate}
          onChange={handleChange}
          required
        />

        <label htmlFor="preferredTime">Preferred Time</label>
        <input
          type="time"
          name="preferredTime"
          id="preferredTime"
          value={formData.preferredTime}
          onChange={handleChange}
          required
        />

        <label htmlFor="description">Description</label>
        <textarea
          name="description"
          id="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          required
        />

        <button type="submit">Submit Request</button>
      </form>
    </div>
  );
};

export default DelegateRequestForm;

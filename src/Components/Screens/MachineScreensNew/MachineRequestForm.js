// ServiceRequestForm.js (Updated for both Service Manager and Customer)
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import baseURL from '../../ApiUrl/Apiurl';
import { AuthContext } from '../../AuthContext/AuthContext';
import NavScreen from '../../../Components/Screens/Navbar/Navbar';
import './Newstyles.css'



const MachineRequestForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const company_id = user?.company_id;
  const userId = user?.customer_id;
  
  // Get the data from navigation state
  const errorData = location.state?.errorData;
  const pcbSerialNumber = location.state?.pcb_serial_number;
  const errorCodeId = location.state?.error_code_id;
  const source = location.state?.source; // 'customer' or 'servicemanager'
  const alarmData = location.state?.alarmData; // Get existing alarm data if any
  
  const [form, setForm] = useState({
    service_item: '',
    preferred_date: '',
    preferred_time: '',
    request_details: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serviceItems, setServiceItems] = useState([]);
  const [matchedServiceItem, setMatchedServiceItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [customer, setCustomer] = useState('');

  // Fetch service items - for both customer and service manager
  useEffect(() => {
    const fetchServiceItems = async () => {
      try {
        setIsLoading(true);
        
        const response = await fetch(`${baseURL}/service-items/?user_id=${userId}&company_id=${company_id}`);
        const data = await response.json();
        
        if (data.status === 'success') {
          setServiceItems(data.data);
          
          // For service manager: Find the service item that matches the PCB serial number
          if (source !== 'customer') {
            const matchedItem = data.data.find(item => 
              item.pcb_serial_number === pcbSerialNumber
            );
            
            if (matchedItem) {
              setMatchedServiceItem(matchedItem);
              setForm(prev => ({
                ...prev,
                service_item: matchedItem.service_item_id
              }));

              // Set customer directly from the matched item
              if (matchedItem.customer) {
                setCustomer(matchedItem.customer);
              }
            }
          } else {
            // For customer: Auto-select the first available service item or set a default
            if (data.data.length > 0) {
              const defaultServiceItem = data.data[0];
              setForm(prev => ({
                ...prev,
                service_item: defaultServiceItem.service_item_id
              }));
              if (defaultServiceItem.customer) {
                setCustomer(defaultServiceItem.customer);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching service items:', error);
        alert('Error loading service items');
      } finally {
        setIsLoading(false);
      }
    };

    if (userId && company_id) {
      fetchServiceItems();
    } else {
      setIsLoading(false);
    }
  }, [pcbSerialNumber, userId, company_id, source]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));

    // If service item is manually selected, find and set customer
    if (name === 'service_item' && value) {
      const selectedItem = serviceItems.find(item => item.service_item_id === value);
      if (selectedItem && selectedItem.customer) {
        setCustomer(selectedItem.customer);
      } else {
        setCustomer(''); // Reset if no customer found
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate that service_item is provided
      if (!form.service_item) {
        alert('Please select a service item');
        setIsSubmitting(false);
        return;
      }

      // Prepare Payload - service_item is now required for both
      const payload = {
        service_item: form.service_item, // This field is now always provided
        preferred_date: form.preferred_date,
        preferred_time: form.preferred_time,
        request_details: form.request_details,
        user_id: userId,
        requested_by: userId,
        company_id: company_id,
        status: 'Open', 
        company: company_id,
        created_by: userId,
        updated_by: userId,
        source_type: 'Machine Alert',
        customer: customer || userId, // Use customer from service item or fallback to userId
      };

      // Add additional fields based on source
      if (source !== 'customer') {
        // For service manager, we might have additional fields
        if (customer) {
          payload.customer = customer;
        }
      }

      console.log("📦 Payload being sent to API:", payload);

      // Make API Call
      const response = await fetch(`${baseURL}/service-pools/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // Parse Response
      const result = await response.json();
      console.log("📬 Raw API Response:", result);

      // Handle Response
      if (response.ok) {
        console.log("✅ Service request submitted successfully!");
        alert('Service request submitted successfully!');
        
        // Navigate back to alarms page with PCB serial number
        navigate('/alarms', { 
          state: { 
            deviceId: pcbSerialNumber, // Pass PCB serial number as deviceId
            alarmData: alarmData, // Pass existing alarm data if any
            userId: userId,
            company_id: company_id
          } 
        });
      } else {
        console.error("❌ Failed to submit service request:", result);
        throw new Error(result.message || 'Failed to submit service request');
      }

    } catch (error) {
      // Error Handling
      console.error("🚨 Error submitting service request:", error);
      alert(`Error submitting service request: ${error.message}`);
    } finally {
      // Cleanup
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Navigate back to alarms page with PCB serial number
    navigate('/alarms', { 
      state: { 
        deviceId: pcbSerialNumber, // Pass PCB serial number as deviceId
        alarmData: alarmData, // Pass existing alarm data if any
        userId: userId,
        company_id: company_id
      } 
    });
  };

  // Get today's date in YYYY-MM-DD format for min date
  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  if (isLoading) {
    return (
      <div className="container service-request-form mt-4">
        <div className="card">
          <div className="card-body text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container service-request-form new-styles">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-1">
            {source === 'customer' ? 'Machine Alert Service Request' : 'Service Request Form'}
          </h5>
          <h6 className="text mb-0" style={{ color: 'white', opacity: 0.9 }}>
            Please fill in the service request details
          </h6>
          {pcbSerialNumber && (
            <div className="mt-2">
              <small>PCB Serial Number: <strong>{pcbSerialNumber}</strong></small>
              {matchedServiceItem && source !== 'customer' && (
                <small className="ms-3">
                  Matched Service: <strong>{matchedServiceItem.service_item_name}</strong>
                </small>
              )}
              {customer && (
                <small className="ms-3 d-block mt-1">
                  Customer: <strong>{customer}</strong>
                </small>
              )}
            </div>
          )}
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              {/* Service Item Field - Show for both customer and service manager */}
             

              <div className="col-md-6">
                <label className="form-label fw-bold">Preferred Service Date *</label>
                <input
                  type="date"
                  name="preferred_date"
                  value={form.preferred_date}
                  onChange={handleChange}
                  className="form-control"
                  required
                  disabled={isSubmitting}
                  min={getTodayDate()}
                />
                <div className="form-text">
                  Select your preferred date for service
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold">Preferred Service Time *</label>
                <input
                  type="time"
                  name="preferred_time"
                  value={form.preferred_time}
                  onChange={handleChange}
                  className="form-control"
                  required
                  disabled={isSubmitting}
                />
                <div className="form-text">
                  Select your preferred time for service
                </div>
              </div>

              <div className="col-12">
                <label className="form-label fw-bold">Request Details *</label>
                <textarea
                  name="request_details"
                  value={form.request_details}
                  onChange={handleChange}
                  className="form-control"
                  rows="6"
                  required
                  disabled={isSubmitting}
                  placeholder="Describe the issue or service required in detail..."
                />
                <div className="form-text">
                  Please provide detailed information about the issue or service you require. 
                  Include any error messages, symptoms, or specific requirements.
                </div>
              </div>

              <div className="d-flex justify-content-center mt-4 gap-3">
                <button 
                  type="button" 
                  className="btn btn-secondary btn-lg" 
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary btn-lg" 
                  disabled={isSubmitting || !form.service_item}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Submitting...
                    </>
                  ) : (
                    'Submit Request'
                  )}
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

export default MachineRequestForm;
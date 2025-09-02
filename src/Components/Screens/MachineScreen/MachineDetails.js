import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NavScreen from '../Navbar/Navbar';
import { AuthContext } from "../../AuthContext/AuthContext";
import './MachineDetails.css';

const permissionFields = [
  { key: "can_raise_service_request", label: "Raise Request" },
  { key: "can_close_service_request", label: "Close Request" },
  { key: "can_submit_customer_satisfaction_survey", label: "CSAT Survey" },
  { key: "can_log_customer_complaints", label: "Customer Complaints" },
  { key: "can_monitor_equipment", label: "Monitor Equipment" },
  { key: "can_control_equipment", label: "Control Equipment" },
];

// PM Schedule Task Component
const PMScheduleTasks = ({ serviceItemId, userId, company_id }) => {
  const [pmSchedules, setPmSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [activeFilter, setActiveFilter] = useState('customer'); // Default to customer
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to convert date to Indian format (DD-MM-YYYY)
  const formatToIndianDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      
      return `${day}-${month}-${year}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString; // Return original if formatting fails
    }
  };

  const handleRaiseRequest = (schedule) => {
    // Handle raise request logic here
    console.log('Raising request for schedule:', schedule);
    alert(`Raising request for PM Schedule: ${schedule.pm_schedule_id}`);
    // You can implement your API call or navigation logic here
  };

  useEffect(() => {
    const fetchPmSchedules = async () => {
      if (!userId || !company_id) return;
      
      try {
        setLoading(true);
        const response = await fetch(
          `http://175.29.21.7:8006/service-item-pm-schedules/?user_id=${userId}&company_id=${company_id}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch PM schedules');
        }
        
        const result = await response.json();
        
        if (result.status === "success") {
          // Filter to only include schedules where service_item matches the current serviceItemId
          const filteredSchedules = result.data.filter(
            schedule => schedule.service_item === serviceItemId
          );
          setPmSchedules(filteredSchedules);
          
          // Set initial filtered schedules (customer by default)
          const customerSchedules = filteredSchedules.filter(
            schedule => schedule.responsible.toLowerCase() === "customer"
          );
          setFilteredSchedules(customerSchedules);
        } else {
          throw new Error(result.message || 'Failed to retrieve PM schedules');
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching PM schedules:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPmSchedules();
  }, [userId, company_id, serviceItemId]);

  // Handle filter change
  const handleFilterChange = (filterType) => {
    setActiveFilter(filterType);
    
    if (filterType === 'all') {
      setFilteredSchedules(pmSchedules);
    } else {
      const filtered = pmSchedules.filter(
        schedule => schedule.responsible.toLowerCase() === filterType
      );
      setFilteredSchedules(filtered);
    }
  };

  if (loading) {
    return <p className="machine-details-loading">Loading PM schedules...</p>;
  }

  if (error) {
    return <p className="machine-details-error">Error: {error}</p>;
  }

  return (
     <div className="pm-schedule-section">
      <div className="pm-schedule-header">
        <h3 className="machine-details-subtitle">PM Schedule Tasks</h3>
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${activeFilter === 'factory' ? 'active' : ''}`}
            onClick={() => handleFilterChange('factory')}
          >
            Factory
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'customer' ? 'active' : ''}`}
            onClick={() => handleFilterChange('customer')}
          >
            Customer
          </button>
          {/* <button 
            className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => handleFilterChange('all')}
          >
            All
          </button> */}
        </div>
      </div>
      
      {filteredSchedules.length > 0 ? (
        <div className="pm-schedule-cards-container">
          {filteredSchedules.map((schedule, index) => (
            <div key={schedule.pm_schedule_id} className="pm-schedule-card">
              <div className="pm-schedule-card-header">
                <span className="pm-schedule-card-sno">{index + 1}</span>
                <h4 className="pm-schedule-card-id">{schedule.pm_schedule_id}</h4>
                <div className="pm-schedule-header-right">
                  <span className={`pm-schedule-status pm-status-${schedule.status.toLowerCase()}`}>
                    {schedule.status}
                  </span>
                  {schedule.responsible.toLowerCase() === 'customer' && schedule.status.toLowerCase() === 'pending' && (
                    <button 
                      className="raise-request-btn"
                      onClick={() => handleRaiseRequest(schedule)}
                    >
                      Raise Request
                    </button>
                  )}
                </div>
              </div>
              
              <div className="pm-schedule-card-body">
                <div className="pm-schedule-card-row">
                  <span className="pm-schedule-card-label">Responsible:</span>
                  <span className="pm-schedule-card-value">{schedule.responsible}</span>
                </div>
                
                <div className="pm-schedule-card-row">
                  <span className="pm-schedule-card-label">Description:</span>
                  <span className="pm-schedule-card-value">{schedule.description}</span>
                </div>
                
                <div className="pm-schedule-card-row">
                  <span className="pm-schedule-card-label">Task Type:</span>
                  <span className="pm-schedule-card-value">{schedule.task_type}</span>
                </div>
                
                <div className="pm-schedule-card-row">
                  <span className="pm-schedule-card-label">Due Date:</span>
                  <span className="pm-schedule-card-value">{formatToIndianDate(schedule.due_date)}</span>
                </div>
                
                <div className="pm-schedule-card-row">
                  <span className="pm-schedule-card-label">Alert Date:</span>
                  <span className="pm-schedule-card-value">{formatToIndianDate(schedule.alert_date)}</span>
                </div>
                
                <div className="pm-schedule-card-row">
                  <span className="pm-schedule-card-label">Overdue Alert Date:</span>
                  <span className="pm-schedule-card-value">{formatToIndianDate(schedule.overdue_alert_date)}</span>
                </div>
                
                <div className="pm-schedule-card-row">
                  <span className="pm-schedule-card-label">Last Serviced:</span>
                  <span className="pm-schedule-card-value">{formatToIndianDate(schedule.last_serviced_date) || 'N/A'}</span>
                </div>
                
                <div className="pm-schedule-card-row">
                  <span className="pm-schedule-card-label">Chart:</span>
                  <span className="pm-schedule-card-value">{schedule.chart}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="machine-details-empty">No PM schedule tasks found for this filter.</p>
      )}
    </div>
  );
};

const MachineDetails = () => {
  const { serviceItemId } = useParams();
  const { user } = useContext(AuthContext);
  const userId = user?.customer_id;
  const company_id = user?.company_id;

  const [delegates, setDelegates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState(null); 
  const [submittedDelegates, setSubmittedDelegates] = useState(() => {
    const saved = localStorage.getItem('submittedDelegates');
    return saved ? JSON.parse(saved) : [];
  });
  const [assignedPermissions, setAssignedPermissions] = useState([]);
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    const fetchServiceContracts = async () => {
      try {
        const response = await fetch(
          `http://175.29.21.7:8006/service-contracts/?user_id=${userId}&company_id=${company_id}`
        );

        if (!response.ok) throw new Error("Failed to fetch contracts");

        const result = await response.json();

        // Filter all contracts that match this serviceItemId
        const matchedContracts = result.data.filter(
          (item) => item.service_item === serviceItemId
        );

        setContracts(matchedContracts);
      } catch (err) {
        console.error("Error fetching service contracts:", err);
      }
    };

    if (userId && serviceItemId) {
      fetchServiceContracts();
    }
  }, [userId, serviceItemId, company_id]);

  useEffect(() => {
    const fetchDelegates = async () => {
      try {
        const [delegateRes, taskRes] = await Promise.all([
          fetch(`http://175.29.21.7:8006/delegates/`),
          fetch(`http://175.29.21.7:8006/delegate-service-item-tasks/`),
        ]);

        if (!delegateRes.ok || !taskRes.ok) throw new Error('API fetch error');

        const delegateData = await delegateRes.json();
        const taskData = await taskRes.json();

        // Get all previous assignments
        setAssignedPermissions(taskData.data);

        const filteredDelegates = delegateData.data
          .filter((d) => d.customer === userId)
          .map((d) => {
            const existing = taskData.data.find(
              (item) =>
                item.service_item === serviceItemId &&
                item.delegate === d.delegate_id
            );

            return {
              ...d,
              ...permissionFields.reduce((acc, field) => {
                acc[field.key] = existing ? Boolean(existing[field.key]) : false;
                return acc;
              }, {}),
            };
          });

        setDelegates(filteredDelegates);
      } catch (err) {
        console.error('Failed to load delegates or assignments:', err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchDelegates();
  }, [userId, serviceItemId]);

  const handleCheckboxChange = (delegateId, field, value) => {
    setDelegates((prev) =>
      prev.map((d) =>
        d.delegate_id === delegateId ? { ...d, [field]: value } : d
      )
    );
  };

  const getNextItemId = () => {
    const key = "item_id_counter";
    let count = parseInt(localStorage.getItem(key) || "0", 10);
    count += 1;
    localStorage.setItem(key, count.toString());
    return `IID${count.toString().padStart(2, "0")}`; 
  };

  const handleSubmit = async (delegate) => {
    setSubmittingId(delegate.delegate_id);

    try {
      // Fetch existing assignments
      const checkRes = await fetch(`http://175.29.21.7:8006/delegate-service-item-tasks/`);
      if (!checkRes.ok) throw new Error("Failed to fetch existing assignments");

      const existingData = await checkRes.json();

      // Check if the serviceItemId is already assigned to ANY delegate
      const existingAssignment = existingData.data.find(
        (item) => item.service_item === serviceItemId
      );

      if (existingAssignment) {
        if (existingAssignment.delegate !== delegate.delegate_id) {
          alert(`Access already assigned to another delegate for this service item.`);
          setSubmittingId(null);
          return;
        }
        // If same delegate is re-assigning, allow it to proceed
      }

      // Proceed with submission
      const payload = {
        item_id: getNextItemId(),
        delegate: delegate.delegate_id,
        service_item: serviceItemId,
        completed_at: new Date().toISOString(),
      };

      console.log("Submitting payload:", JSON.stringify(payload, null, 2));

      permissionFields.forEach((field) => {
        payload[field.key] = delegate[field.key];
      });

      const res = await fetch(`http://175.29.21.7:8006/delegate-service-item-tasks/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const responseText = await res.text();
      console.log("API Response:", res.status, responseText);

      if (!res.ok) throw new Error(`Failed to submit for ${delegate.delegate_id}`);

      // Update submitted delegate list
      setSubmittedDelegates((prev) => {
        const updated = [...prev, { delegateId: delegate.delegate_id, serviceItemId }];
        localStorage.setItem('submittedDelegates', JSON.stringify(updated));
        return updated;
      });

      alert(`Permissions submitted for ${delegate.delegate_name}`);
    } catch (err) {
      console.error("Error:", err);
      alert(`Submission failed for ${delegate.delegate_name}`);
    } finally {
      setSubmittingId(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return `${date.getDate().toString().padStart(2, '0')}/${
      (date.getMonth() + 1).toString().padStart(2, '0')
    }/${date.getFullYear()}`;
  };

  return (
    <div className="machine-details-wrapper">
      <div className="machine-details-header">
        <h2 className="machine-details-title">Service Item ID: <span>{serviceItemId}</span></h2>
      </div>

      {/* PM Schedule Tasks Component */}
      <PMScheduleTasks 
        serviceItemId={serviceItemId} 
        userId={userId} 
        company_id={company_id} 
      />

      <div className="machine-details-section">
        <h3 className="machine-details-subtitle">Delegate Permissions</h3>

        {loading ? (
          <p className="machine-details-loading">Loading delegates...</p>
        ) : delegates.length > 0 ? (
          <div className="delegate-cards-container">
            {delegates.map((d, index) => {
              const isSubmitted = submittedDelegates.some(
                (entry) =>
                  entry.delegateId === d.delegate_id &&
                  entry.serviceItemId === serviceItemId
              );

              const isDisabled = assignedPermissions.some(
                (item) =>
                  item.service_item === serviceItemId &&
                  item.delegate !== d.delegate_id
              );

              return (
                <div key={d.delegate_id} className={`delegate-card ${isDisabled ? 'delegate-card-disabled' : ''}`}>
                  <div className="delegate-card-header">
                    <span className="delegate-card-sno">{index + 1}</span>
                    <h4 className="delegate-card-name">{d.delegate_name}</h4>
                    <span className="delegate-card-id">{d.delegate_id}</span>
                  </div>
                  
                  <div className="delegate-card-body">
                    <div className="delegate-permissions-grid">
                        {permissionFields.map((p) => (
                          <div key={p.key} className="delegate-permission-item">
                            <label className="delegate-permission-label">
                              <input
                                type="checkbox"
                                checked={d[p.key]}
                                disabled={isDisabled}
                                onChange={(e) =>
                                  handleCheckboxChange(d.delegate_id, p.key, e.target.checked)
                                }
                                className="delegate-permission-checkbox"
                              />
                              <span className="delegate-permission-text">{p.label}</span>
                            </label>
                          </div>
                        ))}
                    </div>
                  </div>
                  
                  <div className="delegate-card-footer">
                    <button
                      className={`delegate-submit-btn ${
                        isSubmitted ? 'delegate-submit-btn-disabled' : ''
                      }`}
                      disabled={
                        submittingId === d.delegate_id ||
                        isSubmitted ||
                        isDisabled
                      }
                      onClick={() => handleSubmit(d)}
                    >
                      {submittingId === d.delegate_id
                        ? "Submitting..."
                        : isSubmitted
                        ? "Submitted"
                        : "Submit"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="machine-details-empty">No delegates found for this customer.</p>
        )}
      </div>

      <div className="machine-details-section">
        <h3 className="machine-details-subtitle">Service Contract Details</h3>

        {contracts.length > 0 ? (
          <div className="contract-cards-container">
            {contracts.map((contract, index) => (
              <div key={contract.contract_id} className="contract-card">
                <div className="contract-card-header">
                  <span className="contract-card-sno">{index + 1}</span>
                  <h4 className="contract-card-id">{contract.contract_id}</h4>
                </div>
                
                <div className="contract-card-body">
                  <div className="contract-card-row">
                    <span className="contract-card-label">Start Date:</span>
                    <span className="contract-card-value">{formatDate(contract.start_date)}</span>
                  </div>
                  
                  <div className="contract-card-row">
                    <span className="contract-card-label">End Date:</span>
                    <span className="contract-card-value">{formatDate(contract.end_date)}</span>
                  </div>
                  
                  <div className="contract-card-row">
                    <span className="contract-card-label">Value:</span>
                    <span className="contract-card-value">{contract.contract_value}</span>
                  </div>
                  
                  <div className="contract-card-row">
                    <span className="contract-card-label">Payment Term:</span>
                    <span className="contract-card-value">{contract.payment_term}</span>
                  </div>
                  
                  <div className="contract-card-row">
                    <span className="contract-card-label">Alert Days:</span>
                    <span className="contract-card-value">{contract.alert_days || "-"}</span>
                  </div>
                  
                  <div className="contract-card-row">
                    <span className="contract-card-label">Alert Date:</span>
                    <span className="contract-card-value">{formatDate(contract.alert_date)}</span>
                  </div>
                  
                  <div className="contract-card-row">
                    <span className="contract-card-label">Overdue Alert Days:</span>
                    <span className="contract-card-value">{contract.overdue_alert_days || "-"}</span>
                  </div>
                  
                  <div className="contract-card-row">
                    <span className="contract-card-label">Overdue Alert Date:</span>
                    <span className="contract-card-value">{formatDate(contract.overdue_alert_date)}</span>
                  </div>
                  
                  <div className="contract-card-row">
                    <span className="contract-card-label">Alert Sent:</span>
                    <span className="contract-card-value">{contract.is_alert_sent ? "Yes" : "No"}</span>
                  </div>
                  
                  <div className="contract-card-row">
                    <span className="contract-card-label">Remarks:</span>
                    <span className="contract-card-value">{contract.remarks || "N/A"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="machine-details-empty">No service contracts available for this item.</p>
        )}
      </div>

      <NavScreen />
    </div>
  );
};

export default MachineDetails;
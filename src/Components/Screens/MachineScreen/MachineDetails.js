import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NavScreen from '../Navbar/Navbar';
import { AuthContext } from "../../AuthContext/AuthContext";
import './MachineDetails.css';
import baseURL from '../../ApiUrl/Apiurl';

const MachineDetails = () => {
  const { serviceItemId } = useParams();
  const { user } = useContext(AuthContext);
  const userId = user?.customer_id;
  const company_id = user?.company_id;
  const [contracts, setContracts] = useState([]);

  // PM Schedule Task Component
  const PMScheduleTasks = ({ serviceItemId, userId, company_id }) => {
    const [pmSchedules, setPmSchedules] = useState([]);
    const [filteredSchedules, setFilteredSchedules] = useState([]);
    const [activeFilter, setActiveFilter] = useState('customer');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const formatToIndianDate = (dateString) => {
      if (!dateString) return 'N/A';
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date';
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`; // Changed from '-' to '/'
      } catch (error) {
        console.error('Error formatting date:', error);
        return dateString;
      }
    };

    const handleRaiseRequest = async (schedule) => {
      try {
        const response = await fetch(
          `${baseURL}/update-pm-schedule-status/${schedule.pm_schedule_id}/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: "Completed" }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update PM schedule status");
        }

        const result = await response.json();
        alert(`Request raised successfully for ${schedule.pm_schedule_id}`);

        setPmSchedules((prev) =>
          prev.map((s) =>
            s.pm_schedule_id === schedule.pm_schedule_id
              ? { ...s, status: "Completed" }
              : s
          )
        );
        setFilteredSchedules((prev) =>
          prev.map((s) =>
            s.pm_schedule_id === schedule.pm_schedule_id
              ? { ...s, status: "Completed" }
              : s
          )
        );
        fetchPmSchedules();

      } catch (error) {
        console.error("Error raising request:", error);
        alert("Failed to raise request. Please try again.");
      }
    };

    const fetchPmSchedules = async () => {
      if (!userId || !company_id) return;

      try {
        setLoading(true);
        const response = await fetch(
          `${baseURL}/service-item-pm-schedules/?user_id=${userId}&company_id=${company_id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch PM schedules");
        }

        const result = await response.json();

        if (result.status === "success") {
          const filteredSchedules = result.data.filter(
            (schedule) => schedule.service_item === serviceItemId
          );
          setPmSchedules(filteredSchedules);

          const customerSchedules = filteredSchedules.filter(
            (schedule) => schedule.responsible.toLowerCase() === "customer"
          );
          setFilteredSchedules(customerSchedules);
        } else {
          throw new Error(result.message || "Failed to retrieve PM schedules");
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching PM schedules:", err);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchPmSchedules();
    }, [userId, company_id, serviceItemId]);

    const handleFilterChange = (filterType) => {
      setActiveFilter(filterType);

      if (filterType === "all") {
        setFilteredSchedules(pmSchedules);
      } else {
        const filtered = pmSchedules.filter(
          (schedule) => schedule.responsible.toLowerCase() === filterType
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
              className={`filter-btn ${activeFilter === "factory" ? "active" : ""}`}
              onClick={() => handleFilterChange("factory")}
            >
              Factory
            </button>
            <button
              className={`filter-btn ${activeFilter === "customer" ? "active" : ""}`}
              onClick={() => handleFilterChange("customer")}
            >
              Customer
            </button>
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
                    <span
                      className={`pm-schedule-status pm-status-${schedule.status.toLowerCase()}`}
                    >
                      {schedule.status}
                    </span>
                    {schedule.responsible.toLowerCase() === "customer" &&
                      schedule.status.toLowerCase() === "pending" && (
                        <button
                          className="raise-request-btn"
                          onClick={() => handleRaiseRequest(schedule)}
                          disabled={!schedule.is_alert_sent}
                        >
                          Mark Completed
                        </button>
                      )}
                  </div>
                </div>

                <div className="pm-schedule-card-body">
                  <div className="pm-schedule-card-row">
                    <span className="pm-schedule-card-label">Responsible:</span>
                    <span className="pm-schedule-card-value">
                      {schedule.responsible}
                    </span>
                  </div>

                  <div className="pm-schedule-card-row">
                    <span className="pm-schedule-card-label">Description:</span>
                    <span className="pm-schedule-card-value">
                      {schedule.description}
                    </span>
                  </div>

                  <div className="pm-schedule-card-row">
                    <span className="pm-schedule-card-label">Task Type:</span>
                    <span className="pm-schedule-card-value">
                      {schedule.task_type}
                    </span>
                  </div>

                  <div className="pm-schedule-card-row">
                    <span className="pm-schedule-card-label">Due Date:</span>
                    <span className="pm-schedule-card-value">
                      {formatToIndianDate(schedule.due_date)}
                    </span>
                  </div>

                  <div className="pm-schedule-card-row">
                    <span className="pm-schedule-card-label">Alert Date:</span>
                    <span className="pm-schedule-card-value">
                      {formatToIndianDate(schedule.alert_date)}
                    </span>
                  </div>

                  <div className="pm-schedule-card-row">
                    <span className="pm-schedule-card-label">Overdue Alert Date:</span>
                    <span className="pm-schedule-card-value">
                      {formatToIndianDate(schedule.overdue_alert_date)}
                    </span>
                  </div>

                  <div className="pm-schedule-card-row">
                    <span className="pm-schedule-card-label">Last Serviced:</span>
                    <span className="pm-schedule-card-value">
                      {formatToIndianDate(schedule.last_serviced_date) || "N/A"}
                    </span>
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
          <p className="machine-details-empty">
            No PM schedule tasks found for this filter.
          </p>
        )}
      </div>
    );
  };

  useEffect(() => {
    const fetchServiceContracts = async () => {
      try {
        const response = await fetch(
          `${baseURL}/service-contracts/?user_id=${userId}&company_id=${company_id}`
        );

        if (!response.ok) throw new Error("Failed to fetch contracts");

        const result = await response.json();

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
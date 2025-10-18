import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavScreen from '../Navbar/Navbar';
import { FaArrowLeft, FaCheck } from 'react-icons/fa';
import { AuthContext } from "../../AuthContext/AuthContext";
import './DelegateServiceItems.css';
import baseURL from '../../ApiUrl/Apiurl';

const DelegateServiceItems = () => {
  const { delegateId } = useParams();
  const { user } = useContext(AuthContext);
  const userId = user?.customer_id;
  const navigate = useNavigate();
  
  const [serviceItems, setServiceItems] = useState([]);
  const [delegateInfo, setDelegateInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const permissionFields = [
    { key: "can_raise_service_request", label: "Raise Request" },
    { key: "can_close_service_request", label: "Close Request" },
    { key: "can_submit_customer_satisfaction_survey", label: "CSAT Survey" },
    { key: "can_log_customer_complaints", label: "Customer Complaints" },
    { key: "can_monitor_equipment", label: "Monitor Equipment" },
    { key: "can_control_equipment", label: "Control Equipment" }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch delegate info
        const delegateResponse = await fetch(`${baseURL}/delegates/`);
        if (delegateResponse.ok) {
          const delegateData = await delegateResponse.json();
          const delegate = delegateData.data.find(d => d.delegate_id === delegateId);
          setDelegateInfo(delegate);
        }

        // Fetch service items
        const serviceItemsResponse = await fetch(`${baseURL}/service-items/?user_id=${userId}&company_id=${user?.company_id}`);
        const customerServiceItems = serviceItemsResponse.ok ? 
          (await serviceItemsResponse.json()).data || [] : [];

        // Fetch all assignments
        const permissionsResponse = await fetch(`${baseURL}/delegate-service-item-tasks/`);
        const allPermissions = permissionsResponse.ok ? 
          (await permissionsResponse.json()).data || [] : [];

        // Fetch all delegates for conflict info
        const allDelegates = await fetch(`${baseURL}/delegates/`);
        const delegatesData = allDelegates.ok ? (await allDelegates.json()).data || [] : [];

        // Prepare service items with assignment info
        const serviceItemsWithInfo = customerServiceItems.map(item => {
          const existingAssignment = allPermissions.find(
            perm => perm.service_item === item.service_item_id
          );

          if (existingAssignment) {
            const assignedDelegate = delegatesData.find(
              d => d.delegate_id === existingAssignment.delegate
            );
            return {
              service_item_id: item.service_item_id,
              service_item_name: item.service_item_name || 'Unnamed Service Item',
              isAssigned: true,
              assignedTo: assignedDelegate ? assignedDelegate.delegate_name : existingAssignment.delegate,
              assignedToId: existingAssignment.delegate,
              // Include permission data for assigned items
              can_raise_service_request: existingAssignment.can_raise_service_request,
              can_close_service_request: existingAssignment.can_close_service_request,
              can_submit_customer_satisfaction_survey: existingAssignment.can_submit_customer_satisfaction_survey,
              can_log_customer_complaints: existingAssignment.can_log_customer_complaints,
              can_monitor_equipment: existingAssignment.can_monitor_equipment,
              can_control_equipment: existingAssignment.can_control_equipment
            };
          } else {
            return {
              service_item_id: item.service_item_id,
              service_item_name: item.service_item_name || 'Unnamed Service Item',
              isAssigned: false,
              isSelected: false,
              can_raise_service_request: false,
              can_close_service_request: false,
              can_submit_customer_satisfaction_survey: false,
              can_log_customer_complaints: false,
              can_monitor_equipment: false,
              can_control_equipment: false
            };
          }
        });
        
        setServiceItems(serviceItemsWithInfo);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId && delegateId) {
      fetchData();
    }
  }, [userId, delegateId, user?.company_id]);

  const handlePermissionChange = (serviceItemId, permissionKey, value) => {
    setServiceItems(prev => 
      prev.map(item => 
        item.service_item_id === serviceItemId 
          ? { 
              ...item, 
              [permissionKey]: value,
              isSelected: true
            }
          : item
      )
    );
  };

  const handleSelectAllPermissions = (serviceItemId, value) => {
    setServiceItems(prev =>
      prev.map(item =>
        item.service_item_id === serviceItemId
          ? {
              ...item,
              can_raise_service_request: value,
              can_close_service_request: value,
              can_submit_customer_satisfaction_survey: value,
              can_log_customer_complaints: value,
              can_monitor_equipment: value,
              can_control_equipment: value,
              isSelected: value
            }
          : item
      )
    );
  };

  const handleServiceItemSelection = (serviceItemId, value) => {
    setServiceItems(prev =>
      prev.map(item =>
        item.service_item_id === serviceItemId && !item.isAssigned
          ? {
              ...item,
              isSelected: value,
              can_raise_service_request: value,
              can_close_service_request: value,
              can_submit_customer_satisfaction_survey: value,
              can_log_customer_complaints: value,
              can_monitor_equipment: value,
              can_control_equipment: value
            }
          : item
      )
    );
  };

  const handleSubmitPermissions = async () => {
    if (!delegateId) return;
    
    const selectedItems = serviceItems.filter(item => !item.isAssigned && item.isSelected);
    
    if (selectedItems.length === 0) {
      alert('Please select at least one service item to assign permissions.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        delegate_id: delegateId,
        service_items: selectedItems.map(item => ({
          service_item_id: item.service_item_id,
          can_raise_service_request: item.can_raise_service_request,
          can_close_service_request: item.can_close_service_request,
          can_submit_customer_satisfaction_survey: item.can_submit_customer_satisfaction_survey,
          can_log_customer_complaints: item.can_log_customer_complaints,
          can_monitor_equipment: item.can_monitor_equipment,
          can_control_equipment: item.can_control_equipment
        }))
      };

      const response = await fetch(`${baseURL}/delegate-service-item-tasks/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert('Permissions assigned successfully!');
        navigate('/view-delegates');
      } else {
        const errorData = await response.json();
        alert(`Failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to assign permissions.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/view-delegates');
  };

  const selectedServiceItems = serviceItems.filter(item => !item.isAssigned && item.isSelected);

  if (loading) {
    return (
      <div className="delegate-service-items-wrapper">
        <div className="delegate-service-items-loading">Loading...</div>
        <NavScreen />
      </div>
    );
  }

  return (
    <div className="delegate-service-items-wrapper">
      <div className="delegate-service-items-header">
        <h2 className="delegate-service-items-title">Permissions for {delegateInfo?.delegate_name}</h2>
        <span className="delegate-service-items-id">ID: {delegateId}</span>
      </div>

    
      {serviceItems.length > 0 ? (
        <>
          <div className="delegate-service-items-table-container">
            <table className="delegate-service-items-table">
              <thead>
                <tr>
                  <th className="delegate-service-items-th-select">Select</th>
                  <th className="delegate-service-items-th-si">SI</th>
                  <th className="delegate-service-items-th-name">SI Name</th>
                  <th className="delegate-service-items-th-status">Status</th>
                  {permissionFields.map(field => (
                    <th key={field.key} className="delegate-service-items-th-permission">{field.label}</th>
                  ))}
                  <th className="delegate-service-items-th-all">Select All</th>
                </tr>
              </thead>
              <tbody>
                {serviceItems.map((item, index) => (
                  <tr key={item.service_item_id} className="delegate-service-items-tr">
                    <td className="delegate-service-items-td-select">
                      {item.isAssigned ? (
                        <span className="delegate-service-items-disabled">-</span>
                      ) : (
                        <input
                          type="checkbox"
                          checked={item.isSelected}
                          onChange={(e) => 
                            handleServiceItemSelection(item.service_item_id, e.target.checked)
                          }
                          className="delegate-service-items-select-checkbox"
                        />
                      )}
                    </td>
                    <td className="delegate-service-items-td-si">{index + 1}</td>
                    <td className="delegate-service-items-td-name">{item.service_item_name}</td>
                    <td className="delegate-service-items-td-status">
                      {item.isAssigned ? (
                        <span className="delegate-service-items-assigned">
                          Assigned to: {item.assignedTo}
                        </span>
                      ) : (
                        <span className="delegate-service-items-available">Available</span>
                      )}
                    </td>
                    
                    {permissionFields.map(field => (
                      <td key={field.key} className="delegate-service-items-td-permission">
                        {item.isAssigned ? (
                          // Show green checkmark for true permissions, empty for false
                          item[field.key] ? (
                            <FaCheck className="delegate-service-items-checkmark" />
                          ) : (
                            <span className="delegate-service-items-disabled">-</span>
                          )
                        ) : (
                          <input
                            type="checkbox"
                            checked={item[field.key]}
                            onChange={(e) => 
                              handlePermissionChange(item.service_item_id, field.key, e.target.checked)
                            }
                            className="delegate-service-items-permission-checkbox"
                            disabled={!item.isSelected}
                          />
                        )}
                      </td>
                    ))}
                    
                    <td className="delegate-service-items-td-all">
                      {item.isAssigned ? (
                        <span className="delegate-service-items-disabled">-</span>
                      ) : (
                        <input
                          type="checkbox"
                          checked={permissionFields.every(field => item[field.key])}
                          onChange={(e) => 
                            handleSelectAllPermissions(item.service_item_id, e.target.checked)
                          }
                          className="delegate-service-items-all-checkbox"
                          disabled={!item.isSelected}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="delegate-service-items-submit-section">
            <button 
              onClick={handleSubmitPermissions}
              disabled={submitting}
              className="delegate-service-items-submit-btn"
            >
              {submitting ? 'Submitting...' : 'Submit Permissions'}
            </button>
            
            <button onClick={handleBack} className="delegate-service-items-back-btn">
              <FaArrowLeft /> Back to Delegates
            </button>
          </div>
        </>
      ) : (
        <div className="delegate-service-items-empty">
          <p className="delegate-service-items-empty-text">No service items found.</p>
          <button onClick={handleBack} className="delegate-service-items-back-btn">
            <FaArrowLeft /> Back to Delegates
          </button>
        </div>
      )}

      <NavScreen />
    </div>
  );
};

export default DelegateServiceItems;
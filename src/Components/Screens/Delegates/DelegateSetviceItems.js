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
  // Track per-card submitting state
  const [submittingIds, setSubmittingIds] = useState({});

  const permissionFields = [
    { key: "can_raise_service_request", label: "Raise Request" },
    { key: "can_submit_customer_satisfaction_survey", label: "CSAT Survey" },
    { key: "can_log_customer_complaints", label: "Customer Complaints" },
    { key: "can_monitor_equipment", label: "Monitor Equipment" },
    { key: "can_control_equipment", label: "Control Equipment" }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const delegateResponse = await fetch(`${baseURL}/delegates/`);
        if (delegateResponse.ok) {
          const delegateData = await delegateResponse.json();
          const delegate = delegateData.data.find(d => d.delegate_id === delegateId);
          setDelegateInfo(delegate);
        }

        const serviceItemsResponse = await fetch(`${baseURL}/service-items/?user_id=${userId}&company_id=${user?.company_id}`);
        const customerServiceItems = serviceItemsResponse.ok ?
          (await serviceItemsResponse.json()).data || [] : [];

        const permissionsResponse = await fetch(`${baseURL}/delegate-service-item-tasks/`);
        const allPermissions = permissionsResponse.ok ?
          (await permissionsResponse.json()).data || [] : [];

        const delegatesResponse = await fetch(`${baseURL}/delegates/`);
        const delegatesData = delegatesResponse.ok ?
          (await delegatesResponse.json()).data || [] : [];

        const serviceItemsWithInfo = customerServiceItems.map(item => {
          const existingAssignment = allPermissions.find(
            perm => perm.service_item === item.service_item_id
          );

          if (existingAssignment) {
            const assignedDelegate = delegatesData.find(
              d => d.delegate_id === existingAssignment.delegate
            );
            const isAssignedToCurrentDelegate = existingAssignment.delegate === delegateId;
            return {
              service_item_id: item.service_item_id,
              service_item_name: item.service_item_name || 'Unnamed Service Item',
              isAssigned: !isAssignedToCurrentDelegate,
              isSelected: isAssignedToCurrentDelegate,
              isExistingAssignment: isAssignedToCurrentDelegate,
              assignedTo: assignedDelegate ? assignedDelegate.delegate_name : existingAssignment.delegate,
              assignedToId: existingAssignment.delegate,
              assignmentId: existingAssignment.item_id,
              can_raise_service_request: existingAssignment.can_raise_service_request,
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
              isExistingAssignment: false,
              can_raise_service_request: false,
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

    if (userId && delegateId) fetchData();
  }, [userId, delegateId, user?.company_id]);

  const validateControl = (item, key, value) => {
    if (key === 'can_control_equipment' && value && !item.can_monitor_equipment) {
      alert('Cannot enable Control Equipment without Monitor Equipment.');
      return false;
    }
    if (key === 'can_monitor_equipment' && !value && item.can_control_equipment) {
      alert('Cannot remove Monitor Equipment while Control Equipment is active.');
      return false;
    }
    return true;
  };

  const handlePermissionChange = (serviceItemId, key, value) => {
    const item = serviceItems.find(i => i.service_item_id === serviceItemId);
    if (!validateControl(item, key, value)) return;

    setServiceItems(prev =>
      prev.map(i =>
        i.service_item_id === serviceItemId ? { ...i, [key]: value } : i
      )
    );
  };

  const handleSelectAllPermissions = (serviceItemId, value) => {
    setServiceItems(prev =>
      prev.map(i =>
        i.service_item_id === serviceItemId
          ? {
              ...i,
              can_raise_service_request: value,
              can_submit_customer_satisfaction_survey: value,
              can_log_customer_complaints: value,
              can_monitor_equipment: value,
              can_control_equipment: value,
            }
          : i
      )
    );
  };

  const handleServiceItemSelection = (serviceItemId, value) => {
    setServiceItems(prev =>
      prev.map(i =>
        i.service_item_id === serviceItemId && !i.isAssigned && !i.isExistingAssignment
          ? {
              ...i,
              isSelected: value,
              can_raise_service_request: value,
              can_submit_customer_satisfaction_survey: value,
              can_log_customer_complaints: value,
              can_monitor_equipment: value,
              can_control_equipment: value
            }
          : i
      )
    );
  };

  // Per-card submit — POST for new, PUT for existing
  const handleCardSubmit = async (item) => {
    if (item.can_control_equipment && !item.can_monitor_equipment) {
      alert('Cannot assign Control Equipment without Monitor Equipment.');
      return;
    }

    setSubmittingIds(prev => ({ ...prev, [item.service_item_id]: true }));

    try {
      let response;

      if (item.isExistingAssignment) {
        // UPDATE existing assignment
        response = await fetch(`${baseURL}/delegate-service-item-tasks/${item.assignmentId}/`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            can_raise_service_request: item.can_raise_service_request,
            can_submit_customer_satisfaction_survey: item.can_submit_customer_satisfaction_survey,
            can_log_customer_complaints: item.can_log_customer_complaints,
            can_monitor_equipment: item.can_monitor_equipment,
            can_control_equipment: item.can_control_equipment
          })
        });
      } else {
        // NEW assignment
        response = await fetch(`${baseURL}/delegate-service-item-tasks/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            delegate_id: delegateId,
            service_items: [{
              service_item_id: item.service_item_id,
              can_raise_service_request: item.can_raise_service_request,
              can_submit_customer_satisfaction_survey: item.can_submit_customer_satisfaction_survey,
              can_log_customer_complaints: item.can_log_customer_complaints,
              can_monitor_equipment: item.can_monitor_equipment,
              can_control_equipment: item.can_control_equipment
            }]
          })
        });
      }

      if (response.ok) {
        // After POST, mark card as existing assignment so future saves use PUT
        if (!item.isExistingAssignment) {
          const responseData = await response.json();
          // Try to get the new assignment ID from response if available
          const newAssignmentId = responseData?.data?.[0]?.item_id || responseData?.item_id || null;
          setServiceItems(prev =>
            prev.map(i =>
              i.service_item_id === item.service_item_id
                ? { ...i, isExistingAssignment: true, isSelected: true, assignmentId: newAssignmentId }
                : i
            )
          );
        }
        alert('Permissions saved!');
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`Failed: ${errorData.message || response.status}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to save permissions.');
    } finally {
      setSubmittingIds(prev => ({ ...prev, [item.service_item_id]: false }));
    }
  };

  const handleRemoveAssignment = async (item) => {
    if (!window.confirm(`Remove assignment for "${item.service_item_name}"?`)) return;

    setSubmittingIds(prev => ({ ...prev, [item.service_item_id]: true }));
    try {
      const response = await fetch(
        `${baseURL}/delegate-service-item-tasks/${item.assignmentId}/`,
        { method: 'DELETE', headers: { 'Content-Type': 'application/json' } }
      );

      if (response.ok || response.status === 204) {
        setServiceItems(prev =>
          prev.map(i =>
            i.service_item_id === item.service_item_id
              ? {
                  ...i,
                  isAssigned: false,
                  isSelected: false,
                  isExistingAssignment: false,
                  assignmentId: null,
                  can_raise_service_request: false,
                  can_submit_customer_satisfaction_survey: false,
                  can_log_customer_complaints: false,
                  can_monitor_equipment: false,
                  can_control_equipment: false
                }
              : i
          )
        );
        alert('Assignment removed.');
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`Failed: ${errorData.message || response.status}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to remove assignment.');
    } finally {
      setSubmittingIds(prev => ({ ...prev, [item.service_item_id]: false }));
    }
  };

  const handleBack = () => navigate('/view-delegates');

  if (loading) {
    return (
      <div className="dsi-wrapper">
        <div className="dsi-loading">Loading...</div>
        <NavScreen />
      </div>
    );
  }

  return (
    <div className="dsi-wrapper">
      <div className="dsi-header">
        <span className="dsi-title">Permissions — {delegateInfo?.delegate_name}</span>
        <span className="dsi-id-badge">{delegateId}</span>
      </div>

      {serviceItems.length > 0 ? (
        <>
          <div className="dsi-cards-grid">
            {serviceItems.map((item, index) => {
              const isSubmitting = submittingIds[item.service_item_id];
              const canSubmit = (item.isSelected || item.isExistingAssignment) && !item.isAssigned;
              const allSelected = permissionFields.every(f => item[f.key]);

              return (
                <div
                  key={item.service_item_id}
                  className={`dsi-card ${item.isAssigned ? 'dsi-card--locked' : ''} ${item.isExistingAssignment ? 'dsi-card--existing' : ''}`}
                >
                  {/* Card Top */}
                  <div className="dsi-card-top">
                    {item.isAssigned ? (
                      <input type="checkbox" className="dsi-checkbox" disabled />
                    ) : item.isExistingAssignment ? (
                      <input type="checkbox" className="dsi-checkbox" checked readOnly />
                    ) : (
                      <input
                        type="checkbox"
                        className="dsi-checkbox"
                        checked={item.isSelected}
                        onChange={e => handleServiceItemSelection(item.service_item_id, e.target.checked)}
                      />
                    )}
                    <div className="dsi-card-num">{index + 1}</div>
                    <div className="dsi-card-info">
                      <div className="dsi-card-name">{item.service_item_name}</div>
                      {item.isAssigned && (
                        <div className="dsi-card-sub">→ {item.assignedTo}</div>
                      )}
                    </div>
                    {item.isAssigned && <span className="dsi-badge dsi-badge--other">Other delegate</span>}
                    {item.isExistingAssignment && <span className="dsi-badge dsi-badge--current">Assigned</span>}
                    {!item.isAssigned && !item.isExistingAssignment && <span className="dsi-badge dsi-badge--avail">Available</span>}
                  </div>

                  {/* Permissions */}
                  <div className="dsi-card-body">
                    <div className="dsi-perms-grid">
                      {permissionFields.map(field => (
                        <label
                          key={field.key}
                          className={`dsi-perm-item ${(!item.isSelected && !item.isExistingAssignment) || item.isAssigned ? 'dsi-perm-item--disabled' : ''}`}
                        >
                          {item.isAssigned ? (
                            <span className={`dsi-perm-icon ${item[field.key] ? 'dsi-perm-icon--on' : ''}`}>
                              {item[field.key] ? <FaCheck size={11} /> : '–'}
                            </span>
                          ) : (
                            <input
                              type="checkbox"
                              className="dsi-perm-check"
                              checked={item[field.key]}
                              disabled={!item.isSelected && !item.isExistingAssignment}
                              onChange={e =>
                                handlePermissionChange(item.service_item_id, field.key, e.target.checked)
                              }
                            />
                          )}
                          <span className="dsi-perm-label">{field.label}</span>
                        </label>
                      ))}
                    </div>

                    {/* Footer */}
                    {!item.isAssigned && (
                      <div className="dsi-card-footer">
                        <label className={`dsi-perm-item dsi-sel-all ${(!item.isSelected && !item.isExistingAssignment) ? 'dsi-perm-item--disabled' : ''}`}>
                          <input
                            type="checkbox"
                            className="dsi-perm-check"
                            checked={allSelected}
                            disabled={!item.isSelected && !item.isExistingAssignment}
                            onChange={e => handleSelectAllPermissions(item.service_item_id, e.target.checked)}
                          />
                          <span className="dsi-perm-label" style={{ fontWeight: 500 }}>Select all</span>
                        </label>

                        <div className="dsi-card-actions">
                          {item.isExistingAssignment && (
                            <button
                              className="dsi-remove-btn"
                              onClick={() => handleRemoveAssignment(item)}
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? '...' : 'Remove'}
                            </button>
                          )}
                          {canSubmit && (
                            <button
                              className="dsi-save-btn"
                              onClick={() => handleCardSubmit(item)}
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? 'Saving...' : 'Save'}
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="dsi-action-area">
            <button className="dsi-back-btn" onClick={handleBack}>
              <FaArrowLeft /> Back to Delegates
            </button>
          </div>
        </>
      ) : (
        <div className="dsi-empty">
          <p>No service items found.</p>
          <button className="dsi-back-btn" onClick={handleBack}>
            <FaArrowLeft /> Back to Delegates
          </button>
        </div>
      )}
      <NavScreen />
    </div>
  );
};

export default DelegateServiceItems;
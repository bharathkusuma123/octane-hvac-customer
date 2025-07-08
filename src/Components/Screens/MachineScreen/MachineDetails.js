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

const MachineDetails = () => {
  const { serviceItemId } = useParams();
  const { user } = useContext(AuthContext);
  const userId = user?.customer_id;

  const [delegates, setDelegates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState(null); 
const [submittedDelegates, setSubmittedDelegates] = useState(() => {
  const saved = localStorage.getItem('submittedDelegates');
  return saved ? JSON.parse(saved) : [];
});
const [assignedPermissions, setAssignedPermissions] = useState([]);



  useEffect(() => {
    const fetchDelegates = async () => {
      try {
        const response = await fetch(`http://175.29.21.7:8006/delegates/`);
        if (response.ok) {
          const result = await response.json();
          const filtered = result.data
            .filter((d) => d.customer === userId)
            .map((d) => ({
              ...d,
              can_raise_service_request: false,
              can_close_service_request: false,
              can_submit_customer_satisfaction_survey: false,
              can_log_customer_complaints: false,
              can_monitor_equipment: false,
              can_control_equipment: false,
            }));
          setDelegates(filtered);
        }
      } catch (err) {
        console.error('Failed to load delegates:', err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchDelegates();
  }, [userId]);

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






  return (
    <div className="request-screen-wrapper">
      {/* <h2>Machine Details</h2> */}
      {/* <p>Customer ID: {userId}</p> */}
      <p>Service Item ID: <strong>{serviceItemId}</strong></p>

      <h3>Delegate Permissions</h3>

      <div className="table-container">
        {loading ? (
          <p className="p-3">Loading delegates...</p>
        ) : delegates.length > 0 ? (
          <table className="table table-bordered mb-0">
            <thead>
              <tr>
                <th>S.No</th>
                <th>ID</th>
                <th>Delegate Name</th>
                {permissionFields.map((p) => (
                  <th key={p.key}>{p.label}</th>
                ))}
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {delegates.map((d, index) => {
  const isSubmitted = submittedDelegates.some(
    (entry) =>
      entry.delegateId === d.delegate_id &&
      entry.serviceItemId === serviceItemId
  );

  return (
    <tr key={d.delegate_id}>
      <td>{index + 1}</td>
      <td>{d.delegate_id}</td>
      <td>{d.delegate_name}</td>
      {permissionFields.map((p) => (
        <td key={p.key}>
          <input
            type="checkbox"
            checked={d[p.key]}
            disabled={assignedPermissions.some(
              (item) =>
                item.service_item === serviceItemId &&
                item.delegate !== d.delegate_id
            )}
            onChange={(e) =>
              handleCheckboxChange(d.delegate_id, p.key, e.target.checked)
            }
          />
        </td>
      ))}
      <td>
        <button
          className="btn btn-sm btn-primary"
          disabled={
            submittingId === d.delegate_id ||
            isSubmitted ||
            assignedPermissions.some(
              (item) =>
                item.service_item === serviceItemId &&
                item.delegate !== d.delegate_id
            )
          }
          onClick={() => handleSubmit(d)}
        >
          {submittingId === d.delegate_id
            ? "Submitting..."
            : isSubmitted
            ? "Submitted"
            : "Submit"}
        </button>
      </td>
    </tr>
  );
})}

            </tbody>
          </table>
        ) : (
          <p className="p-3">No delegates found for this customer.</p>
        )}
      </div>

      <NavScreen />
    </div>
  );
};

export default MachineDetails;

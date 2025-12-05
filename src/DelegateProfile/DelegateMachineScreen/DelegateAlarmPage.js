import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiClock } from 'react-icons/fi';
import baseURL from '../../Components/ApiUrl/Apiurl';

const DelegateAlarmsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [errorData, setErrorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get alarm data passed from navigation
  const alarmData = location.state?.alarmData || {
    alarmOccurred: '0',
    errorCount: 0,
    deviceId: ''
  };
    // Get user and company IDs separately
  const userId = location.state?.userId || null;
  const companyId = location.state?.company_id || null;

  useEffect(() => {
    const fetchErrorData = async () => {
      try {
        if (!alarmData.deviceId) {
          throw new Error('No device ID available');
        }

        const response = await fetch(
          `${baseURL}/errors/${alarmData.deviceId}/?user_id=${userId}&company_id=${companyId}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch error data');
        }

        const data = await response.json();
        
        if (data.status !== "success") {
          throw new Error(data.message || 'Error in response data');
        }

        setErrorData(data.data || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching error data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchErrorData();
  }, [alarmData.deviceId]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return 'red';
      case 'MEDIUM': return 'orange';
      case 'LOW': return 'yellow';
      default: return 'gray';
    }
  };

const formatDate = (dateString) => {
  if (!dateString) return '-';

  const date = new Date(dateString);

  // Use UTC values (because backend timestamp ends with Z = UTC)
  let day = date.getUTCDate().toString().padStart(2, '0');
  let month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  let year = date.getUTCFullYear();

  let hours = date.getUTCHours();
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');

  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12; // Convert 0 → 12

  return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
};

const sendMachineAlert = async (errorItem) => {
  try {
    // Navigate directly to Delegate Machine Request Page
    navigate("/delegate-Machine-request", {
      state: {
        pcb_serial_number: alarmData.deviceId,
        autoErrorCode: errorItem.error_code,  
        autoDescription: errorItem.description,
        alarmData: alarmData,
        userId: userId,
        company_id: companyId
      },
    });

  } catch (err) {
    console.error("Navigation error:", err);
    alert("Unable to process machine alert: " + err.message);
  }
};


  return (
    <div style={{
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto',
      position: 'relative'
    }}>
     <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', marginTop:'20%' }}>
  <button
    onClick={() => navigate(-1)}
    style={{
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center'
    }}
  >
    <FiArrowLeft /> 
  </button>

  <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
    <FiClock /> Alarm Notifications
  </h2>
</div>

      
      {/* Current Alarm Status */}
      <div style={{ margin: '20px 0' }}>
        {alarmData.alarmOccurred !== '0' ? (
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#ffeeee', 
            borderRadius: '8px',
            borderLeft: '5px solid red',
            marginBottom: '20px'
          }}>
            <h3 style={{ color: 'red', marginTop: 0 }}>Current Alarm Status</h3>
            <p><strong>Device ID:</strong> {alarmData.deviceId}</p>
            <p><strong>Active Alarm Code:</strong> {alarmData.alarmOccurred}</p>
          </div>
        ) : (
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#eeffee', 
            borderRadius: '8px',
            borderLeft: '5px solid green',
            marginBottom: '20px'
          }}>
            <h3 style={{ color: 'green', marginTop: 0 }}>Current Alarm Status</h3>
            <p><strong>Device ID:</strong> {alarmData.deviceId}</p>
            <p>No active alarms - System is operating normally</p>
          </div>
        )}
      </div>

      {/* Historical Errors */}
      <h3>Historical Error Logs</h3>
      
      {loading ? (
        <div>Loading error history...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>Error: {error}</div>
      ) : errorData.length === 0 ? (
        <div>No historical errors found</div>
      ) : (
        <div style={{
          maxHeight: '500px',
          overflowY: 'auto',
          border: '1px solid #eee',
          borderRadius: '8px'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                <th style={{ padding: '10px', textAlign: 'left' }}>S.No</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Error Code</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Description</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Priority</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Occurred At</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Machine Alert</th>
              </tr>
            </thead>
            <tbody>
              {errorData.map((error, index) => (
                <tr 
                  key={index}
                  style={{ 
                    borderBottom: '1px solid #eee',
                    backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9'
                  }}
                >
                  <td style={{ padding: '10px' }}>{index + 1}</td>
                  <td style={{ padding: '10px' }}>{error.error_code}</td>
                  <td style={{ padding: '10px' }}>{error.description}</td>
                  <td style={{ padding: '10px' }}>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '4px',
                      backgroundColor: getPriorityColor(error.priority),
                      color: error.priority === 'LOW' ? 'black' : 'white'
                    }}>
                      {error.priority}
                    </span>
                  </td>
                  <td style={{ padding: '10px' }}>{formatDate(error.original_timestamp)}</td>
                  <td style={{ padding: '10px' }}>
                    <button 
                      onClick={() => sendMachineAlert(error)}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      Send Machine Alert
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DelegateAlarmsPage;
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiClock } from 'react-icons/fi';
import baseURL from '../../ApiUrl/Apiurl';

const AlarmsPage = () => {
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

  useEffect(() => {
    const fetchErrorData = async () => {
      try {
        if (!alarmData.deviceId) {
          throw new Error('No device ID available');
        }

        //  const response = await fetch(
        //   `http://46.37.122.105:83/live_events/errors/${alarmData.deviceId}/`
        // );

        const response = await fetch(
          `${baseURL}/errors/${alarmData.deviceId}/`
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

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div style={{
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto',
      position: 'relative'
    }}>
      <button 
        onClick={() => navigate(-1)}
        style={{
          background: 'none',
          border: 'none',
          fontSize: '24px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        <FiArrowLeft /> Back
      </button>

      <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <FiClock /> Alarm Notifications
      </h2>
      
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
                  <td style={{ padding: '10px' }}>{formatDate(error.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AlarmsPage;
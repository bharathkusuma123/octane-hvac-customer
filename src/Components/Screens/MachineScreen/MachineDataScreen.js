import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from "../../AuthContext/AuthContext";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavScreen from '../../Screens/Navbar/Navbar';
import "./Machine.css";
import baseURL from '../../ApiUrl/Apiurl';
import { FaArrowLeft, FaTachometerAlt } from 'react-icons/fa';

const MachineDataScreen = () => {
  const { user } = useContext(AuthContext);
  const userId = user?.customer_id;
  const companyId = user?.company_id;

  const [machineData, setMachineData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (userId && companyId) {
      fetchMachineData();
    }
  }, [userId, companyId]);

  const fetchMachineData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${baseURL}/get-latest-data/`, {
        params: {
          user_id: userId,
          company_id: companyId
        }
      });

      if (response.data.status === "success") {
        setMachineData(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch machine data');
      }
    } catch (error) {
      console.error("Error fetching machine data:", error);
      setError('Failed to fetch machine data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to format boolean values
  const formatBoolean = (value) => {
    return value === "1" ? "Yes" : "No";
  };

  // Function to format mode values
  const formatMode = (value) => {
    const modes = {
      "0": "Off",
      "1": "Cool",
      "2": "Heat",
      "3": "Auto"
    };
    return modes[value] || value;
  };

  // Function to format fan speed
  const formatFanSpeed = (value) => {
    const speeds = {
      "0": "Auto",
      "1": "Low",
      "2": "Medium",
      "3": "High"
    };
    return speeds[value] || value;
  };

  return (
    <div className="machine-screen-wrapper">
      <div className="machine-screen-header">
        <div className="machine-header-content">
          <button 
            className="btn btn-back me-3"
            onClick={() => navigate('/machine')}
            title="Go back to Machine Screen"
          >
            <FaArrowLeft />
          </button>
          <h2 className="machine-screen-title">Complete Machine Data</h2>
          <button 
            className="btn btn-primary machine-monitor-btn"
            onClick={fetchMachineData}
            title="Refresh Data"
            disabled={loading}
          >
            <FaTachometerAlt className="me-2" />
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>
      </div>

      <NavScreen />

      {loading ? (
        <div className="machine-loading-container">
          <p className="machine-loading-text">Loading machine data...</p>
        </div>
      ) : error ? (
        <div className="machine-error-container">
          <p className="machine-error-text">{error}</p>
          <button 
            className="btn btn-primary mt-3"
            onClick={fetchMachineData}
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="machine-data-container">
          {machineData.length === 0 ? (
            <div className="no-data-container">
              <p className="no-data-text">No machine data available</p>
            </div>
          ) : (
            machineData.map((machine, index) => (
              <div key={index} className="machine-data-card">
                <div className="machine-data-header">
                  <h3 className="machine-data-title">
                    Machine {index + 1} - {machine.pcb_serial_number}
                  </h3>
                </div>
                
                <div className="machine-data-body">
                  <div className="machine-data-grid">
                    {/* Temperature Section */}
                    <div className="machine-data-section">
                      <h4 className="machine-data-section-title">Temperature & Humidity</h4>
                      <div className="machine-data-row">
                        <span className="machine-data-label">Outdoor Temperature:</span>
                        <span className="machine-data-value">
                          {machine.outdoor_temperature.value} {machine.outdoor_temperature.unit}
                        </span>
                      </div>
                      <div className="machine-data-row">
                        <span className="machine-data-label">Room Temperature:</span>
                        <span className="machine-data-value">
                          {machine.room_temperature.value} {machine.room_temperature.unit}
                        </span>
                      </div>
                      <div className="machine-data-row">
                        <span className="machine-data-label">Room Humidity:</span>
                        <span className="machine-data-value">
                          {machine.room_humidity.value} {machine.room_humidity.unit}
                        </span>
                      </div>
                      <div className="machine-data-row">
                        <span className="machine-data-label">Set Temperature:</span>
                        <span className="machine-data-value">
                          {machine.set_temperature.value} {machine.set_temperature.unit}
                        </span>
                      </div>
                    </div>

                    {/* HVAC Status Section */}
                    <div className="machine-data-section">
                      <h4 className="machine-data-section-title">HVAC Status</h4>
                      <div className="machine-data-row">
                        <span className="machine-data-label">HVAC On:</span>
                        <span className={`machine-data-value ${
                          machine.hvac_on.value === "1" ? "status-active" : "status-inactive"
                        }`}>
                          {formatBoolean(machine.hvac_on.value)}
                        </span>
                      </div>
                      <div className="machine-data-row">
                        <span className="machine-data-label">Mode:</span>
                        <span className="machine-data-value">
                          {formatMode(machine.mode.value)}
                        </span>
                      </div>
                      <div className="machine-data-row">
                        <span className="machine-data-label">Fan Speed:</span>
                        <span className="machine-data-value">
                          {formatFanSpeed(machine.fan_speed.value)}
                        </span>
                      </div>
                      <div className="machine-data-row">
                        <span className="machine-data-label">HVAC Busy:</span>
                        <span className={`machine-data-value ${
                          machine.hvac_busy.value === "1" ? "status-active" : "status-inactive"
                        }`}>
                          {formatBoolean(machine.hvac_busy.value)}
                        </span>
                      </div>
                    </div>

                    {/* Alerts & Errors Section */}
                    <div className="machine-data-section">
                      <h4 className="machine-data-section-title">Alerts & Errors</h4>
                      <div className="machine-data-row">
                        <span className="machine-data-label">Error Flag:</span>
                        <span className={`machine-data-value ${
                          machine.error_flag.value === "1" ? "status-error" : "status-ok"
                        }`}>
                          {formatBoolean(machine.error_flag.value)}
                        </span>
                      </div>
                      <div className="machine-data-row">
                        <span className="machine-data-label">Alarm Occurred:</span>
                        <span className={`machine-data-value ${
                          machine.alarm_occurred.value === "1" ? "status-error" : "status-ok"
                        }`}>
                          {formatBoolean(machine.alarm_occurred.value)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MachineDataScreen;
import React, { useState, useContext } from "react";
import {
  FiArrowLeft,
  FiPower,
  FiSun,
  FiDroplet,
  FiThermometer,
} from "react-icons/fi";
import AIROlogo from "../../Components/Screens/MachineScreensNew/Images/AIRO.png";
import greenAire from "../../Components/Screens/MachineScreensNew/Images/greenAire.png";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../Components/AuthContext/AuthContext";
import TemperatureDial from "../../Components/Screens/MachineScreensNew/TemperatureDial";
// Removed: baseURL import

// Constants
const MODE_MAP = {
  1: "IDEC",
  2: "Auto",
  3: "Fan",
  4: "Indirect",
  5: "Direct",
};

const MODE_CODE_MAP = {
  IDEC: 1,
  Auto: 2,
  Fan: 3,
  Indirect: 4,
  Direct: 5,
};

const FAN_SPEEDS = ["0", "1", "2"]; // 0=High, 1=Medium, 2=Low
const FAN_LABELS = ["High", "Medium", "Low"];

// Helper functions
const getSelectedService = (location) => {
  try {
    if (location.state?.selectedService) {
      return location.state.selectedService;
    }
    const stored = localStorage.getItem('selectedService');
    return stored ? JSON.parse(stored) : null;
  } catch (e) {
    return null;
  }
};

const formatTemp = (temp) => {
  if (temp == null) return "0.0";
  const num = parseFloat(temp);
  return isNaN(num) ? "0.0" : num.toFixed(1);
};

const DelegateScreen2 = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract from navigation state
  const { userId, company_id, sensorData } = location.state || {};

  const [isDraggingTemp, setIsDraggingTemp] = useState(false);
  const [processing, setProcessing] = useState({ status: false, message: "" });

  // Get selected service for device ID fallback
  const selectedService = getSelectedService(location);
  const deviceId = selectedService?.pcb_serial_number || sensorData?.deviceId || "2411GM-0102";

 

  // Initialize data directly from passed sensorData
  const initialApiData = {
    outsideTemp: sensorData.outsideTemp || "0",
    humidity: sensorData.humidity || "0",
    roomTemp: sensorData.roomTemp || "0",
    fanSpeed: sensorData.fanSpeed || "0",
    temperature: sensorData.temperature || "25",
    powerStatus: sensorData.powerStatus || "off",
    mode: sensorData.mode || "3",
    errorFlag: sensorData.errorFlag || "0",
    hvacBusy: sensorData.hvacBusy || "0",
    deviceId: deviceId,
    alarmOccurred: sensorData.alarmOccurred || "0",
  };

  const [apiData] = useState(initialApiData); // Static from navigation

  const [displayData, setDisplayData] = useState({
    fanSpeed: initialApiData.fanSpeed,
    temperature: initialApiData.temperature,
    mode: initialApiData.mode,
    powerStatus: initialApiData.powerStatus,
  });

    const [hasLocalChanges, setHasLocalChanges] = useState(false);
    
   // If no sensorData passed → show fallback
  if (!sensorData) {
    return <div className="loading">No sensor data available</div>;
  }

  // Derived values
  const currentModeDescription = MODE_MAP[displayData.mode] || "Fan";
  const fanPosition = FAN_SPEEDS.indexOf(displayData.fanSpeed);
  const fanPercentage = fanPosition * 50;

  // Send command to controller (unchanged logic)
  const sendCommand = async (updates = {}) => {
    if (processing.status || apiData.hvacBusy === "1") {
      setProcessing({
        status: true,
        message: apiData.hvacBusy === "1" ? "System is busy, please wait..." : "Please wait...",
      });
      return false;
    }

    setProcessing({ status: true, message: "Sending command, please wait..." });

    const finalUpdates = updates.powerStatus === "on" ? {
      ...updates,
      mode: displayData.mode,
      fanSpeed: displayData.fanSpeed,
      temperature: displayData.temperature,
    } : updates;

    const payload = {
      Header: "0xAA",
      DI: deviceId,
      MD: parseInt(finalUpdates.mode || displayData.mode) || 1,
      FS: parseInt(finalUpdates.fanSpeed || displayData.fanSpeed) || 0,
      SRT: parseInt(finalUpdates.temperature || displayData.temperature) || 25,
      HVAC: finalUpdates.powerStatus === "off" ? "0" : "1",
      Footer: "0xZX",
    };

    try {
      const response = await fetch("https://mdata.air2o.net/controllers/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to send command");

      if (updates.powerStatus === "on") {
        setHasLocalChanges(false);
      }

      setTimeout(() => setProcessing({ status: false, message: "" }), 15000);
      return true;
    } catch (error) {
      console.error("Error sending command:", error);
      setProcessing({ status: false, message: "Failed to send command" });
      return false;
    }
  };

  // Event Handlers (same behavior as before)
  const handlePowerToggle = async () => {
    const newStatus = displayData.powerStatus === "on" ? "off" : "on";
    setDisplayData(prev => ({ ...prev, powerStatus: newStatus }));
    await sendCommand({ powerStatus: newStatus });
  };

  const handleModeChange = async (newMode) => {
    const newModeCode = MODE_CODE_MAP[newMode].toString();
    setDisplayData(prev => ({ ...prev, mode: newModeCode }));

    if (displayData.powerStatus === "off") {
      setHasLocalChanges(true);
      return;
    }
    await sendCommand({ mode: newModeCode });
  };

  const handleFanSpeedChange = async (newPosition) => {
    const newSpeed = FAN_SPEEDS[newPosition];
    setDisplayData(prev => ({ ...prev, fanSpeed: newSpeed }));

    if (displayData.powerStatus === "off") {
      setHasLocalChanges(true);
      return;
    }
    await sendCommand({ fanSpeed: newSpeed });
  };

  const handleFanClick = (e) => {
    if (processing.status) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const segment = rect.width / 3;
    const newPosition = Math.min(2, Math.floor(clickX / segment));
    handleFanSpeedChange(newPosition);
  };

  const handleTempChange = (newTemp) => {
    setDisplayData(prev => ({ ...prev, temperature: newTemp.toString() }));
    setIsDraggingTemp(true);
    if (displayData.powerStatus === "off") setHasLocalChanges(true);
  };

  const handleTempChangeEnd = async (newTemp) => {
    setIsDraggingTemp(false);
    if (displayData.powerStatus === "on") {
      await sendCommand({ temperature: newTemp.toString() });
    }
  };

  const handleBackClick = () => {
    if (!processing.status) {
      navigate("/delegate-machinescreen1");
    }
  };

  return (
    <div className="mainmain-container" style={{
      backgroundImage: "linear-gradient(to bottom, #3E99ED, #2B7ED6)"
    }}>
      <div className="main-container">
        {/* Header */}
        <div className="header">
          <button className="icon-button" onClick={handleBackClick} disabled={processing.status}>
            <FiArrowLeft size={24} color="white" />
          </button>
          <img src={AIROlogo} alt="AIRO Logo" className="logo" />
          <div className="power-button-container">
            <button
              className={`power-button ${displayData.powerStatus === 'on' ? 'on' : 'off'} ${processing.status ? "processing" : ""}`}
              onClick={handlePowerToggle}
              disabled={processing.status}
            >
              <FiPower size={24} color="white" />
              {processing.status && <span className="processing-indicator"></span>}
            </button>
            {apiData.errorFlag === "1" && <div className="error-indicator" />}
          </div>
        </div>

        {/* Messages */}
        {processing.status && <div className="processing-message">{processing.message}</div>}
        {apiData.errorFlag === "1" && <div className="error-message">Warning: System Error Detected</div>}
        {apiData.hvacBusy === "1" && !processing.status && <div className="busy-message">Hourglass: System is busy</div>}

        {/* Temperature Dial */}
        <TemperatureDial
          onTempChange={handleTempChange}
          onTempChangeEnd={handleTempChangeEnd}
          fanSpeed={fanPosition}
          initialTemperature={parseFloat(displayData.temperature) || 25}
          disabled={processing.status}
        />

        {/* Environment Info */}
        <div className="env-info">
          <div className="env-item">
            <FiSun className="env-icon" size={20} color="#FFFFFF" />
            <div className="env-value">{formatTemp(apiData.outsideTemp)}°C</div>
            <div className="env-label">Outside Temp</div>
          </div>
          <div className="env-item">
            <FiThermometer className="env-icon" size={20} color="#FFFFFF" />
            <div className="env-value">{formatTemp(apiData.roomTemp)}°C</div>
            <div className="env-label">Room Temp</div>
          </div>
          <div className="env-item">
            <FiDroplet className="env-icon" size={20} color="#FFFFFF" />
            <div className="env-value">{formatTemp(apiData.humidity)}%</div>
            <div className="env-label">Humidity</div>
          </div>
        </div>

        {/* Controls */}
        <div className="control-buttons-container">
          <div className="handle" />

          {/* Modes */}
          <div className="section">
            <h3 className="heading">Modes</h3>
            <div className="mode-row">
              {Object.values(MODE_MAP).map((mode) => (
                <button
                  key={mode}
                  onClick={() => handleModeChange(mode)}
                  className={`mode-button ${currentModeDescription === mode ? "mode-button-selected" : ""}`}
                  disabled={processing.status}
                >
                  <span className={`mode-text ${currentModeDescription === mode ? "mode-text-selected" : ""}`}>
                    {mode}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Fan Speed */}
          <div className="section">
            <h3 className="heading">Fan Speed</h3>
            <div
              className="line-with-dot-container"
              onClick={processing.status ? undefined : handleFanClick}
              style={{ cursor: processing.status ? "not-allowed" : "pointer", opacity: processing.status ? 0.6 : 1 }}
            >
              <div className="line" />
              {FAN_LABELS.map((_, i) => (
                <div key={i} className="vertical-marker" style={{ left: `${i * 50}%` }} />
              ))}
              <div className="dot" style={{ left: `${fanPercentage}%` }} />
              <div className="fan-speed-labels">
                {FAN_LABELS.map((label, i) => (
                  <span key={i} style={{ left: `${i * 50}%` }}>{label}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="logo-container">
            <img src={greenAire} alt="GreenAire Logo" className="logo-image" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DelegateScreen2;
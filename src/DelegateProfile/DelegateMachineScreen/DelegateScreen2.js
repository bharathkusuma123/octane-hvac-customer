import React, { useState, useEffect, useContext } from "react";
import {
  FiArrowLeft,
  FiPower,
  FiSun,
  FiDroplet,
  FiThermometer,
} from "react-icons/fi";
// import "./Screen1.css";
// import "./Screen2.css";
import AIROlogo from "../../Components/Screens/MachineScreensNew/Images/AIRO.png";
import greenAire from "../../Components/Screens/MachineScreensNew/Images/greenAire.png";
import { useNavigate, useLocation } from "react-router-dom"; 
import { AuthContext } from "../../Components/AuthContext/AuthContext";
import TemperatureDial from "../../Components/Screens/MachineScreensNew/TemperatureDial";
import baseURL from "../../Components/ApiUrl/Apiurl";

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
    const {userId, company_id } = location.state || {};
  
  // State management
  const selectedService = getSelectedService(location);
  const deviceId = selectedService?.pcb_serial_number || "2411GM-0102";
  const [loading, setLoading] = useState(true);
  
  const [processing, setProcessing] = useState({ status: false, message: "" });
  const [sensorData, setSensorData] = useState({
    outsideTemp: 0,
    humidity: 0,
    roomTemp: 0,
    fanSpeed: "0",
    temperature: 25,
    powerStatus: "off",
    mode: "3",
    errorFlag: "0",
    hvacBusy: "0",
    deviceId: deviceId,
    alarmOccurred: "0",
  });

  // Derived values
  const currentModeDescription = MODE_MAP[sensorData.mode] || "Fan";
  const fanPosition = FAN_SPEEDS.indexOf(sensorData.fanSpeed);
  const fanPercentage = fanPosition * 50;

  // Fetch data
  useEffect(() => {
    if (!deviceId) return;

    const fetchData = async () => {
      try {
        const [dataResponse, controllerResponse] = await Promise.all([
          fetch(`${baseURL}/get-latest-data/${deviceId}/?user_id=${userId}&company_id=${company_id}`),
          fetch("https://rahul21.pythonanywhere.com/controllers")
        ]);

        if (!dataResponse.ok) throw new Error("Network response was not ok");
        
        const data = await dataResponse.json();
        if (data.status !== "success" || !data.data) {
          throw new Error("Invalid data format from API");
        }

        const deviceData = data.data;
        let latestController = {};

        if (controllerResponse.ok) {
          const controllerData = await controllerResponse.json();
          if (Array.isArray(controllerData)) {
            latestController = controllerData.reduce(
              (prev, current) => (prev.id > current.id ? prev : current),
              {}
            );
          }
        }

        setSensorData(prev => ({
          outsideTemp: deviceData.outdoor_temperature?.value || prev.outsideTemp,
          humidity: deviceData.room_humidity?.value || prev.humidity,
          roomTemp: deviceData.room_temperature?.value || prev.roomTemp,
          // fanSpeed: latestController.FS?.toString() || deviceData.fan_speed?.value || prev.fanSpeed,
          // temperature: latestController.SRT?.toString() || deviceData.set_temperature?.value || prev.temperature,
          // mode: latestController.MD?.toString() || deviceData.mode?.value || prev.mode,
            fanSpeed: deviceData.fan_speed?.value || prev.fanSpeed,
          temperature: deviceData.set_temperature?.value || prev.temperature,
            mode: deviceData.mode?.value || prev.mode,
          powerStatus: deviceData.hvac_on?.value === "1" ? "on" : "off", // Always update from API
          errorFlag: deviceData.error_flag?.value || prev.errorFlag,
          hvacBusy: deviceData.hvac_busy?.value || prev.hvacBusy,
          deviceId: deviceData.pcb_serial_number || prev.deviceId,
          alarmOccurred: deviceData.alarm_occurred?.value || prev.alarmOccurred,
        }));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 1000);
    return () => clearInterval(intervalId);
  }, [deviceId]); // Removed processing.status from dependencies

  // API call handler
  const sendCommand = async (updates = {}, commandType = "general") => {
    if (processing.status || sensorData.hvacBusy === "1") {
      setProcessing({ 
        status: true, 
        message: sensorData.hvacBusy === "1" 
          ? "System is busy, please wait..." 
          : "Please wait..." 
      });
      return false;
    }

    setProcessing({ status: true, message: "Sending command, please wait..." });

    const payload = {
      Header: "0xAA",
      DI: deviceId,
      MD: parseInt(updates.mode || sensorData.mode) || 1,
      FS: parseInt(updates.fanSpeed || sensorData.fanSpeed) || 0,
      SRT: parseInt(updates.temperature || sensorData.temperature) || 25,
      HVAC: updates.powerStatus === "off" ? 0 : 1,
      Footer: "0xZX",
    };

    try {
      const response = await fetch("https://rahul21.pythonanywhere.com/controllers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to send command");
      
      // Disable all interactive elements for 25 seconds
      setTimeout(() => {
        setProcessing({ status: false, message: "" });
      }, 25000); // 25 seconds
      
      return true;
    } catch (error) {
      console.error("Error sending command:", error);
      setProcessing({ status: false, message: "Failed to send command" });
      return false;
    }
  };

  // Event handlers
  const handlePowerToggle = async () => {
    const newPowerStatus = sensorData.powerStatus === "on" ? "off" : "on";
    const updates = { powerStatus: newPowerStatus };
    
    await sendCommand(updates, "power");
  };

  const handleModeChange = async (newMode) => {
    const newModeCode = MODE_CODE_MAP[newMode] || 1;
    const updates = { mode: newModeCode.toString() };

    // If power is off, just update local state (no API call needed)
    if (sensorData.powerStatus === "off") {
      setSensorData(prev => ({ ...prev, ...updates }));
      return;
    }

    await sendCommand(updates, "mode");
  };

  const handleFanSpeedChange = async (newPosition) => {
    const newSpeed = FAN_SPEEDS[newPosition];
    const updates = { fanSpeed: newSpeed };

    // If power is off, just update local state (no API call needed)
    if (sensorData.powerStatus === "off") {
      setSensorData(prev => ({ ...prev, ...updates }));
      return;
    }

    await sendCommand(updates, "fan");
  };

  const handleFanClick = (e) => {
    if (processing.status) return;
    
    const containerWidth = e.currentTarget.offsetWidth;
    const clickPosition = e.nativeEvent.offsetX;
    const segmentWidth = containerWidth / 3;
    const newPosition = Math.min(2, Math.floor(clickPosition / segmentWidth));
    handleFanSpeedChange(newPosition);
  };

  const handleTempChange = (newTemp) => {
    // Temperature changes are local only for now
    setSensorData(prev => ({ ...prev, temperature: newTemp.toString() }));
  };

  const handleBackClick = () => {
    if (!processing.status) {
      navigate("/delegate-machinescreen1");
    }
  };

  // Loading state
  if (!selectedService) {
    return <div className="loading">Loading...</div>;
  }

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="mainmain-container" style={{
      backgroundImage: "linear-gradient(to bottom, #3E99ED, #2B7ED6)"
    }}>
      <div className="main-container">
        {/* Header Section */}
        <div className="header">
          <button 
            className="icon-button" 
            onClick={handleBackClick}
            disabled={processing.status}
            style={{
              opacity: processing.status ? 0.6 : 1,
              cursor: processing.status ? "not-allowed" : "pointer"
            }}
          >
            <FiArrowLeft size={24} color="white" />
          </button>

          <img src={AIROlogo} alt="AIRO Logo" className="logo" />

          <div className="power-button-container">
            <button
              className={`power-button ${sensorData.powerStatus === 'on' ? 'on' : 'off'} ${processing.status ? "processing" : ""}`}
              onClick={handlePowerToggle}
              disabled={processing.status}
              style={{
                opacity: processing.status ? 0.6 : 1,
              }}
            >
              <FiPower size={24} color="white" />
              {processing.status && <span className="processing-indicator"></span>}
            </button>

            {sensorData.errorFlag === "1" && (
              <div className="error-indicator" />
            )}
          </div>
        </div>

        {/* Status Messages */}
        {processing.status && (
          <div className="processing-message">{processing.message}</div>
        )}

        {sensorData.errorFlag === "1" && (
          <div className="error-message">
            ⚠️ System Error Detected
          </div>
        )}

        {sensorData.hvacBusy === "1" && !processing.status && (
          <div className="busy-message">
            ⏳ System is currently busy
          </div>
        )}

        {/* Temperature Dial */}
        <TemperatureDial
          sensorData={sensorData}
          onTempChange={handleTempChange}
          fanSpeed={fanPosition}
          initialTemperature={sensorData.temperature ?? 25}
          disabled={processing.status} // Pass disabled prop to TemperatureDial if needed
        />

        {/* Environment Info */}
        <div className="env-info">
          <div className="env-item">
            <FiSun className="env-icon" size={20} color="#FFFFFF" />
            <div className="env-value">{formatTemp(sensorData.outsideTemp)}°C</div>
            <div className="env-label">Outside Temp</div>
          </div>
          <div className="env-item">
            <FiThermometer className="env-icon" size={20} color="#FFFFFF" />
            <div className="env-value">{formatTemp(sensorData.roomTemp)}°C</div>
            <div className="env-label">Room Temp</div>
          </div>
          <div className="env-item">
            <FiDroplet className="env-icon" size={20} color="#FFFFFF" />
            <div className="env-value">{sensorData.humidity}%</div>
            <div className="env-label">Humidity</div>
          </div>
        </div>

        {/* Control Section */}
        <div className="control-buttons-container">
          <div className="handle" />

          {/* Modes Section */}
          <div className="section">
            <h3 className="heading">Modes</h3>
            <div className="mode-row">
              {Object.values(MODE_MAP).map((mode) => (
                <button
                  key={mode}
                  onClick={() => handleModeChange(mode)}
                  className={`mode-button ${
                    currentModeDescription === mode ? "mode-button-selected" : ""
                  }`}
                  disabled={processing.status}
                  style={{
                    opacity: processing.status ? 0.6 : 1,
                    cursor: processing.status ? "not-allowed" : "pointer"
                  }}
                >
                  <span className={`mode-text ${
                    currentModeDescription === mode ? "mode-text-selected" : ""
                  }`}>
                    {mode}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Fan Speed Section */}
          <div className="section">
            <h3 className="heading">Fan Speed</h3>
            <div
              className="line-with-dot-container"
              onClick={processing.status ? undefined : handleFanClick}
              style={{ 
                cursor: processing.status ? "not-allowed" : "pointer",
                opacity: processing.status ? 0.6 : 1,
              }}
            >
              <div className="line" />
              {FAN_LABELS.map((_, index) => (
                <div 
                  key={index}
                  className="vertical-marker" 
                  style={{ left: `${index * 50}%` }} 
                />
              ))}
              <div
                className="dot"
                style={{
                  left: `${fanPercentage}%`,
                  cursor: processing.status ? "not-allowed" : "pointer",
                }}
              />
              <div className="fan-speed-labels">
                {FAN_LABELS.map((label, index) => (
                  <span key={index} style={{ left: `${index * 50}%` }}>
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Logo */}
          <div className="logo-container">
            <img src={greenAire} alt="GreenAire Logo" className="logo-image" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DelegateScreen2;
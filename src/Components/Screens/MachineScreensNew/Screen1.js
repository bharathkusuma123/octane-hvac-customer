// Screen1.js (Optimized)
import React, { useState, useEffect, useContext } from "react";
import {
  FiArrowLeft,
  FiPower,
  FiWind,
  FiClock,
  FiWatch,
  FiSettings,
  FiZap,
  FiLogOut,
  FiSun,
  FiDroplet,
  FiThermometer,
  FiNavigation,
  FiLayers,
  FiRefreshCw,
  FiCornerUpRight,
  FiChevronDown,
} from "react-icons/fi";
import { FaFan } from "react-icons/fa";
import "./Screen1.css";
import AIROlogo from "./Images/AIRO.png";
import greenAire from "./Images/greenAire.png";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext/AuthContext";
import TemperatureDial from "./TemperatureDial";
import baseURL from "../../ApiUrl/Apiurl";
import NoServiceItems from "./NoServiceItems";
import Loading from "./Loading";

// Constants
const MODE_MAP = {
  1: "IDEC",
  2: "Auto",
  3: "Fan",
  4: "Indirect",
  5: "Direct",
};

// Helper functions
const getStoredService = () => {
  try {
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

const Screen1 = () => {
  const { user, logout } = useContext(AuthContext);
  const userId = user?.customer_id;
  const company_id = user?.company_id;
  const navigate = useNavigate();

  // State management
  const [serviceItems, setServiceItems] = useState([]);
  const [selectedService, setSelectedService] = useState(getStoredService());
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  const [processing, setProcessing] = useState({ status: false, message: "" });
  const [errorCount, setErrorCount] = useState(0);
  const [loading, setLoading] = useState(true);
  
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
    deviceId: "",
    alarmOccurred: "0",
  });

  // Store selected service in localStorage
  useEffect(() => {
    if (selectedService) {
      localStorage.setItem('selectedService', JSON.stringify(selectedService));
    }
  }, [selectedService]);

  // Fetch service items on component mount
  useEffect(() => {
    const fetchServiceItems = async () => {
      try {
        const response = await fetch(
          `${baseURL}/service-items/?user_id=${userId}&company_id=${company_id}`
        );
        if (!response.ok) throw new Error("Failed to fetch service items");
        
        const data = await response.json();
        setServiceItems(data.data || []);
        
        if (data.data?.length > 0 && !selectedService) {
          setSelectedService(data.data[0]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching service items:", error);
        setLoading(false);
      }
    };

    fetchServiceItems();
  }, []);

  // Fetch sensor data when selectedService changes
  useEffect(() => {
    if (!selectedService || !selectedService.pcb_serial_number) return;

    const fetchData = async () => {
      try {
        const pcbSerialNumber = selectedService.pcb_serial_number;
        console.log("PCB-serial-number:", pcbSerialNumber);
        
        const [dataResponse, controllerResponse] = await Promise.all([
          fetch(`${baseURL}/get-latest-data/${pcbSerialNumber}/?user_id=${userId}&company_id=${company_id}`)
        ]);

        if (!dataResponse.ok) throw new Error("Network response was not ok");
        
        const data = await dataResponse.json();
        if (data.status !== "success" || !data.data) {
          throw new Error("Invalid data format from API");
        }

        const deviceData = data.data;

        setSensorData(prev => ({
          outsideTemp: deviceData.outdoor_temperature?.value,
          humidity: deviceData.room_humidity?.value,
          roomTemp: deviceData.room_temperature?.value,
          fanSpeed: deviceData.fan_speed?.value,
          temperature: deviceData.set_temperature?.value,
          powerStatus: deviceData.hvac_on?.value == "1" ? "on" : "off",
          mode: deviceData.mode?.value,
          errorFlag: deviceData.error_flag?.value,
          hvacBusy: deviceData.hvac_busy?.value,
          deviceId: deviceData.pcb_serial_number,
          alarmOccurred: deviceData.alarm_occurred?.value,
        }));

        const alarmValue = deviceData.alarm_occurred?.value;
        setErrorCount(alarmValue && alarmValue !== "0" ? Number(alarmValue) : 0);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 1000);
    return () => clearInterval(intervalId);
  }, [selectedService]);

  // Event handlers
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handlePowerToggle = async () => {
    if (processing.status || sensorData.hvacBusy == "1") {
      setProcessing({ 
        status: true, 
        message: sensorData.hvacBusy == "1" 
          ? "System is busy, please wait..." 
          : "Please wait..." 
      });
      return;
    }

    setProcessing({ status: true, message: "Sending command, please wait..." });

    const newHvacValue = sensorData.powerStatus == "on" ? "0" : "1";

    const isShutdown = sensorData?.fanSpeed == 3 || sensorData?.mode == 0;

    const payload = {
      Header: "0xAA",
      DI: selectedService?.pcb_serial_number || "2411GM-0102",
      MD: isShutdown ? "3" : sensorData.mode,
      FS: isShutdown ? "0" : sensorData.fanSpeed,
      SRT: sensorData.temperature,
      HVAC: newHvacValue,
      Footer: "0xZX",
    };

    console.log("Sending payload:", payload);

    try {
      const response = await fetch("https://mdata.air2o.net/controllers/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to send command");

      setTimeout(() => {
        setProcessing({ status: false, message: "" });
      }, 22000);
    } catch (error) {
      console.error("Error sending command:", error);
      setProcessing({ status: false, message: "Failed to send command" });
    }
  };

  const handleNavigation = (path) => {
    if (!processing.status) {
      navigate(path);
    }
  };

  const handleServiceSelect = (item) => {
    setSelectedService(item);
    setShowServiceDropdown(false);
  };

  const handleTempChange = (newTemp) => {
    console.log("Temperature changed:", newTemp);
  };

  // Check if selected service has PCB serial number
  const hasValidPCBSerial = selectedService && selectedService.pcb_serial_number;

  // Fan position and mode description
  const fanPosition = ["0", "1", "2"].indexOf(sensorData.fanSpeed);
  const getModeDescription = (code) => MODE_MAP[code] || "Fan";

  // Render different states
  if (loading) {
    return <Loading onLogout={handleLogout} />;
  }

  if (!loading && serviceItems.length === 0) {
    return (
      <NoServiceItems 
        onLogout={handleLogout} 
        onNavigateHome={() => navigate("/home")} 
      />
    );
  }

  return (
    <div className="mainmain-container" style={{
      backgroundImage: "linear-gradient(to bottom, #3E99ED, #2B7ED6)"
    }}>
      <div className="main-container">
        {/* Service Dropdown */}
        <div className="service-dropdown-wrapper">
          <div className="service-dropdown-container">
            <div
              className="service-dropdown-header"
              onClick={() => setShowServiceDropdown(!showServiceDropdown)}
            >
              <span>
                {selectedService ? selectedService.service_item_name : "Select Service"}
              </span>
              <FiChevronDown size={18} />
            </div>
            {showServiceDropdown && (
              <div className="service-dropdown-list">
                {serviceItems.map((item) => (
                  <div
                    key={item.service_item_id}
                    className="service-dropdown-item"
                    onClick={() => handleServiceSelect(item)}
                  >
                    {item.service_item_name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
 
        {!hasValidPCBSerial && (
          <h6 style={{ color: "black", marginTop: "10px" }}>
            no pcb serial number captured.
          </h6>
        )}

        {/* Header */}
        <div className="header1">
          <div className="logo">
            <img
              src={AIROlogo}
              alt="AIRO Logo"
              className="logo-image"
              style={{ marginBottom: "-158px" }}
            />
          </div>

          <div style={{ position: "relative" }}>
            <button
              className={`screen1-power-button ${processing.status ? "processing" : ""}`}
              onClick={handlePowerToggle}
              disabled={processing.status}
              style={{
                backgroundColor: sensorData.powerStatus == "on" ? "#5adb5eff" : "#c80000f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "none",
                height: "48px",
                width: "48px",
                borderRadius: "4px",
                padding: "8px",
                cursor: processing.status ? "not-allowed" : "pointer",
                fontWeight: "bold",
                opacity: processing.status ? 0.6 : 1,
              }}
            >
              <FiPower size={24} color="#fff" />
              {processing.status && <span className="processing-indicator"></span>}
            </button>

            {sensorData.errorFlag == "1" && (
              <div className="error-indicator" />
            )}
          </div>
        </div>

        {/* Status Messages */}
        {processing.status && (
          <div className="processing-message">{processing.message}</div>
        )}

        {sensorData.errorFlag == "1" && (
          <div className="error-message">
            ⚠️ System Error Detected
          </div>
        )}

        {sensorData.hvacBusy == "1" && !processing.status && (
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
            <div className="env-value">{formatTemp(sensorData.humidity)}%</div>
            <div className="env-label">Humidity</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="footer-container">
        <div className="control-buttons">
          <button
            className={`control-btn ${!hasValidPCBSerial ? 'disabled-btn' : ''}`}
            onClick={() => {
              if (hasValidPCBSerial) {
                navigate("/machinescreen2", { 
                  state: { sensorData, selectedService, userId, company_id}
                });
              }
            }}
            disabled={!hasValidPCBSerial}
            title={!hasValidPCBSerial ? "Modes unavailable - No PCB serial number assigned to this machine" : ""}
          >
            <FiWind size={20} />
            <span>Modes</span>
            <span><strong>{getModeDescription(sensorData.mode)}</strong></span>
          </button>
          
          <button
            className="control-btn"
            onClick={() => navigate("/alarms", {
              state: {
                alarmData: {
                  alarmOccurred: sensorData.alarmOccurred,
                  errorCount: errorCount,
                  deviceId: sensorData.deviceId,
                },
                userId: userId,
                company_id: company_id,
              },
            })}
          >
            <div style={{ position: "relative" }}>
              <FiClock size={20} />
              {errorCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-8px",
                    right: "-23px",
                    backgroundColor: "red",
                    color: "white",
                    borderRadius: "50%",
                    width: "18px",
                    height: "18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "10px",
                    fontWeight: "bold",
                  }}
                >
                  {errorCount}
                </span>
              )}
            </div>
            <span>Alarms</span>
          </button>
          
          <button
            className="control-btn"
            onClick={() => handleNavigation("/timers")}
          >
            <FiWatch size={20} />
            <span>Timers</span>
          </button>
          
          <button
            className="control-btn"
            onClick={() => handleNavigation("/settings")}
          >
            <FiSettings size={20} />
            <span>Settings</span>
          </button>
          
          <button
            className="control-btn"
            onClick={() => handleNavigation("/machine")}
          >
            <FiZap size={20} />
            <span>Services</span>
          </button>
          
          <button
            className="control-btn"
            onClick={handleLogout}
          >
            <FiLogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
        
        <div className="footer-logo">
          <img src={greenAire} alt="GreenAire Logo" className="logo-image" style={{marginTop:"-12px"}} />
        </div>
      </div>
    </div>
  );
};

export default Screen1;
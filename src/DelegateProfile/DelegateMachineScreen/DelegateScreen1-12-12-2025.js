import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
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
// import "./Screen1.css";
import AIROlogo from "../../Components/Screens/MachineScreensNew/Images/AIRO.png";
import greenAire from "../../Components/Screens/MachineScreensNew/Images/greenAire.png";
import { useNavigate } from "react-router-dom"; 
import { AuthContext } from "../../Components/AuthContext/AuthContext";
import TemperatureDial from "../../Components/Screens/MachineScreensNew/TemperatureDial";
import baseURL from "../../Components/ApiUrl/Apiurl";
import { useDelegateServiceItems } from "../../Components/AuthContext/DelegateServiceItemContext";
import './DelegateMachineScreens.css'
// Mode mapping constant
const MODE_MAP = {
  1: "IDEC",
  2: "Auto",
  3: "Fan",
  4: "Indirect",
  5: "Direct",
};

// Helper functions
const formatTemp = (temp) => {
  if (temp == null) return "0.0";
  const num = parseFloat(temp);
  return isNaN(num) ? "0.0" : num.toFixed(1);
};

const DelegateScreen1 = () => {
  const { user, logout } = useContext(AuthContext);
  const { 
    selectedServiceItem,
    getSelectedServiceDetails,
    serviceItemPermissions,
    serviceItems, // Get all service items from context
    updateSelectedServiceItem, // Function to change selected service item
    loading: serviceItemsLoading 
  } = useDelegateServiceItems();
  
  const userId = user?.delegate_id;
  const company_id = user?.company_id;
  const navigate = useNavigate();

  // State management
  const [selectedService, setSelectedService] = useState(null);
  const [processing, setProcessing] = useState({ status: false, message: "" });
  const [errorCount, setErrorCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [serviceItemsList, setServiceItemsList] = useState([]); // Store service items with names
  
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

  // Check if selected service has PCB serial number - ONLY for restricting modes
  const hasValidPCBSerial = selectedService && selectedService.pcb_serial_number;

  // Fetch service items with names from API
  useEffect(() => {
    if (user?.company_id && user?.delegate_id) {
      axios.get(`${baseURL}/service-items/?user_id=${user.delegate_id}&company_id=${user.company_id}`)
        .then((response) => {
          try {
            const data = Array.isArray(response.data) ? response.data : 
                        (response.data?.data && Array.isArray(response.data.data) ? response.data.data : []);
            setServiceItemsList(data);
          } catch (error) {
            console.error('Error processing service items data:', error);
            setServiceItemsList([]);
          }
        })
        .catch((error) => {
          console.error('Error fetching service items:', error);
          setServiceItemsList([]);
        });
    }
  }, [user?.company_id, user?.delegate_id]);

  // Get the complete service details when selectedServiceItem changes
  useEffect(() => {
    if (!serviceItemsLoading && selectedServiceItem) {
      const serviceDetails = getSelectedServiceDetails();
      console.log("Selected Service Details:", serviceDetails);
      setSelectedService(serviceDetails);
    }
  }, [selectedServiceItem, serviceItemsLoading, getSelectedServiceDetails]);

  // Fetch sensor data when selectedService changes
  useEffect(() => {
    if (!selectedService || !selectedService.pcb_serial_number) {
      console.log("Waiting for service details with PCB serial number:", selectedService);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const pcbSerialNumber = selectedService.pcb_serial_number;
        console.log("Fetching data for PCB-serial-number:", pcbSerialNumber);
        
        const [dataResponse] = await Promise.all([
          fetch(`${baseURL}/get-latest-data/${pcbSerialNumber}/?user_id=${userId}&company_id=${company_id}`)
        ]);

        if (!dataResponse.ok) throw new Error("Network response was not ok");
        
        const data = await dataResponse.json();
        console.log("API response data:", data);
        
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
  }, [selectedService, userId, company_id]);

  // Event handlers
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleServiceItemChange = (e) => {
    const selectedId = e.target.value;
    updateSelectedServiceItem(selectedId);
    // Reset loading states when changing service items
    setLoading(true);
    setSelectedService(null);
  };

  const handlePowerToggle = async () => {
    if (!selectedService?.pcb_serial_number) {
      console.error("No PCB serial number available");
      return;
    }

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

    const isShutdown = sensorData?.fanSpeed === 3 || sensorData?.mode === 0;
    const payload = {
      Header: "0xAA",
      DI: selectedService.pcb_serial_number,
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
      }, 15000);

    } catch (error) {
      console.error("Error sending command:", error);
      setProcessing({ status: false, message: "Failed to send command" });
    }
  };

  // Get service item name for display
  const getServiceItemName = (serviceItemId) => {
    if (!serviceItemId) return 'Select Service Item';
    
    const itemFromApi = serviceItemsList.find(item => item.service_item_id === serviceItemId);
    if (itemFromApi) {
      return itemFromApi.service_item_name || serviceItemId;
    }
    
    const itemFromContext = serviceItems.find(item => item.service_item === serviceItemId);
    return itemFromContext ? itemFromContext.service_item_name || serviceItemId : serviceItemId;
  };

  // No service items case
  if (!serviceItemsLoading && serviceItems.length === 0) {
    return (
      <div className="mainmain-container" style={{
        backgroundImage: "linear-gradient(to bottom, #3E99ED, #2B7ED6)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        textAlign: "center"
      }}>
        <div className="logo">
          <img
            src={AIROlogo}
            alt="AIRO Logo"
            className="logo-image delegate-logo"
            style={{ marginBottom: "20px" }}
          />
        </div>
        
        <div style={{
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          padding: "40px",
          borderRadius: "12px",
          maxWidth: "500px",
          width: "100%"
        }}>
          <h2 style={{ color: "white", marginBottom: "20px", fontSize: "24px" }}>
            No Machines Assigned
          </h2>
          <p style={{ color: "white", marginBottom: "30px", fontSize: "16px", lineHeight: "1.5" }}>
            You don't have any machines assigned to your account yet. 
            Please wait until a machine is assigned to you, or contact your administrator.
          </p>
          
          <div style={{ display: "flex", gap: "15px", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={handleLogout}
              style={{
                padding: "12px 24px",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                color: "white",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <FiLogOut size={18} />
              Logout
            </button>
          </div>
           <div style={{ marginTop: "10%", display: "flex", gap: "15px", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => navigate("/delegate-home")}
              style={{
                padding: "12px 24px",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                color: "white",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <FiLogOut size={18} />
              Go to Home
            </button>
          </div>
        </div>
        
        <div className="footer-logo" style={{ marginTop: "40px" }}>
          <img src={greenAire} alt="GreenAire Logo" className="logo-image" />
        </div>
      </div>
    );
  }

  // Loading state
  if (serviceItemsLoading) {
    return (
      <div
        className="mainmain-container"
        style={{
          backgroundImage: "linear-gradient(to bottom, #3E99ED, #2B7ED6)",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          color: "white",
        }}
      >
        <div
          className="loading"
          style={{ color: "white", fontSize: "18px", marginBottom: "20px", gap: "10%" }}
        >
          Loading...
          
        <button
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            color: "white",
            border: "1px solid white",
            borderRadius: "8px",
            padding: "8px 16px",
            cursor: "pointer",
            fontSize: "16px",
            transition: "0.3s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.25)")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.15)")}
        >
          <FiLogOut size={20} />
          <span>Logout</span>
        </button>
        </div>
      </div>
    );
  }

  // Handle case where no service item is selected but service items exist
  if (!selectedServiceItem && serviceItems.length > 0) {
    return (
      <div className="mainmain-container" style={{
        backgroundImage: "linear-gradient(to bottom, #3E99ED, #2B7ED6)"
      }}>
        <div className="main-container">
          <div className="error-message">
            Please select a service item to continue.
          </div>
          <button 
            className="control-btn" 
            onClick={() => navigate("/delegate-home")}
            style={{ marginTop: '20px' }}
          >
            Go Back to Services
          </button>
        </div>
      </div>
    );
  }

  const handleNavigation = (path) => {
    if (!processing.status) {
      navigate(path);
    }
  };

  const handleTempChange = (newTemp) => {
    console.log("Temperature changed:", newTemp);
  };

  // Derived values
  const fanPosition = ["0", "1", "2"].indexOf(sensorData.fanSpeed);
  const getModeDescription = (code) => MODE_MAP[code] || "Fan";

  return (
    <div className="mainmain-container" style={{
      backgroundImage: "linear-gradient(to bottom, #3E99ED, #2B7ED6)"
    }}>
      <div className="main-container">
        {/* Service Display - Now with Dropdown when multiple items exist */}
        <div className="service-display-container delegate-service-display">
          {serviceItems.length > 1 ? (
            // Show dropdown when user has multiple service items
            <div className="service-dropdown-container">
              <label htmlFor="service-item-select" className="service-dropdown-label">
                Select Service Item:
              </label>
              <select
                id="service-item-select"
                className="service-dropdown-select"
                value={selectedServiceItem}
                onChange={handleServiceItemChange}
              >
                {serviceItems.map((item) => {
                  const displayName = getServiceItemName(item.service_item);
                  return (
                    <option key={item.service_item} value={item.service_item}>
                      {displayName}
                    </option>
                  );
                })}
              </select>
            </div>
          ) : (
            // Show simple display when user has only one service item
            <div className="service-display-header">
              <span>
                {selectedService?.service_item_name || "Loading..."}
              </span>
              <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px' }}>
                PCB: {selectedService?.pcb_serial_number || 'Loading...'}
              </div>
              {serviceItemPermissions.can_control_equipment && (
                <div style={{ fontSize: '10px', color: '#4CAF50', marginTop: '2px' }}>
                  • Control Enabled
                </div>
              )}
            </div>
          )}
        </div>

        {/* PCB Warning Message */}
        {selectedService && !hasValidPCBSerial && (
          <h6 style={{ color: "black", marginTop: "10px", textAlign: "center" }}>
            No PCB serial number captured.
          </h6>
        )}

        {/* Header */}
        <div className="header1 delegate-header">
          <div className="logo">
            <img
              src={AIROlogo}
              alt="AIRO Logo"
              className="logo-image delegate-logo"
              style={{ marginBottom: "-68px" }}
            />
          </div>

          <div style={{ position: "relative" }}>
            <button
              className={`screen1-power-button screen1-power-button2 ${processing.status ? "processing" : ""}`}
              onClick={handlePowerToggle}
              disabled={processing.status || !selectedService?.pcb_serial_number || !serviceItemPermissions.can_control_equipment}
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
                cursor: (processing.status || !serviceItemPermissions.can_control_equipment) ? "not-allowed" : "pointer",
                fontWeight: "bold",
                opacity: (processing.status || !serviceItemPermissions.can_control_equipment) ? 0.6 : 1,
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

        {!serviceItemPermissions.can_control_equipment && (
          <div className="warning-message">
            ⚠️ Control permissions not available
          </div>
        )}

        {/* Temperature Dial */}
        <div style={{ pointerEvents: 'none', opacity: 0.7 }}>
        <TemperatureDial
          sensorData={sensorData}
          onTempChange={handleTempChange}
          fanSpeed={fanPosition}
          initialTemperature={sensorData.temperature ?? 25}
        />
        </div>

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
                navigate("/delegate-machinescreen2", { 
                  state: { sensorData, selectedService, userId, company_id}
                });
              }
            }}
            disabled={!hasValidPCBSerial || !serviceItemPermissions.can_control_equipment}
            title={!hasValidPCBSerial ? "Modes unavailable - No PCB serial number assigned to this machine" : ""}
          >
            <FiWind size={20} />
            <span>Modes</span>
            <span><strong>{getModeDescription(sensorData.mode)}</strong></span>
          </button>
          
          <button
            className="control-btn"
            onClick={() => navigate("/Delegate-alarms", {
              state: {
                alarmData: {
                  alarmOccurred: sensorData.alarmOccurred,
                  errorCount: errorCount,
                  deviceId: sensorData.deviceId,
                },
                userId: userId,
                company_id: company_id
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
            disabled={!serviceItemPermissions.can_control_equipment}
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
            onClick={() => handleNavigation("/delegate-home")}
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
          <img src={greenAire} alt="GreenAire Logo" className="logo-image" />
        </div>
      </div>
    </div>
  );
};

export default DelegateScreen1;
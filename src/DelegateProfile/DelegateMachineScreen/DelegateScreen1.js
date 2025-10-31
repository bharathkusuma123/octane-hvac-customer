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
      return;
    }

    const fetchData = async () => {
      try {
        const pcbSerialNumber = selectedService.pcb_serial_number;
        console.log("Fetching data for PCB-serial-number:", pcbSerialNumber);
        
        const [dataResponse, controllerResponse] = await Promise.all([
          fetch(`${baseURL}/get-latest-data/${pcbSerialNumber}/?user_id=${userId}&company_id=${company_id}`)
          // fetch("https://rahul21.pythonanywhere.com/controllers")
        ]);

        if (!dataResponse.ok) throw new Error("Network response was not ok");
        
        const data = await dataResponse.json();
        console.log("API response data:", data);
        
        if (data.status !== "success" || !data.data) {
          throw new Error("Invalid data format from API");
        }

        const deviceData = data.data;
        // let latestController = {};

        // if (controllerResponse.ok) {
        //   const controllerData = await controllerResponse.json();
        //   if (Array.isArray(controllerData)) {
        //     latestController = controllerData.reduce(
        //       (prev, current) => (prev.id > current.id ? prev : current),
        //       {}
        //     );
        //   }
        // }

        // Update sensor data
        setSensorData(prev => ({
          outsideTemp: deviceData.outdoor_temperature?.value || prev.outsideTemp,
          humidity: deviceData.room_humidity?.value || prev.humidity,
          roomTemp: deviceData.room_temperature?.value || prev.roomTemp,
          fanSpeed: deviceData.fan_speed?.value || prev.fanSpeed,
          temperature: deviceData.set_temperature?.value || prev.temperature,
          powerStatus: deviceData.hvac_on?.value == "1" ? "on" : "off",
          mode: deviceData.mode?.value,
          errorFlag: deviceData.error_flag?.value || prev.errorFlag,
          hvacBusy: deviceData.hvac_busy?.value || prev.hvacBusy,
          deviceId: deviceData.pcb_serial_number || prev.deviceId,
          alarmOccurred: deviceData.alarm_occurred?.value || prev.alarmOccurred,
        }));

        // Update error count
        const alarmValue = deviceData.alarm_occurred?.value;
        setErrorCount(alarmValue && alarmValue !== "0" ? Number(alarmValue) : 0);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 10000);
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

    const newHvacValue = sensorData.powerStatus == "on" ? 0 : 1;

    const payload = {
      Header: "0xAA",
      DI: selectedService.pcb_serial_number,
      MD: sensorData.mode,
      FS: sensorData.fanSpeed,
      SRT: sensorData.temperature,
      HVAC: newHvacValue,
      Footer: "0xZX",
    };

    console.log("Sending payload:", payload);

    try {
      const response = await fetch("https://rahul21.pythonanywhere.com/controllers", {
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

  // Show loading state
  if (serviceItemsLoading) {
    return <div className="loading">Loading service items...</div>;
  }

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

  if (serviceItems.length === 0) {
    return (
      <div className="mainmain-container" style={{
        backgroundImage: "linear-gradient(to bottom, #3E99ED, #2B7ED6)"
      }}>
        <div className="main-container">
          <div className="error-message">
            No service items available. Please contact administrator.
          </div>
          <button 
            className="control-btn" 
            onClick={() => navigate("/delegate-home")}
            style={{ marginTop: '20px' }}
          >
            Go Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (loading && !selectedService?.pcb_serial_number) {
    return <div className="loading">Initializing device data...</div>;
  }

  const handleNavigation = (path) => {
    if (!processing.status) {
      navigate(path);
    }
  };

  const handleTempChange = (newTemp) => {
    console.log("Temperature changed:", newTemp);
    // Update backend if needed
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
        <div className="service-display-container">
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
              
              {/* Display selected service details */}
              {/* {selectedService && (
                <div className="selected-service-details">
                  <div style={{ fontSize: '14px', fontWeight: 'bold', marginTop: '8px' }}>
                    {selectedService.service_item_name}
                  </div>
                  <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px' }}>
                    PCB: {selectedService.pcb_serial_number || 'N/A'}
                  </div>
                  {serviceItemPermissions.can_control_equipment && (
                    <div style={{ fontSize: '10px', color: '#4CAF50', marginTop: '2px' }}>
                      • Control Enabled
                    </div>
                  )}
                </div>
              )} */}
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

        {/* Header */}
        <div className="header1">
          <div className="logo">
            <img
              src={AIROlogo}
              alt="AIRO Logo"
              className="logo-image"
              style={{ marginBottom: "-68px" }}
            />
          </div>

          <div style={{ position: "relative" }}>
            <button
              className={`screen1-power-button ${processing.status ? "processing" : ""}`}
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
            <div className="env-value">{sensorData.humidity}%</div>
            <div className="env-label">Humidity</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="footer-container">
        <div className="control-buttons">
          <button
            className="control-btn"
            onClick={() => navigate("/delegate-machinescreen2", { 
              state: { sensorData, selectedService, userId, company_id}
            })}
            disabled={!serviceItemPermissions.can_control_equipment}
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
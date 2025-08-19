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

const Screen1 = () => {
  const { user } = useContext(AuthContext);
  const userId = user?.customer_id;
  const company_id = user?.company_id;
  const [serviceItems, setServiceItems] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  const [sensorData, setSensorData] = useState({
    outsideTemp: 0,
    humidity: 0,
    roomTemp: 0,
    fanSpeed: "3", // Default to shutdown/off
    temperature: 25,
    powerStatus: "off",
    mode: "3", // Default to IDEC
    errorFlag: "0",
    hvacBusy: "0",
    deviceId: "",
    alarmOccurred: "0", // Add alarm occurred flag
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState("");
  const navigate = useNavigate();
  const [errorCount, setErrorCount] = useState(0);

  // Mode mapping
  const modeMap = {
    1: "IDEC",
    2: "Auto",
    3: "Fan",
    4: "Indirect",
    5: "Direct",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://46.37.122.105:83/live_events/get-latest-data/"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        if (data.status !== "success" || !data.data || data.data.length === 0) {
          throw new Error("Invalid data format from API");
        }

        const deviceData = data.data[0];

        // Fetch controller settings
        const controllerResponse = await fetch(
          "https://rahul21.pythonanywhere.com/controllers"
        );
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

        setSensorData((prev) => ({
          ...prev,
          outsideTemp:
            deviceData.outdoor_temperature?.value || prev.outsideTemp,
          humidity: deviceData.room_humidity?.value || prev.humidity,
          roomTemp: deviceData.room_temperature?.value || prev.roomTemp,
          fanSpeed:
            latestController.FS?.toString() ||
            deviceData.fan_speed?.value ||
            prev.fanSpeed,
          temperature:
            latestController.SRT?.toString() ||
            deviceData.set_temperature?.value ||
            prev.temperature,
          powerStatus: processing
            ? prev.powerStatus
            : latestController.HVAC !== undefined
            ? latestController.HVAC === 1
              ? "on"
              : "off"
            : deviceData.hvac_on?.value === "1"
            ? "on"
            : "off",
          mode:
            latestController.MD?.toString() ||
            deviceData.mode?.value ||
            prev.mode,
          errorFlag: deviceData.error_flag?.value || prev.errorFlag,
          hvacBusy: deviceData.hvac_busy?.value || prev.hvacBusy,
          deviceId: deviceData.device_id || prev.deviceId,
          alarmOccurred: deviceData.alarm_occurred?.value || prev.alarmOccurred,
        }));

        // Update error count based on alarm_occurred (treat any non-'0' value as an alarm)
        setErrorCount(deviceData.alarm_occurred?.value !== "0" ? 1 : 0);

        // Handle processing state
        if (deviceData.hvac_busy?.value === "1") {
          setProcessing(true);
          setProcessingMessage("Processing, please wait...");
        } else {
          if (processing) {
            setTimeout(() => {
              setProcessing(false);
              setProcessingMessage("");
            }, 2000);
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    const fetchServiceItems = async () => {
      try {
        const response = await fetch(
          `http://175.29.21.7:8006/service-items/?user_id=${userId}&company_id=${company_id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch service items");
        }
        const data = await response.json();
        setServiceItems(data.data || []);
        if (data.data && data.data.length > 0) {
          setSelectedService(data.data[0]);
        }
      } catch (error) {
        console.error("Error fetching service items:", error);
      }
    };

    fetchData();
    fetchServiceItems();
    const intervalId = setInterval(fetchData, 50000);

    return () => clearInterval(intervalId);
  }, [processing]);

  const getFanSpeedDescription = (code) => {
    switch (code) {
      case "0":
        return "High";
      case "1":
        return "Medium";
      case "2":
        return "Low";
      case "3":
        return "Shutdown/off";
      default:
        return "Shutdown/off";
    }
  };

  const getModeDescription = (code) => {
    return modeMap[code] || "Fan";
  };

  const formatTemp = (temp) => {
    if (typeof temp === "string") {
      const num = parseFloat(temp);
      return isNaN(num) ? temp : num.toFixed(1);
    }
    return temp;
  };

  const handlePowerToggle = async () => {
    if (processing) return;

    if (sensorData.hvacBusy === "1") {
      setProcessing(true);
      setProcessingMessage("System is busy, please wait...");
      return;
    }

    setProcessing(true);
    setProcessingMessage("Sending command, please wait...");

    const newHvacValue = sensorData.powerStatus === "on" ? 0 : 1;

    const payload = {
      Header: "0xAA",
      DI: "2411GM-0102", // Use actual device ID from state or fallback
      MD: 3,
      FS: 0,
      SRT: 30,
      HVAC: newHvacValue,
      Footer: "0xZX",
    };
    console.log("Sending payload:", payload);

    try {
      const response = await fetch(
        "https://rahul21.pythonanywhere.com/controllers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      console.log("Response:", response);

      if (!response.ok) {
        throw new Error("Failed to send command");
      }

      // Simulate successful command and update local state
      setTimeout(() => {
        const newStatus = newHvacValue === 1 ? "on" : "off";
        setSensorData((prev) => ({ ...prev, powerStatus: newStatus }));
        setProcessing(false);
        setProcessingMessage("");
      }, 2000);
    } catch (error) {
      console.error("Error sending command:", error);
      setProcessing(false);
      setProcessingMessage("Failed to send command");
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }


//   if (loading) {
//   return <div className="loading-screen">Loading...</div>;
// }


  // if (error) {
  //   return <div className="error">Error: {error}</div>;
  // }

  const handleNavigation = (path) => {
    if (!processing) {
      navigate(path);
    }
  };

  const fanPosition = ["0", "1", "2", "3"].indexOf(sensorData.fanSpeed);

  const handleTempChange = (newTemp) => {
    console.log("Temperature changed:", newTemp);
    // Update your backend or state as needed
  };

  return (
    <div
      className="mainmain-container"
      style={{
        backgroundImage: "linear-gradient(to bottom, #3E99ED, #2B7ED6)",
      }}
    >
      <div className="main-container">
        {/* Service Dropdown - Moved above the header */}
        <div className="service-dropdown-container">
          <div
            className="service-dropdown-header"
            onClick={() => setShowServiceDropdown(!showServiceDropdown)}
          >
            <span>
              {selectedService
                ? selectedService.service_item_name
                : "Select Service"}
            </span>
            <FiChevronDown size={18} />
          </div>
          {showServiceDropdown && (
            <div className="service-dropdown-list">
              {serviceItems.map((item) => (
                <div
                  key={item.service_item_id}
                  className="service-dropdown-item"
                  onClick={() => {
                    setSelectedService(item);
                    setShowServiceDropdown(false);
                  }}
                >
                  {item.service_item_name}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="header1">
          <div className="logo">
            <img
              src={AIROlogo}
              alt="AIRO Logo"
              className="logo-image"
              style={{ marginBottom: "-68px" }}
            />
          </div>
          {/* <div style={{ position: "relative" }}>
            <button
              className={`power-button ${
                sensorData.powerStatus === "on" ? "power-on" : "power-off"
              } ${processing ? "processing" : ""}`}
              onClick={handlePowerToggle}
              disabled={processing}
            >
              <FiPower
                size={24}
                color={sensorData.powerStatus === "on" ? "#4CAF50" : "#F44336"}
              />
              {processing && <span className="processing-indicator"></span>}
            </button>
            
            {sensorData.errorFlag === "1" && (
              <div
                style={{
                  position: "absolute",
                  top: "-5px",
                  right: "-5px",
                  backgroundColor: "red",
                  borderRadius: "50%",
                  width: "12px",
                  height: "12px",
                  border: "2px solid white",
                }}
              />
            )}
          </div> */}

<div style={{ position: "relative" }}>
  <button
    className={`power-button ${processing ? "processing" : ""}`}
    onClick={handlePowerToggle}
    disabled={processing}
    style={{
      backgroundColor: sensorData.powerStatus === "on" ? "#4CAF50" : "#c80000f5",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "none",
      borderRadius: "4px",
      padding: "8px",
      cursor: processing ? "not-allowed" : "pointer",
      fontWeight: "bold",
    }}
  >
    <FiPower
      size={24}
      color="#fff" // keep icon visible
    />
    {processing && <span className="processing-indicator"></span>}
  </button>

  {/* Show error indicator on power button if errorFlag is 1 */}
  {sensorData.errorFlag === "1" && (
    <div
      style={{
        position: "absolute",
        top: "-5px",
        right: "-5px",
        backgroundColor: "red",
        borderRadius: "50%",
        width: "12px",
        height: "12px",
        border: "2px solid white",
      }}
    />
  )}
</div>





        </div>

        {processing && (
          <div className="processing-message">{processingMessage}</div>
        )}

        {/* Show error message if errorFlag is 1 */}
        {sensorData.errorFlag === "1" && (
          <div
            className="error-message"
            style={{
              color: "yellow",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            ⚠️ System Error Detected
          </div>
        )}

        {sensorData.hvacBusy === "1" && !processing && (
          <div
            className="busy-message"
            style={{
              color: "orange",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            ⏳ System is currently busy
          </div>
        )}

        <TemperatureDial
          sensorData={sensorData}
          onTempChange={handleTempChange}
          fanSpeed={fanPosition} // Add this prop
          initialTemperature={sensorData.temperature} // Pass the API temperature here
        />

        <div className="env-info">
          <div className="env-item">
            <FiSun className="env-icon" size={20} color="#FFFFFF" />
            <div className="env-value">
              {formatTemp(sensorData.outsideTemp)}°C
            </div>
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

      <div className="footer-container">
        <div className="control-buttons">
          <button
            className="control-btn"
            onClick={() => handleNavigation("/machinescreen2")}
            disabled={processing}
          >
            <FiWind size={20} />
            <span>Modes</span>
            <span>
              <strong>{getModeDescription(sensorData.mode)}</strong>
            </span>
          </button>
          <button
            className="control-btn"
            onClick={() =>
              navigate("/alarms", {
                state: {
                  alarmData: {
                    alarmOccurred: sensorData.alarmOccurred,
                    errorCount: errorCount,
                    deviceId: sensorData.deviceId,
                  },
                },
              })
            }
            disabled={processing}
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
            onClick={() => handleNavigation("/modes")}
            disabled={processing}
          >
            <FiWatch size={20} />
            <span>Timers</span>
          </button>
          <button
            className="control-btn"
            onClick={() => handleNavigation("/modes")}
            disabled={processing}
          >
            <FiSettings size={20} />
            <span>Settings</span>
          </button>
          <button
            className="control-btn"
            onClick={() => handleNavigation("/machine")}
            disabled={processing}
          >
            <FiZap size={20} />
            <span>Services</span>
          </button>
          <button
            className="control-btn"
            onClick={() => handleNavigation("/")}
            disabled={processing}
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

export default Screen1;

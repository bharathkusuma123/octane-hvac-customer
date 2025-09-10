import React, { useState, useEffect, useContext } from "react";
import {
  FiArrowLeft,
  FiPower,
  FiSun,
  FiDroplet,
  FiThermometer,
} from "react-icons/fi";
import "./Screen1.css";
import "./Screen2.css";
import AIROlogo from "./Images/AIRO.png";
import greenAire from "./Images/greenAire.png";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../AuthContext/AuthContext";
import TemperatureDial from "./TemperatureDial";

const Screen2 = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get data passed from Screen1 or use defaults
  const passedData = location.state?.sensorData || {};
  
  const [sensorData, setSensorData] = useState({
    outsideTemp: passedData.outsideTemp || 0,
    humidity: passedData.humidity || 0,
    roomTemp: passedData.roomTemp || 0,
    fanSpeed: passedData.fanSpeed || "0",
    temperature: passedData.temperature || 25,
    powerStatus: passedData.powerStatus || "off",
    mode: passedData.mode || "3",
    errorFlag: passedData.errorFlag || "0",
    hvacBusy: passedData.hvacBusy || "0",
    deviceId: passedData.deviceId || "",
    alarmOccurred: passedData.alarmOccurred || "0",
  });

  const [processing, setProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState("");

  const modeMap = {
    1: "IDEC",
    2: "Auto",
    3: "Fan",
    4: "Indirect",
    5: "Direct",
  };

  // Update sensor data when passed data changes
  useEffect(() => {
    if (location.state?.sensorData) {
      setSensorData(location.state.sensorData);
    }
  }, [location.state]);

  const getModeDescription = (code) => modeMap[code] || "Fan";

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
      DI: sensorData.deviceId || "2411GM-0102",
      MD: parseInt(sensorData.mode) || 1,
      FS: parseInt(sensorData.fanSpeed) || 0,
      SRT: parseInt(sensorData.temperature) || 25,
      HVAC: newHvacValue,
      Footer: "0xZX",
    };

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

      if (!response.ok) throw new Error("Failed to send command");

      setSensorData((prev) => ({
        ...prev,
        powerStatus: newHvacValue === 1 ? "on" : "off",
      }));
    } catch (error) {
      console.error("Error sending command:", error);
    } finally {
      setProcessing(false);
      setProcessingMessage("");
    }
  };

  const handleModeChange = async (newMode) => {
    const modeCodeMap = {
      IDEC: 1,
      Auto: 2,
      Fan: 3,
      Indirect: 4,
      Direct: 5,
    };

    const newModeCode = modeCodeMap[newMode] || 1;

    // If power is off, just update the local state
    if (sensorData.powerStatus === "off") {
      setSensorData((prev) => ({
        ...prev,
        mode: newModeCode.toString(),
      }));
      return;
    }

    // If power is on, make API call
    setProcessing(true);
    setProcessingMessage("Changing mode, please wait...");

    const payload = {
      Header: "0xAA",
      DI: sensorData.deviceId || "2411GM-0102",
      MD: newModeCode,
      FS: parseInt(sensorData.fanSpeed) || 0,
      SRT: parseInt(sensorData.temperature) || 25,
      HVAC: 1, // Keep power on
      Footer: "0xZX",
    };

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

      if (!response.ok) throw new Error("Failed to change mode");

      // Update local state on success
      setSensorData((prev) => ({
        ...prev,
        mode: newModeCode.toString(),
      }));
    } catch (error) {
      console.error("Error changing mode:", error);
    } finally {
      setProcessing(false);
      setProcessingMessage("");
    }
  };

  const handleFanSpeedChange = async (newPosition) => {
    const fanSpeedMap = ["0", "1", "2"]; // 0=High, 1=Medium, 2=Low
    const newSpeed = fanSpeedMap[newPosition];

    // If power is off, just update the local state
    if (sensorData.powerStatus === "off") {
      setSensorData((prev) => ({
        ...prev,
        fanSpeed: newSpeed,
      }));
      return;
    }

    // If power is on, make API call
    setProcessing(true);
    setProcessingMessage("Changing fan speed, please wait...");

    const payload = {
      Header: "0xAA",
      DI: sensorData.deviceId || "2411GM-0102",
      MD: parseInt(sensorData.mode) || 1,
      FS: parseInt(newSpeed),
      SRT: parseInt(sensorData.temperature) || 25,
      HVAC: 1, // Keep power on
      Footer: "0xZX",
    };

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

      if (!response.ok) throw new Error("Failed to change fan speed");

      // Update local state on success
      setSensorData((prev) => ({
        ...prev,
        fanSpeed: newSpeed,
      }));
    } catch (error) {
      console.error("Error changing fan speed:", error);
    } finally {
      setProcessing(false);
      setProcessingMessage("");
    }
  };

  const handleTempChange = (newTemp) => {
    setSensorData((prev) => ({
      ...prev,
      temperature: newTemp.toString(),
    }));
  };

  const handleBackClick = () => {
    navigate("/machinescreen1");
  };

  const modes = ["IDEC", "Auto", "Fan", "Indirect", "Direct"];
  const currentModeDescription = getModeDescription(sensorData.mode);
  const fanPosition = ["0", "1", "2"].indexOf(sensorData.fanSpeed);
  const positionToPercentage = (pos) => pos * 50;

  const handleFanClick = (e) => {
    const containerWidth = e.currentTarget.offsetWidth;
    const clickPosition = e.nativeEvent.offsetX;
    const segmentWidth = containerWidth / 3;
    const newPosition = Math.min(2, Math.floor(clickPosition / segmentWidth));
    handleFanSpeedChange(newPosition);
  };

  return (
    <div
      className="mainmain-container"
      style={{
        backgroundImage: "linear-gradient(to bottom, #3E99ED, #2B7ED6)",
      }}
    >
      <div className="main-container">
        {/* Header Section */}
        <div className="header">
          <button
            className="icon-button"
            onClick={handleBackClick}
          >
            <FiArrowLeft size={24} color="white" />
          </button>

          <img src={AIROlogo} alt="AIRO Logo" className="logo" />

          <div style={{ position: "relative" }}>
            <button
              className={`power-button ${processing ? "processing" : ""}`}
              onClick={handlePowerToggle}
              style={{
                backgroundColor: sensorData.powerStatus === "on" ? "#5adb5eff" : "#c80000f5",
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
              <FiPower size={24} color="white" />
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
          </div>
        </div>

        {processing && (
          <div className="processing-message">{processingMessage}</div>
        )}
        {sensorData.errorFlag === "1" && (
          <div
            className="error-message"
            style={{ color: "yellow", textAlign: "center", fontWeight: "bold" }}
          >
            ⚠️ System Error Detected
          </div>
        )}
        {sensorData.hvacBusy === "1" && !processing && (
          <div
            className="busy-message"
            style={{ color: "orange", textAlign: "center", fontWeight: "bold" }}
          >
            ⏳ System is currently busy
          </div>
        )}

        <TemperatureDial
          sensorData={sensorData}
          onTempChange={handleTempChange}
          fanSpeed={fanPosition}
          initialTemperature={sensorData.temperature}
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

        <div className="control-buttons-container">
          <div className="handle" />

          <div className="section">
            <h3 className="heading">Modes</h3>
            <div className="mode-row">
              {modes.map((mode, index) => (
                <button
                  key={index}
                  onClick={() => handleModeChange(mode)}
                  className={`mode-button ${
                    currentModeDescription === mode
                      ? "mode-button-selected"
                      : ""
                  } ${processing ? "disabled" : ""}`}
                >
                  <span
                    className={`mode-text ${
                      currentModeDescription === mode
                        ? "mode-text-selected"
                        : ""
                    }`}
                  >
                    {mode}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="section">
            <h3 className="heading">Fan Speed</h3>
            <div
              className="line-with-dot-container"
              onClick={handleFanClick}
              style={{ cursor: processing ? "not-allowed" : "pointer" }}
            >
              <div className="line" />
              <div className="vertical-marker" style={{ left: "0%" }} />
              <div className="vertical-marker" style={{ left: "50%" }} />
              <div className="vertical-marker" style={{ left: "100%" }} />
              <div
                className="dot"
                style={{
                  left: `${positionToPercentage(fanPosition)}%`,
                  cursor: processing ? "not-allowed" : "pointer",
                }}
              />
              <div className="fan-speed-labels">
                <span style={{ left: "0%" }}>High</span>
                <span style={{ left: "50%" }}>Medium</span>
                <span style={{ left: "100%" }}>Low</span>
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

export default Screen2;
// Screen2.js — Fix2 (offline blanking) + Fix3 (progressive processing messages)
import React, { useState, useEffect, useContext, useRef } from "react";
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

// ✅ FIX 3: Progressive messages shown every 10s
const PROCESSING_MESSAGES = [
  "Sending command...",
  "Almost done, please wait...",
  "Waiting for device response...",
];

// Helper functions
const getSelectedService = (location) => {
  try {
    if (location.state?.selectedService) return location.state.selectedService;
    const stored = localStorage.getItem("selectedService");
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

const Screen2 = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const { userId, company_id, sensorData } = location.state || {};

  const [isDraggingTemp, setIsDraggingTemp] = useState(false);

  const selectedService = getSelectedService(location);
  const deviceId =
    selectedService?.pcb_serial_number || sensorData?.deviceId || "2411GM-0102";

  // ✅ FIX 2: Read isOnline from passed sensorData
  const isOnline = sensorData?.isOnline !== false; // default true if not passed

  const [processing, setProcessing] = useState({ status: false, message: "" });

  // ✅ FIX 3: Refs for cycling processing messages
  const processingTimerRef = useRef(null);
  const processingMsgIndexRef = useRef(0);
  const hardStopTimerRef = useRef(null);

  const initialApiData = {
    // ✅ FIX 2: Null out sensor readings when offline
    outsideTemp: isOnline ? sensorData?.outsideTemp || "0" : null,
    humidity: isOnline ? sensorData?.humidity || "0" : null,
    roomTemp: isOnline ? sensorData?.roomTemp || "0" : null,
    fanSpeed: sensorData?.fanSpeed || "0",
    temperature: sensorData?.temperature || "25",
    powerStatus: isOnline ? sensorData?.powerStatus || "off" : "off",
    mode: sensorData?.mode || "3",
    errorFlag: isOnline ? sensorData?.errorFlag || "0" : "0",
    hvacBusy: isOnline ? sensorData?.hvacBusy || "0" : "0",
    deviceId: deviceId,
    alarmOccurred: sensorData?.alarmOccurred || "0",
  };

  const [apiData, setApiData] = useState(initialApiData);

  const [displayData, setDisplayData] = useState({
    fanSpeed: initialApiData.fanSpeed,
    temperature: initialApiData.temperature,
    mode: initialApiData.mode,
    powerStatus: initialApiData.powerStatus,
  });

  const [hasLocalChanges, setHasLocalChanges] = useState(false);

  // Derived values
  const currentModeDescription = MODE_MAP[displayData.mode] || "Fan";
  const fanPosition = FAN_SPEEDS.indexOf(displayData.fanSpeed);
  const fanPercentage = fanPosition * 50;

  // ✅ FIX 3: Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (processingTimerRef.current) clearInterval(processingTimerRef.current);
      if (hardStopTimerRef.current) clearTimeout(hardStopTimerRef.current);
    };
  }, []);

  // ✅ FIX 3: Start progressive message cycling
  const startProcessingCycle = () => {
    processingMsgIndexRef.current = 0;
    setProcessing({ status: true, message: PROCESSING_MESSAGES[0] });

    processingTimerRef.current = setInterval(() => {
      processingMsgIndexRef.current += 1;
      const nextMsg = PROCESSING_MESSAGES[processingMsgIndexRef.current];
      if (nextMsg) {
        setProcessing({ status: true, message: nextMsg });
      }
    }, 10000);

    // Hard stop at 25s
    hardStopTimerRef.current = setTimeout(() => {
      stopProcessing();
    }, 25000);
  };

  const stopProcessing = () => {
    if (processingTimerRef.current) {
      clearInterval(processingTimerRef.current);
      processingTimerRef.current = null;
    }
    if (hardStopTimerRef.current) {
      clearTimeout(hardStopTimerRef.current);
      hardStopTimerRef.current = null;
    }
    setProcessing({ status: false, message: "" });
  };

  // API call handler
  const sendCommand = async (updates = {}, commandType = "general") => {
    if (processing.status || apiData.hvacBusy === "1") {
      setProcessing({
        status: true,
        message:
          apiData.hvacBusy === "1"
            ? "System is busy, please wait..."
            : "Please wait...",
      });
      return false;
    }

    // ✅ FIX 3: Use cycling messages instead of single static message
    startProcessingCycle();

    const finalUpdates =
      updates.powerStatus === "on"
        ? {
            ...updates,
            mode: displayData.mode,
            fanSpeed: displayData.fanSpeed,
            temperature: displayData.temperature,
          }
        : updates;

    const payload = {
      Header: "0xAA",
      DI: deviceId,
      MD: parseInt(finalUpdates.mode || displayData.mode) || 1,
      FS: parseInt(finalUpdates.fanSpeed || displayData.fanSpeed) || 0,
      SRT: parseInt(finalUpdates.temperature || displayData.temperature) || 25,
      HVAC: finalUpdates.powerStatus === "off" ? "0" : "1",
      Footer: "0xZX",
    };

    console.log("Sending payload:", payload);

    try {
      const response = await fetch("https://mdata.air2o.net/controllers/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        stopProcessing();
        throw new Error("Failed to send command");
      }

      if (updates.powerStatus === "on") {
        setHasLocalChanges(false);
      }

      // ✅ FIX 3: Don't hard-stop here; let the 25s timeout handle it.
      // (Screen2 has no polling, so we can't detect hvac_busy=0 automatically)
      return true;
    } catch (error) {
      console.error("Error sending command:", error);
      stopProcessing();
      return false;
    }
  };

  // Event handlers
  const handlePowerToggle = async () => {
    // ✅ FIX 2: Block power toggle when offline
    if (!isOnline) return;
    const newPowerStatus = displayData.powerStatus === "on" ? "off" : "on";
    setDisplayData((prev) => ({ ...prev, powerStatus: newPowerStatus }));
    await sendCommand({ powerStatus: newPowerStatus }, "power");
  };

  const handleModeChange = async (newMode) => {
    const newModeCode = MODE_CODE_MAP[newMode] || 1;
    setDisplayData((prev) => ({ ...prev, mode: newModeCode.toString() }));

    if (displayData.powerStatus === "off") {
      setHasLocalChanges(true);
      return;
    }
    await sendCommand({ mode: newModeCode.toString() }, "mode");
  };

  const handleFanSpeedChange = async (newPosition) => {
    const newSpeed = FAN_SPEEDS[newPosition];
    setDisplayData((prev) => ({ ...prev, fanSpeed: newSpeed }));

    if (displayData.powerStatus === "off") {
      setHasLocalChanges(true);
      return;
    }
    await sendCommand({ fanSpeed: newSpeed }, "fan");
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
    setDisplayData((prev) => ({ ...prev, temperature: newTemp.toString() }));
    setIsDraggingTemp(true);
    if (displayData.powerStatus === "off") {
      setHasLocalChanges(true);
    }
  };

  const handleTempChangeEnd = async (newTemp) => {
    setIsDraggingTemp(false);
    if (displayData.powerStatus === "on") {
      await sendCommand({ temperature: newTemp.toString() }, "temperature");
    }
  };

  const handleBackClick = () => {
    if (!processing.status) {
      navigate("/machinescreen1");
    }
  };

  if (!selectedService || !sensorData) {
    return <div className="loading">No data available</div>;
  }

  return (
    <div
      className="mainmain-container"
      style={{ backgroundImage: "linear-gradient(to bottom, #3E99ED, #2B7ED6)" }}
    >
      <div className="main-container">
        {/* Header: Back + Logo + Power */}
        <div className="header">
          <button
            className="icon-button"
            onClick={handleBackClick}
            disabled={processing.status}
            style={{
              opacity: processing.status ? 0.6 : 1,
              cursor: processing.status ? "not-allowed" : "pointer",
            }}
          >
            <FiArrowLeft size={24} color="white" />
          </button>

          <img src={AIROlogo} alt="AIRO Logo" className="logo logonew" />

          <div className="power-button-container">
            <button
              className={`power-button ${displayData.powerStatus === "on" ? "on" : "off"} ${
                processing.status ? "processing" : ""
              }`}
              onClick={handlePowerToggle}
              // ✅ FIX 2: Disable power button when offline
              disabled={processing.status || !isOnline}
              style={{
                opacity: processing.status || !isOnline ? 0.6 : 1,
                cursor: processing.status || !isOnline ? "not-allowed" : "pointer",
                // ✅ FIX 2: Grey out when offline
                backgroundColor: !isOnline ? "#808080" : undefined,
              }}
            >
              <FiPower size={24} color="white" />
              {processing.status && <span className="processing-indicator"></span>}
            </button>

            {apiData.errorFlag === "1" && <div className="error-indicator" />}
          </div>
        </div>

        {/* ✅ FIX 2: Offline banner — between header and temperature dial */}
        {!isOnline && (
          <div
            style={{
              backgroundColor: "rgba(0,0,0,0.55)",
              color: "#fff",
              textAlign: "center",
              padding: "10px 20px",
              borderRadius: "10px",
              margin: "12px 20px 4px 20px",
              fontSize: "14px",
              fontWeight: "bold",
              letterSpacing: "0.5px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <span>📴</span>
            <span>System is Offline</span>
          </div>
        )}

        {/* Status Messages */}
        {processing.status && (
          <div className="processing-message">{processing.message}</div>
        )}

        {apiData.errorFlag === "1" && (
          <div className="error-message">⚠️ System Error Detected</div>
        )}

        {apiData.hvacBusy === "1" && !processing.status && (
          <div className="busy-message">⏳ System is currently busy</div>
        )}

        {/* Temperature Dial — dimmed when offline */}
        <div style={{ opacity: isOnline ? 1 : 0.35, pointerEvents: isOnline ? "auto" : "none" }}>
          <TemperatureDial
            onTempChange={handleTempChange}
            onTempChangeEnd={handleTempChangeEnd}
            fanSpeed={fanPosition}
            initialTemperature={displayData.temperature ?? 25}
            disabled={processing.status || !isOnline}
          />
        </div>

        {/* Environment Info */}
        <div className="env-info">
          <div className="env-item">
            <FiSun className="env-icon" size={20} color="#FFFFFF" />
            {/* ✅ FIX 2: Show "—" when offline */}
            <div className="env-value">
              {isOnline ? `${formatTemp(apiData.outsideTemp)}°C` : "—"}
            </div>
            <div className="env-label">Outside Temp</div>
          </div>
          <div className="env-item">
            <FiThermometer className="env-icon" size={20} color="#FFFFFF" />
            <div className="env-value">
              {isOnline ? `${formatTemp(apiData.roomTemp)}°C` : "—"}
            </div>
            <div className="env-label">Room Temp</div>
          </div>
          <div className="env-item">
            <FiDroplet className="env-icon" size={20} color="#FFFFFF" />
            <div className="env-value">
              {isOnline ? `${formatTemp(apiData.humidity)}%` : "—"}
            </div>
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
                  // ✅ FIX 2: Disable mode buttons when offline
                  disabled={processing.status || !isOnline}
                  style={{
                    opacity: processing.status || !isOnline ? 0.6 : 1,
                    cursor: processing.status || !isOnline ? "not-allowed" : "pointer",
                  }}
                >
                  <span
                    className={`mode-text ${
                      currentModeDescription === mode ? "mode-text-selected" : ""
                    }`}
                  >
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
              onClick={processing.status || !isOnline ? undefined : handleFanClick}
              style={{
                // ✅ FIX 2: Disable fan slider when offline
                cursor: processing.status || !isOnline ? "not-allowed" : "pointer",
                opacity: processing.status || !isOnline ? 0.6 : 1,
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
                  cursor: processing.status || !isOnline ? "not-allowed" : "pointer",
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

export default Screen2;
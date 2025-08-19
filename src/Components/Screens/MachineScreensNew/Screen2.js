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
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext/AuthContext";
import TemperatureDial from "./TemperatureDial_v1";

const Screen2 = () => {
  const { user } = useContext(AuthContext);
  const [sensorData, setSensorData] = useState({
    outsideTemp: 0,
    humidity: 0,
    roomTemp: 0,
    fanSpeed: "0", // Changed default to '0' (High)
    temperature: 25,
    powerStatus: "off",
    mode: "3",
    errorFlag: "0",
    hvacBusy: "0",
    deviceId: "",
    alarmOccurred: "0",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState("");
  const navigate = useNavigate();
  const [errorCount, setErrorCount] = useState(0);

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
        if (!response.ok) throw new Error("Network response was not ok");

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

        setErrorCount(deviceData.alarm_occurred?.value === "1" ? 1 : 0);

        if (deviceData.hvac_busy?.value === "1") {
          setProcessing(true);
          setProcessingMessage("Processing, please wait...");
        } else if (processing) {
          setTimeout(() => {
            setProcessing(false);
            setProcessingMessage("");
          }, 2000);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 50000);
    return () => clearInterval(intervalId);
  }, [processing]);

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
    const isTurningOn = sensorData.powerStatus === "off";

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

  const handleModeChange = (newMode) => {
    if (processing) return;

    const modeCodeMap = {
      IDEC: 1,
      Auto: 2,
      Fan: 3,
      Indirect: 4,
      Direct: 5,
    };

    const newModeCode = modeCodeMap[newMode] || 1;

    setSensorData((prev) => ({
      ...prev,
      mode: newModeCode.toString(),
    }));
  };

  const handleFanSpeedChange = (newPosition) => {
    if (processing) return;

    const fanSpeedMap = ["0", "1", "2"]; // 0=High, 1=Medium, 2=Low
    const newSpeed = fanSpeedMap[newPosition];

    setSensorData((prev) => ({
      ...prev,
      fanSpeed: newSpeed,
    }));
  };

  const handleTempChange = (newTemp) => {
    setSensorData((prev) => ({
      ...prev,
      temperature: newTemp.toString(),
    }));
  };

  const handleBackClick = () => {
    if (!processing) navigate("/machinescreen1");
  };

   if (loading) return <div className="loading">Loading...</div>;
  

  const modes = ["IDEC", "Auto", "Fan", "Indirect", "Direct"];
  const currentModeDescription = getModeDescription(sensorData.mode);
  const fanPosition = ["0", "1", "2"].indexOf(sensorData.fanSpeed);
  const positionToPercentage = (pos) => pos * 50;

  const handleFanClick = (e) => {
    if (processing) return;
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
            disabled={processing}
          >
            <FiArrowLeft size={24} color="white" />
          </button>

          <img src={AIROlogo} alt="AIRO Logo" className="logo" />
{/* 
          <div style={{ position: "relative" }}>
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
      backgroundColor: sensorData.powerStatus === "on" ? "green" : "#c80000f5",
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
                  disabled={processing}
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

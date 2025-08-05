import React, { useState, useEffect, useContext } from 'react';
import {
  FiArrowLeft, FiPower, FiSun, FiDroplet, FiThermometer
} from 'react-icons/fi';
import './Screen1.css';
import './Screen2.css';
import AIROlogo from './Images/AIRO.png';
import greenAire from './Images/greenAire.png';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../AuthContext/AuthContext";

const Screen2 = () => {
  const { user } = useContext(AuthContext);
  const [sensorData, setSensorData] = useState({
    outsideTemp: 0,
    humidity: 0,
    roomTemp: 0,
    fanSpeed: '3', // Default to shutdown/off
    temperature: 25,
    powerStatus: 'off',
    mode: '1', // Default to IDEC
    errorFlag: '0',
    hvacBusy: '0',
    deviceId: '',
    alarmOccurred: '0'
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');
  const navigate = useNavigate();
  const [errorCount, setErrorCount] = useState(0);

  // Mode mapping
  const modeMap = {
    '1': 'IDEC',
    '2': 'Auto',
    '3': 'Fan',
    '4': 'Indirect',
    '5': 'Direct'
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://46.37.122.105:83/live_events/get-latest-data/');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        if (data.status !== "success" || !data.data || data.data.length === 0) {
          throw new Error('Invalid data format from API');
        }
        
        const deviceData = data.data[0];
        
        setSensorData(prev => ({
          outsideTemp: deviceData.outdoor_temperature?.value || prev.outsideTemp,
          humidity: deviceData.room_humidity?.value || prev.humidity,
          roomTemp: deviceData.room_temperature?.value || prev.roomTemp,
          fanSpeed: deviceData.fan_speed?.value || prev.fanSpeed,
          temperature: deviceData.set_temperature?.value || prev.temperature,
          powerStatus: processing ? prev.powerStatus : (deviceData.hvac_on?.value === '1' ? 'on' : 'off'),
          mode: deviceData.mode?.value || prev.mode,
          errorFlag: deviceData.error_flag?.value || prev.errorFlag,
          hvacBusy: deviceData.hvac_busy?.value || prev.hvacBusy,
          deviceId: deviceData.device_id || prev.deviceId,
          alarmOccurred: deviceData.alarm_occurred?.value || prev.alarmOccurred
        }));
        
        // Update error count based only on alarm_occurred (not error_flag)
        setErrorCount(deviceData.alarm_occurred?.value === '1' ? 1 : 0);
        
        // Handle processing state
        if (deviceData.hvac_busy?.value === '1') {
          setProcessing(true);
          setProcessingMessage('Processing, please wait...');
        } else {
          if (processing) {
            setTimeout(() => {
              setProcessing(false);
              setProcessingMessage('');
            }, 2000);
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 1000);

    return () => clearInterval(intervalId);
  }, [processing]);

  const getFanSpeedDescription = (code) => {
    switch (code) {
      case '0': return 'High';
      case '1': return 'Medium';
      case '2': return 'Low';
      case '3': return 'Shutdown/off';
      default: return 'Shutdown/off';
    }
  };

  const getModeDescription = (code) => {
    return modeMap[code] || 'IDEC';
  };

  const formatTemp = (temp) => {
    if (typeof temp === 'string') {
      const num = parseFloat(temp);
      return isNaN(num) ? temp : num.toFixed(1);
    }
    return temp;
  };

  const handlePowerToggle = () => {
    if (processing) return;
    
    if (sensorData.hvacBusy === '1') {
      setProcessing(true);
      setProcessingMessage('System is busy, please wait...');
      return;
    }
    
    setProcessing(true);
    setProcessingMessage('Sending command, please wait...');
    
    setTimeout(() => {
      const newStatus = sensorData.powerStatus === 'on' ? 'off' : 'on';
      setSensorData(prev => ({ ...prev, powerStatus: newStatus }));
      setProcessing(false);
      setProcessingMessage('');
    }, 2000);
  };

  const handleModeChange = (newMode) => {
    if (processing) return;
    
    if (sensorData.hvacBusy === '1') {
      setProcessing(true);
      setProcessingMessage('System is busy, please wait...');
      return;
    }
    
    setProcessing(true);
    setProcessingMessage('Changing mode, please wait...');
    
    setTimeout(() => {
      // Find the mode code from the modeMap
      const modeCode = Object.keys(modeMap).find(key => modeMap[key] === newMode) || '1';
      setSensorData(prev => ({ ...prev, mode: modeCode }));
      setProcessing(false);
      setProcessingMessage('');
    }, 2000);
  };

  const handleFanSpeedChange = (newPosition) => {
    if (processing) return;
    
    if (sensorData.hvacBusy === '1') {
      setProcessing(true);
      setProcessingMessage('System is busy, please wait...');
      return;
    }
    
    setProcessing(true);
    setProcessingMessage('Changing fan speed, please wait...');
    
    setTimeout(() => {
      const fanSpeedMap = ['0', '1', '2', '3']; // High, Medium, Low, Off
      const newSpeed = fanSpeedMap[newPosition] || '3';
      setSensorData(prev => ({ ...prev, fanSpeed: newSpeed }));
      setProcessing(false);
      setProcessingMessage('');
    }, 2000);
  };

  const handleBackClick = () => {
    if (!processing) {
      navigate('/machinescreen1');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  const modes = ['IDEC', 'Auto', 'Fan', 'Indirect', 'Direct'];
  const currentModeDescription = getModeDescription(sensorData.mode);
  
  // Convert fan speed code to position (0-3)
  const fanPosition = ['0', '1', '2', '3'].indexOf(sensorData.fanSpeed);
  
  // Convert position (0-3) to percentage for CSS (0%, 33.33%, 66.66%, 100%)
  const positionToPercentage = (pos) => {
    return pos * (100 / 3);
  };

  return (
    <div className='mainmain-container' style={{ backgroundImage: 'linear-gradient(to bottom, #3E99ED, #2B7ED6)' }}>
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

          <img
            src={AIROlogo}
            alt="AIRO Logo"
            className="logo"
          />

          <div style={{ position: 'relative' }}>
            <button 
              className={`power-button ${sensorData.powerStatus === 'on' ? 'power-on' : 'power-off'} ${processing ? 'processing' : ''}`}
              onClick={handlePowerToggle}
              disabled={processing}
            >
              <FiPower size={24} color={sensorData.powerStatus === 'on' ? "#4CAF50" : "#F44336"} />
              {processing && <span className="processing-indicator"></span>}
            </button>
            {sensorData.errorFlag === '1' && (
              <div style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                backgroundColor: 'red',
                borderRadius: '50%',
                width: '12px',
                height: '12px',
                border: '2px solid white'
              }} />
            )}
          </div>
        </div>

        {processing && (
          <div className="processing-message">
            {processingMessage}
          </div>
        )}

        {sensorData.errorFlag === '1' && (
          <div className="error-message" style={{
            color: 'yellow',
            textAlign: 'center',
            fontWeight: 'bold'
          }}>
            ⚠️ System Error Detected
          </div>
        )}

        {sensorData.hvacBusy === '1' && !processing && (
          <div className="busy-message" style={{
            color: 'orange',
            textAlign: 'center',
            fontWeight: 'bold',
          }}>
            ⏳ System is currently busy
          </div>
        )}

        {/* Temperature Control */}
        <div className="temp-container">
          <div className="temp-circle-control">
            <div className="temp-inner-circle">
         <svg className="temp-curve-arc" width="285" height="285" viewBox="0 0 285 285">
  <path
    d="M 142.5 32 A 110 110 0 0 1 252 142.5"
    fill="none"
    stroke="#ffffff"
    strokeOpacity="0.7"
    strokeWidth="6"
  />
</svg>
              <div className="temp-temperature">{formatTemp(sensorData.temperature)}°C</div>
              <div className="temp-fan-container">
                <div className="temp-fan-icon-container">
                  <div className="temp-fan-bar1"></div>
                  <div className="temp-fan-bar2"></div>
                  <div className="temp-fan-bar3"></div>
                </div>
                <span className="temp-fan-speed">{getFanSpeedDescription(sensorData.fanSpeed)}</span>
              </div>
              <div className="temp-fan-label">Fan Speed</div>
            </div>
            <div className="temp-control-handle"></div>

            {[...Array(48)].map((_, i) => (
              <div
                key={i}
                className="temp-tick"
                style={{
                  transform: `rotate(${i * 7.5}deg) translateY(-135px)`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Environment Info */}
        <div className="env-info">
          <div className="env-item">
            <FiSun className="env-icon" size={20} color="#FFFFFF" />
            <div className="env-value">{formatTemp(sensorData.outsideTemp)}°C</div>
            <div className="env-label">Outside Temp</div>
          </div>
          <div className="env-item">
            <FiDroplet className="env-icon" size={20} color="#FFFFFF" />
            <div className="env-value">{sensorData.humidity}%</div>
            <div className="env-label">Humidity</div>
          </div>
          <div className="env-item">
            <FiThermometer className="env-icon" size={20} color="#FFFFFF" />
            <div className="env-value">{formatTemp(sensorData.roomTemp)}°C</div>
            <div className="env-label">Room Temp</div>
          </div>
        </div>

        {/* Control Buttons Section */}
        <div className="control-buttons-container">
          <div className="handle" />

          <div className="section">
            <h3 className="heading">Modes</h3>
            <div className="mode-row">
              {modes.map((mode, index) => (
                <button
                  key={index}
                  onClick={() => handleModeChange(mode)}
                  className={`mode-button ${currentModeDescription === mode ? 'mode-button-selected' : ''} ${processing ? 'disabled' : ''}`}
                  disabled={processing}
                >
                  <span className={`mode-text ${currentModeDescription === mode ? 'mode-text-selected' : ''}`}>
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
              onClick={(e) => {
                if (processing) return;
                const containerWidth = e.currentTarget.offsetWidth;
                const clickPosition = e.nativeEvent.offsetX;
                const segmentWidth = containerWidth / 4;
                const newPosition = Math.min(3, Math.floor(clickPosition / segmentWidth));
                handleFanSpeedChange(newPosition);
              }}
              style={{ cursor: processing ? 'not-allowed' : 'pointer' }}
            >
              <div className="line" />
              <div
                className="dot"
                style={{ 
                  left: `${positionToPercentage(fanPosition)}%`,
                  cursor: processing ? 'not-allowed' : 'pointer'
                }}
              />
              <div className="fan-speed-labels">
                <span style={{ left: '0%' }}>High</span>
                <span style={{ left: '33.33%' }}>Medium</span>
                <span style={{ left: '66.66%' }}>Low</span>
                <span style={{ left: '90%' }}>Off</span>
              </div>
            </div>
          </div>

          <div className="logo-container">
            <img
              src={greenAire}
              alt="GreenAire Logo"
              className="logo-image"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Screen2;
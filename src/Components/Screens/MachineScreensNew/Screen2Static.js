import React, { useState } from 'react';
import { 
  FiArrowLeft, 
  FiPower, 
  FiSun, 
  FiDroplet, 
  FiThermometer 
} from 'react-icons/fi';
import './Screen1.css';
import './Screen2.css';
import AIROlogo from './Images/AIRO.png'
import greenAire from './Images/greenAire.png'

const Screen2 = () => {
  // State for ControlButtons2 functionality
  const [selectedMode, setSelectedMode] = useState('High');
  const [fanPosition, setFanPosition] = useState(50);

  const handleFanMove = (e) => {
    const containerWidth = e.currentTarget.offsetWidth;
    const clickPosition = e.nativeEvent.offsetX;
    const percentage = Math.min(100, Math.max(0, (clickPosition / containerWidth) * 100));
    setFanPosition(percentage);
  };

  const modes = ['High', 'Medium', 'Low'];

  return (
    <div className='mainmain-container' style={{ backgroundImage: 'linear-gradient(to bottom, #3E99ED, #2B7ED6)' }}>
      <div className="main-container">
        {/* Header Section */}
                                      <div className="header">
    <div className="logo">
        <img src={AIROlogo} alt="AIRO Logo" className="logo-image" />
    </div>
    <button className="power-button">
        <FiPower size={24} color="#4CAF50" />
    </button>
</div>

        {/* Temperature Control */}
        <div className="temp-container">
          <div className="temp-circle-control">
            <div className="temp-inner-circle">
              <div className="temp-temperature">25°C</div>
              <div className="temp-fan-container">
                <div className="temp-fan-icon-container">
                  <div className="temp-fan-line1"></div>
                  <div className="temp-fan-line2"></div>
                  <div className="temp-fan-line3"></div>
                </div>
                <span className="temp-fan-speed">Medium</span>
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
            <div className="env-value">42°C</div>
            <div className="env-label">Outside Temp</div>
          </div>
          <div className="env-item">
            <FiDroplet className="env-icon" size={20} color="#FFFFFF" />
            <div className="env-value">14%</div>
            <div className="env-label">Humidity</div>
          </div>
          <div className="env-item">
            <FiThermometer className="env-icon" size={20} color="#FFFFFF" />
            <div className="env-value">28°C</div>
            <div className="env-label">Room Temp</div>
          </div>
        </div>

        {/* Integrated ControlButtons2 Section */}
        <div className="control-buttons-container">
          <div className="handle" />

          <div className="section">
            <h3 className="heading">Modes</h3>
            <div className="mode-row">
              {modes.map((mode, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedMode(mode)}
                  className={`mode-button ${selectedMode === mode ? 'mode-button-selected' : ''}`}
                >
                  <span className={`mode-text ${selectedMode === mode ? 'mode-text-selected' : ''}`}>
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
              onClick={handleFanMove}
            >
              <div className="line" />
              <div 
                className="dot" 
                style={{ left: `${fanPosition}%` }}
              />
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
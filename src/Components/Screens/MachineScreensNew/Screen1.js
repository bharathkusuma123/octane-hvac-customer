// import React from 'react';
// import {
//         FiArrowLeft, FiPower, FiWind, FiClock, FiWatch, FiSettings, FiZap, FiLogOut, FiSun,
//         FiDroplet,
//         FiThermometer
// } from 'react-icons/fi';
// import './Screen1.css';
// import AIROlogo from './Images/AIRO.png'
// import greenAire from './Images/greenAire.png'

// const Screen1 = () => {
//         return (
//                 <div className='mainmain-container' style={{ backgroundImage: 'linear-gradient(to bottom, #3E99ED, #2B7ED6)' }}>

//                         <div className="main-container">
//                                 {/* Header Section */}
//                                 {/* <div className="header">
//                                         <button className="icon-button">
//                                                 <FiArrowLeft size={24} color="white" />
//                                         </button>
//                                         <div className="logo">AIRO</div>
//                                         <button className="power-button">
//                                                 <FiPower size={24} color="#4CAF50" />
//                                         </button>
//                                 </div> */}
//                                 <div className="header">
//     <div className="logo">
//         <img src={AIROlogo} alt="AIRO Logo" className="logo-image" />
//     </div>
//     <button className="power-button">
//         <FiPower size={24} color="#4CAF50" />
//     </button>
// </div>

//                                 {/* Temperature Control */}
//                                 <div className="temp-container">
//                                         <div className="temp-circle-control">
//                                                 <div className="temp-inner-circle">
//                                                         <div className="temp-temperature">25°C</div>
//                                                         <div className="temp-fan-container">
//                                                                 <div className="temp-fan-icon-container">
//                                                                         <div className="temp-fan-line1"></div>
//                                                                         <div className="temp-fan-line2"></div>
//                                                                         <div className="temp-fan-line3"></div>
//                                                                 </div>
//                                                                 <span className="temp-fan-speed">Medium</span>
//                                                         </div>
//                                                         <div className="temp-fan-label">Fan Speed</div>
//                                                 </div>
//                                                 <div className="temp-control-handle"></div>

//                                                 {[...Array(48)].map((_, i) => (
//                                                         <div
//                                                                 key={i}
//                                                                 className="temp-tick"
//                                                                 style={{
//                                                                         transform: `rotate(${i * 7.5}deg) translateY(-135px)`,
//                                                                 }}
//                                                         />
//                                                 ))}
//                                         </div>
//                                 </div>

//                                 {/* Environment Info with Icons */}
//                                 <div className="env-info">
//                                         <div className="env-item">
//                                                 <FiSun className="env-icon" size={20} color="#FFFFFF" />
//                                                 <div className="env-value">42°C</div>
//                                                 <div className="env-label">Outside Temp</div>
//                                         </div>
//                                         <div className="env-item">
//                                                 <FiDroplet className="env-icon" size={20} color="#FFFFFF" />
//                                                 <div className="env-value">14%</div>
//                                                 <div className="env-label">Humidity</div>
//                                         </div>
//                                         <div className="env-item">
//                                                 <FiThermometer className="env-icon" size={20} color="#FFFFFF" />
//                                                 <div className="env-value">28°C</div>
//                                                 <div className="env-label">Room Temp</div>
//                                         </div>
//                                 </div>
//                                 {/* Control Buttons */}


//                                 {/* Footer Logo */}
//                         </div>
//                         <div className='footer-container'>
//                                 <div className="control-buttons">
//                                         <button className="control-btn">
//                                                 <FiWind size={20} />
//                                                 <span>Modes</span>
//                                         </button>
//                                         <button className="control-btn">
//                                                 <FiClock size={20} />
//                                                 <span>Alarms</span>
//                                         </button>
//                                         <button className="control-btn">
//                                                 <FiWatch size={20} />
//                                                 <span>Timers</span>
//                                         </button>
//                                         <button className="control-btn">
//                                                 <FiSettings size={20} />
//                                                 <span>Settings</span>
//                                         </button>
//                                         <button className="control-btn">
//                                                 <FiZap size={20} />
//                                                 <span>Services</span>
//                                         </button>
//                                         <button className="control-btn">
//                                                 <FiLogOut size={20} />
//                                                 <span>Logout</span>
//                                         </button>

//                                 </div>
//                                 <div className="footer-logo">
//                                         <img
//                                                 src={greenAire}
//                                                 alt="GreenAire Logo"
//                                                 className="logo-image"
//                                         />
//                                 </div>      </div>
//                 </div>
//         );
// };

// export default Screen1;




import React, { useState, useEffect } from 'react';
import {
  FiArrowLeft, FiPower, FiWind, FiClock, FiWatch, FiSettings, FiZap, FiLogOut, FiSun,
  FiDroplet,
  FiThermometer
} from 'react-icons/fi';
import './Screen1.css';
import AIROlogo from './Images/AIRO.png';
import greenAire from './Images/greenAire.png';
import { useNavigate } from 'react-router-dom';
const Screen1 = () => {
  const [sensorData, setSensorData] = useState({
    outsideTemp: 0,
    humidity: 0,
    roomTemp: 0,
    fanSpeed: 'Medium',
    temperature: 25
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://rahul21.pythonanywhere.com/events/');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        // Get the latest payload (last item in the array)
        const latestPayload = data[data.length - 1].payload;
        
        // Parse the payload string to extract values
        const parsePayload = (payload) => {
          const parts = payload.split(',');
          const result = {};
          
          parts.forEach(part => {
            const [key, value] = part.split(':');
            if (key && value) {
              result[key.trim()] = value.trim();
            }
          });
          
          return result;
        };
        
        const parsedData = parsePayload(latestPayload);
        
        // Map parsed data to our state
        setSensorData({
          outsideTemp: parsedData['ODT'] || sensorData.outsideTemp,
          humidity: parsedData['RH'] || sensorData.humidity,
          roomTemp: parsedData['RT'] || sensorData.roomTemp,
          fanSpeed: getFanSpeedDescription(parsedData['FS']),
          temperature: parsedData['SRT'] || sensorData.temperature
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    // Fetch data immediately and then every second
    fetchData();
    const intervalId = setInterval(fetchData, 1000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Helper function to convert fan speed code to description
  const getFanSpeedDescription = (code) => {
    switch (code) {
      case 'O': return 'Off';
      case 'L': return 'Low';
      case 'M': return 'Medium';
      case 'H': return 'High';
      default: return 'Medium';
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }


   const handleNavigation = (path) => {
    navigate(path);
  };
  return (
    <div className='mainmain-container' style={{ backgroundImage: 'linear-gradient(to bottom, #3E99ED, #2B7ED6)' }}>
      <div className="main-container">
        {/* Header Section */}
        <div className="header1">
          <div className="logo">
            <img src={AIROlogo} alt="AIRO Logo" className="logo-image"  style={{marginBottom:'-68px'}}/>
          </div>
          <button className="power-button">
            <FiPower size={24} color="#4CAF50" />
          </button>
        </div>

        {/* Temperature Control */}
        <div className="temp-container">
          <div className="temp-circle-control">
            <div className="temp-inner-circle">
              <div className="temp-temperature">{sensorData.temperature}°C</div>
              <div className="temp-fan-container">
                <div className="temp-fan-icon-container">
                  <div className="temp-fan-line1"></div>
                  <div className="temp-fan-line2"></div>
                  <div className="temp-fan-line3"></div>
                </div>
                <span className="temp-fan-speed">{sensorData.fanSpeed}</span>
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

        {/* Environment Info with Icons */}
        <div className="env-info">
          <div className="env-item">
            <FiSun className="env-icon" size={20} color="#FFFFFF" />
            <div className="env-value">{sensorData.outsideTemp}°C</div>
            <div className="env-label">Outside Temp</div>
          </div>
          <div className="env-item">
            <FiDroplet className="env-icon" size={20} color="#FFFFFF" />
            <div className="env-value">{sensorData.humidity}%</div>
            <div className="env-label">Humidity</div>
          </div>
          <div className="env-item">
            <FiThermometer className="env-icon" size={20} color="#FFFFFF" />
            <div className="env-value">{sensorData.roomTemp}°C</div>
            <div className="env-label">Room Temp</div>
          </div>
        </div>
      </div>
      
      <div className='footer-container'>
        <div className="control-buttons">
          <button className="control-btn" onClick={() => handleNavigation('/machinescreen2')}>
            <FiWind size={20} />
            <span>Modes</span>
          </button>
          <button className="control-btn"  onClick={() => handleNavigation('/modes')}>
            <FiClock size={20} />
            <span>Alarms</span>
          </button>
          <button className="control-btn"  onClick={() => handleNavigation('/modes')}>
            <FiWatch size={20} />
            <span>Timers</span>
          </button>
          <button className="control-btn"  onClick={() => handleNavigation('/modes')}>
            <FiSettings size={20} />
            <span>Settings</span>
          </button>
          <button className="control-btn"  onClick={() => handleNavigation('/machine')}>
            <FiZap size={20} />
            <span>Services</span>
          </button>
          <button className="control-btn"  onClick={() => handleNavigation('/')}>
            <FiLogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
        <div className="footer-logo">
          <img
            src={greenAire}
            alt="GreenAire Logo"
            className="logo-image"
          />
        </div>
      </div>
    </div>
  );
};

export default Screen1;
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


//==========================================================================================

// import React, { useState, useEffect } from 'react';
// import {
//   FiArrowLeft, FiPower, FiWind, FiClock, FiWatch, FiSettings, FiZap, FiLogOut, FiSun,
//   FiDroplet,
//   FiThermometer
// } from 'react-icons/fi';
// import './Screen1.css';
// import AIROlogo from './Images/AIRO.png';
// import greenAire from './Images/greenAire.png';
// import { useNavigate } from 'react-router-dom';
// const Screen1 = () => {
//   const [sensorData, setSensorData] = useState({
//     outsideTemp: 0,
//     humidity: 0,
//     roomTemp: 0,
//     fanSpeed: 'Medium',
//     temperature: 25
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch('https://rahul21.pythonanywhere.com/events/');
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         const data = await response.json();
        
//         // Get the latest payload (last item in the array)
//         const latestPayload = data[data.length - 1].payload;
        
//         // Parse the payload string to extract values
//         const parsePayload = (payload) => {
//           const parts = payload.split(',');
//           const result = {};
          
//           parts.forEach(part => {
//             const [key, value] = part.split(':');
//             if (key && value) {
//               result[key.trim()] = value.trim();
//             }
//           });
          
//           return result;
//         };
        
//         const parsedData = parsePayload(latestPayload);
        
//         // Map parsed data to our state
//         setSensorData({
//           outsideTemp: parsedData['ODT'] || sensorData.outsideTemp,
//           humidity: parsedData['RH'] || sensorData.humidity,
//           roomTemp: parsedData['RT'] || sensorData.roomTemp,
//           fanSpeed: getFanSpeedDescription(parsedData['FS']),
//           temperature: parsedData['SRT'] || sensorData.temperature
//         });
        
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         setError(error.message);
//         setLoading(false);
//       }
//     };

//     // Fetch data immediately and then every second
//     fetchData();
//     const intervalId = setInterval(fetchData, 1000);

//     // Clean up interval on component unmount
//     return () => clearInterval(intervalId);
//   }, []);

//   // Helper function to convert fan speed code to description
//   const getFanSpeedDescription = (code) => {
//     switch (code) {
//       case 'O': return 'Off';
//       case 'L': return 'Low';
//       case 'M': return 'Medium';
//       case 'H': return 'High';
//       default: return 'Medium';
//     }
//   };

//   if (loading) {
//     return <div className="loading">Loading...</div>;
//   }

//   if (error) {
//     return <div className="error">Error: {error}</div>;
//   }


//    const handleNavigation = (path) => {
//     navigate(path);
//   };
//   return (
//     <div className='mainmain-container' style={{ backgroundImage: 'linear-gradient(to bottom, #3E99ED, #2B7ED6)' }}>
//       <div className="main-container">
//         {/* Header Section */}
//         <div className="header1">
//           <div className="logo">
//             <img src={AIROlogo} alt="AIRO Logo" className="logo-image"  style={{marginBottom:'-68px'}}/>
//           </div>
//           <button className="power-button">
//             <FiPower size={24} color="#4CAF50" />
//           </button>
//         </div>

//         {/* Temperature Control */}
//         <div className="temp-container">
//           <div className="temp-circle-control">
//             <div className="temp-inner-circle">
//               <div className="temp-temperature">{sensorData.temperature}°C</div>
//               <div className="temp-fan-container">
//                 <div className="temp-fan-icon-container">
//                   <div className="temp-fan-line1"></div>
//                   <div className="temp-fan-line2"></div>
//                   <div className="temp-fan-line3"></div>
//                 </div>
//                 <span className="temp-fan-speed">{sensorData.fanSpeed}</span>
//               </div>
//               <div className="temp-fan-label">Fan Speed</div>
//             </div>
//             <div className="temp-control-handle"></div>

//             {[...Array(48)].map((_, i) => (
//               <div
//                 key={i}
//                 className="temp-tick"
//                 style={{
//                   transform: `rotate(${i * 7.5}deg) translateY(-135px)`,
//                 }}
//               />
//             ))}
//           </div>
//         </div>

//         {/* Environment Info with Icons */}
//         <div className="env-info">
//           <div className="env-item">
//             <FiSun className="env-icon" size={20} color="#FFFFFF" />
//             <div className="env-value">{sensorData.outsideTemp}°C</div>
//             <div className="env-label">Outside Temp</div>
//           </div>
//           <div className="env-item">
//             <FiDroplet className="env-icon" size={20} color="#FFFFFF" />
//             <div className="env-value">{sensorData.humidity}%</div>
//             <div className="env-label">Humidity</div>
//           </div>
//           <div className="env-item">
//             <FiThermometer className="env-icon" size={20} color="#FFFFFF" />
//             <div className="env-value">{sensorData.roomTemp}°C</div>
//             <div className="env-label">Room Temp</div>
//           </div>
//         </div>
//       </div>
      
//       <div className='footer-container'>
//         <div className="control-buttons">
//           <button className="control-btn" onClick={() => handleNavigation('/machinescreen2')}>
//             <FiWind size={20} />
//             <span>Modes</span>
//           </button>
//           <button className="control-btn"  onClick={() => handleNavigation('/modes')}>
//             <FiClock size={20} />
//             <span>Alarms</span>
//           </button>
//           <button className="control-btn"  onClick={() => handleNavigation('/modes')}>
//             <FiWatch size={20} />
//             <span>Timers</span>
//           </button>
//           <button className="control-btn"  onClick={() => handleNavigation('/modes')}>
//             <FiSettings size={20} />
//             <span>Settings</span>
//           </button>
//           <button className="control-btn"  onClick={() => handleNavigation('/machine')}>
//             <FiZap size={20} />
//             <span>Services</span>
//           </button>
//           <button className="control-btn"  onClick={() => handleNavigation('/')}>
//             <FiLogOut size={20} />
//             <span>Logout</span>
//           </button>
//         </div>
//         <div className="footer-logo">
//           <img
//             src={greenAire}
//             alt="GreenAire Logo"
//             className="logo-image"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Screen1;








import React, { useState, useEffect } from 'react';
import {
  FiArrowLeft, FiPower, FiWind, FiClock, FiWatch, FiSettings, FiZap, FiLogOut, FiSun,
  FiDroplet,
  FiThermometer,   FiNavigation,  FiLayers,    FiRefreshCw,   FiCornerUpRight       
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
    temperature: 25,
    powerStatus: 'off'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [showAlarmModal, setShowAlarmModal] = useState(false);
const [errorCount, setErrorCount] = useState(3); // You can set this dynamically based on actual errors
const [selectedMode, setSelectedMode] = useState(localStorage.getItem('selectedMode') || 'IDEC');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://rahul21.pythonanywhere.com/events/');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        const latestPayload = data[data.length - 1].payload;
        
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
        
        setSensorData({
          outsideTemp: parsedData['ODT'] || sensorData.outsideTemp,
          humidity: parsedData['RH'] || sensorData.humidity,
          roomTemp: parsedData['RT'] || sensorData.roomTemp,
          fanSpeed: getFanSpeedDescription(parsedData['FS']),
          temperature: parsedData['SRT'] || sensorData.temperature,
          powerStatus: parsedData['PS'] === '1' ? 'on' : 'off'
        });
        
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
  }, []);

  const getFanSpeedDescription = (code) => {
    switch (code) {
      case 'O': return 'Off';
      case 'L': return 'Low';
      case 'M': return 'Medium';
      case 'H': return 'High';
      default: return 'Medium';
    }
  };

  // Format 3-digit temperature string to decimal format (e.g., "253" → "25.3")
  const formatThreeDigitTemp = (temp) => {
    if (typeof temp === 'string' && temp.length === 3) {
      return `${temp.substring(0, 2)}.${temp.substring(2)}`;
    }
    return temp; // Return as-is if not a 3-digit string
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

  const modeIcons = {
  "Direct": FiNavigation,
  "IDEC": FiLayers,
  "Auto": FiRefreshCw,
  "Fan": FiWind,
  "Indirect": FiCornerUpRight
};

  return (
    <div className='mainmain-container' style={{ backgroundImage: 'linear-gradient(to bottom, #3E99ED, #2B7ED6)' }}>
      <div className="main-container">
        <div className="header1">
          <div className="logo">
            <img src={AIROlogo} alt="AIRO Logo" className="logo-image" style={{marginBottom: '-68px'}} />
          </div>
          <button 
            className={`power-button ${sensorData.powerStatus === 'on' ? 'power-on' : 'power-off'}`}
          >
            <FiPower size={24} color={sensorData.powerStatus === 'on' ? "#4CAF50" : "#F44336"} />
          </button>
        </div>

        <div className="temp-container">
          <div className="temp-circle-control">
            <div className="temp-inner-circle">
              <div className="temp-temperature">{formatThreeDigitTemp(sensorData.temperature)}°C</div>
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

        <div className="env-info">
          <div className="env-item">
            <FiSun className="env-icon" size={20} color="#FFFFFF" />
            <div className="env-value">{formatThreeDigitTemp(sensorData.outsideTemp)}°C</div>
            <div className="env-label">Outside Temp</div>
          </div>
          <div className="env-item">
            <FiDroplet className="env-icon" size={20} color="#FFFFFF" />
            <div className="env-value">{sensorData.humidity}%</div>
            <div className="env-label">Humidity</div>
          </div>
          <div className="env-item">
            <FiThermometer className="env-icon" size={20} color="#FFFFFF" />
            <div className="env-value">{formatThreeDigitTemp(sensorData.roomTemp)}°C</div>
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
          <button className="control-btn" onClick={() => setShowAlarmModal(true)}>
            <div style={{ position: 'relative' }}>
              <FiClock size={20} />
              {errorCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-23px',
                  backgroundColor: 'red',
                  color: 'white',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: 'bold'
                }}>
                  {errorCount}
                </span>
              )}
            </div>
            <span>Alarms</span>
          </button>
          <button className="control-btn" onClick={() => handleNavigation('/modes')}>
            <FiWatch size={20} />
            <span>Timers</span>
          </button>
          <button className="control-btn" onClick={() => handleNavigation('/modes')}>
            <FiSettings size={20} />
            <span>Settings</span>
          </button>
          <button className="control-btn" onClick={() => handleNavigation('/machine')}>
            <FiZap size={20} />
            <span>Services</span>
          </button>
          <button className="control-btn" onClick={() => handleNavigation('/')}>
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
       {/* Alarm Modal */}
      {showAlarmModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setShowAlarmModal(false)}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '10px',
            width: '80%',
            maxWidth: '400px'
          }} onClick={e => e.stopPropagation()}>
            <h3 style={{ marginTop: 0, color: '#333' }}>Alarm Notifications ({errorCount})</h3>
            <div style={{ margin: '15px 0' }}>
              <div style={{ 
                padding: '10px', 
                backgroundColor: '#ffeeee', 
                borderRadius: '5px', 
                marginBottom: '10px',
                borderLeft: '4px solid red'
              }}>
                <strong>High Temperature Alert</strong>
                <p style={{ margin: '5px 0 0 0' }}>Room temperature exceeded safe limits</p>
              </div>
              <div style={{ 
                padding: '10px', 
                backgroundColor: '#ffeeee', 
                borderRadius: '5px',
                borderLeft: '4px solid red'
              }}>
                <strong>Fan Malfunction</strong>
                <p style={{ margin: '5px 0 0 0' }}>Fan speed inconsistent with settings</p>
              </div>
              {errorCount > 2 && (
                <div style={{ 
                  padding: '10px', 
                  backgroundColor: '#ffeeee', 
                  borderRadius: '5px',
                  borderLeft: '4px solid red',
                  marginTop: '10px'
                }}>
                  <strong>Filter Replacement Needed</strong>
                  <p style={{ margin: '5px 0 0 0' }}>Air filter has reached maximum usage</p>
                </div>
              )}
            </div>
            <button 
              onClick={() => setShowAlarmModal(false)}
              style={{
                backgroundColor: '#2B7ED6',
                color: 'white',
                border: 'none',
                padding: '8px 15px',
                borderRadius: '5px',
                cursor: 'pointer',
                float: 'right'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Screen1;
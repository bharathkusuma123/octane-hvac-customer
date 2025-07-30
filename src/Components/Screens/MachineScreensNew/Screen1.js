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








import React, { useState, useEffect, useContext } from 'react';
import {
  FiArrowLeft, FiPower, FiWind, FiClock, FiWatch, FiSettings, FiZap, FiLogOut, FiSun,
  FiDroplet, FiThermometer, FiNavigation, FiLayers, FiRefreshCw, FiCornerUpRight, FiChevronDown     
} from 'react-icons/fi';
import { FaFan } from "react-icons/fa";
import './Screen1.css';
import AIROlogo from './Images/AIRO.png';
import greenAire from './Images/greenAire.png';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../AuthContext/AuthContext";

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
    fanSpeed: '3', // Default to shutdown/off
    temperature: 25,
    powerStatus: 'off',
    mode: '1', // Default to IDEC
    errorFlag: '0',
    hvacBusy: '0',
    deviceId: '',
    alarmOccurred: '0' // Add alarm occurred flag
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');
  const navigate = useNavigate();
  const [showAlarmModal, setShowAlarmModal] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [localPowerStatus, setLocalPowerStatus] = useState('off');

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

     const fetchServiceItems = async () => {
      try {
        const response = await fetch(`http://175.29.21.7:8006/service-items/?user_id=${userId}&company_id=${company_id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch service items');
        }
        const data = await response.json();
        setServiceItems(data.data || []);
        if (data.data && data.data.length > 0) {
          setSelectedService(data.data[0]);
        }
      } catch (error) {
        console.error('Error fetching service items:', error);
      }
    };

    fetchData();
    fetchServiceItems();
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
  
  // Check if HVAC is busy
  if (sensorData.hvacBusy === '1') {
    setProcessing(true);
    setProcessingMessage('System is busy, please wait...');
    return;
  }
  
  // For demo purposes - simulate the command
  setProcessing(true);
  setProcessingMessage('Sending command, please wait...');
  
  setTimeout(() => {
    const newStatus = sensorData.powerStatus === 'on' ? 'off' : 'on';
    setSensorData(prev => ({ ...prev, powerStatus: newStatus }));
    setProcessing(false);
    setProcessingMessage('');
  }, 2000);
};

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  const handleNavigation = (path) => {
    if (!processing) {
      navigate(path);
    }
  };

   return (
    <div className='mainmain-container' style={{ backgroundImage: 'linear-gradient(to bottom, #3E99ED, #2B7ED6)' }}>
      <div className="main-container">
        {/* Service Dropdown - Moved above the header */}
      <div className="service-dropdown-container">
        <div 
          className="service-dropdown-header"
          onClick={() => setShowServiceDropdown(!showServiceDropdown)}
        >
          <span>{selectedService ? selectedService.service_item_name : 'Select Service'}</span>
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
            <img src={AIROlogo} alt="AIRO Logo" className="logo-image" style={{marginBottom: '-68px'}} />
          </div>
          <div style={{ position: 'relative' }}>
            <button 
              className={`power-button ${sensorData.powerStatus === 'on' ? 'power-on' : 'power-off'} ${processing ? 'processing' : ''}`}
              onClick={handlePowerToggle}
              disabled={processing}
            >
              <FiPower size={24} color={sensorData.powerStatus === 'on' ? "#4CAF50" : "#F44336"} />
              {processing && <span className="processing-indicator"></span>}
            </button>
            {/* Show error indicator on power button if errorFlag is 1 */}
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

        {/* Show error message if errorFlag is 1 */}
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

        {/* <div className="mode-indicator">
          Current Mode: {getModeDescription(sensorData.mode)}
        </div> */}

        <div className="temp-container">
          <div className="temp-circle-control">
            <div className="temp-inner-circle">
              <div className="temp-temperature">{formatTemp(sensorData.temperature)}°C</div>
              <div className="temp-fan-container">
  <div className="temp-fan-icon">
  <FaFan size={18} color="#3e99ed" />
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
      </div>
      
      <div className='footer-container'>
        <div className="control-buttons">
          <button className="control-btn" onClick={() => handleNavigation('/machinescreen2')} disabled={processing}>
            <FiWind size={20} />
            <span>Modes</span>
            <span><strong>{getModeDescription(sensorData.mode)}</strong></span>
          </button>
            <button className="control-btn" onClick={() => setShowAlarmModal(true)} disabled={processing}>
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
          <button className="control-btn" onClick={() => handleNavigation('/modes')} disabled={processing}>
            <FiWatch size={20} />
            <span>Timers</span>
          </button>
          <button className="control-btn" onClick={() => handleNavigation('/modes')} disabled={processing}>
            <FiSettings size={20} />
            <span>Settings</span>
          </button>
          <button className="control-btn" onClick={() => handleNavigation('/machine')} disabled={processing}>
            <FiZap size={20} />
            <span>Services</span>
          </button>
          <button className="control-btn" onClick={() => handleNavigation('/')} disabled={processing}>
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
              {sensorData.alarmOccurred === '1' && (
                <div style={{ 
                  padding: '10px', 
                  backgroundColor: '#ffeeee', 
                  borderRadius: '5px', 
                  marginBottom: '10px',
                  borderLeft: '4px solid red'
                }}>
                  <strong>System Alarm</strong>
                  <p style={{ margin: '5px 0 0 0' }}>An alarm has been triggered in the system</p>
                </div>
              )}
              {sensorData.alarmOccurred === '0' && (
                <div style={{ 
                  padding: '10px', 
                  backgroundColor: '#eeffee', 
                  borderRadius: '5px',
                  borderLeft: '4px solid green'
                }}>
                  <strong>No Active Alarms</strong>
                  <p style={{ margin: '5px 0 0 0' }}>System is operating normally</p>
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
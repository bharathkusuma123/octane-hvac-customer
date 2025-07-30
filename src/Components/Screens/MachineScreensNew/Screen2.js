// import React, { useState } from 'react';
// import { 
//   FiArrowLeft, 
//   FiPower, 
//   FiSun, 
//   FiDroplet, 
//   FiThermometer 
// } from 'react-icons/fi';
// import './Screen1.css';
// import './Screen2.css';
// import AIROlogo from './Images/AIRO.png'
// import greenAire from './Images/greenAire.png'

// const Screen2 = () => {
//   // State for ControlButtons2 functionality
//   const [selectedMode, setSelectedMode] = useState('High');
//   const [fanPosition, setFanPosition] = useState(50);

//   const handleFanMove = (e) => {
//     const containerWidth = e.currentTarget.offsetWidth;
//     const clickPosition = e.nativeEvent.offsetX;
//     const percentage = Math.min(100, Math.max(0, (clickPosition / containerWidth) * 100));
//     setFanPosition(percentage);
//   };

//   const modes = ['High', 'Medium', 'Low'];

//   return (
//     <div className='mainmain-container' style={{ backgroundImage: 'linear-gradient(to bottom, #3E99ED, #2B7ED6)' }}>
//       <div className="main-container">
//         {/* Header Section */}
//                                       <div className="header">
//     <div className="logo">
//         <img src={AIROlogo} alt="AIRO Logo" className="logo-image" />
//     </div>
//     <button className="power-button">
//         <FiPower size={24} color="#4CAF50" />
//     </button>
// </div>

//         {/* Temperature Control */}
//         <div className="temp-container">
//           <div className="temp-circle-control">
//             <div className="temp-inner-circle">
//               <div className="temp-temperature">25°C</div>
//               <div className="temp-fan-container">
//                 <div className="temp-fan-icon-container">
//                   <div className="temp-fan-line1"></div>
//                   <div className="temp-fan-line2"></div>
//                   <div className="temp-fan-line3"></div>
//                 </div>
//                 <span className="temp-fan-speed">Medium</span>
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

//         {/* Environment Info */}
//         <div className="env-info">
//           <div className="env-item">
//             <FiSun className="env-icon" size={20} color="#FFFFFF" />
//             <div className="env-value">42°C</div>
//             <div className="env-label">Outside Temp</div>
//           </div>
//           <div className="env-item">
//             <FiDroplet className="env-icon" size={20} color="#FFFFFF" />
//             <div className="env-value">14%</div>
//             <div className="env-label">Humidity</div>
//           </div>
//           <div className="env-item">
//             <FiThermometer className="env-icon" size={20} color="#FFFFFF" />
//             <div className="env-value">28°C</div>
//             <div className="env-label">Room Temp</div>
//           </div>
//         </div>

//         {/* Integrated ControlButtons2 Section */}
//         <div className="control-buttons-container">
//           <div className="handle" />

//           <div className="section">
//             <h3 className="heading">Modes</h3>
//             <div className="mode-row">
//               {modes.map((mode, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setSelectedMode(mode)}
//                   className={`mode-button ${selectedMode === mode ? 'mode-button-selected' : ''}`}
//                 >
//                   <span className={`mode-text ${selectedMode === mode ? 'mode-text-selected' : ''}`}>
//                     {mode}
//                   </span>
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="section">
//             <h3 className="heading">Fan Speed</h3>
//             <div 
//               className="line-with-dot-container"
//               onClick={handleFanMove}
//             >
//               <div className="line" />
//               <div 
//                 className="dot" 
//                 style={{ left: `${fanPosition}%` }}
//               />
//             </div>
//           </div>

//           <div className="logo-container">
//             <img 
//               src={greenAire} 
//               alt="GreenAire Logo" 
//               className="logo-image" 
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Screen2;

//=================================================================



// import React, { useState, useEffect } from 'react';
// import {
//   FiArrowLeft,
//   FiPower,
//   FiSun,
//   FiDroplet,
//   FiThermometer
// } from 'react-icons/fi';
// import './Screen1.css';
// import './Screen2.css';
// import AIROlogo from './Images/AIRO.png';
// import greenAire from './Images/greenAire.png';
// import { useNavigate } from 'react-router-dom';

// const Screen2 = () => {
//   // State for sensor data
//   const [sensorData, setSensorData] = useState({
//     outsideTemp: 0,
//     humidity: 0,
//     roomTemp: 0,
//     fanSpeed: 'Medium',
//     temperature: 25
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//  const navigate = useNavigate();
//   // State for ControlButtons2 functionality
//   const [selectedMode, setSelectedMode] = useState('High');
//   const [fanPosition, setFanPosition] = useState(50);

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

//   const handleFanMove = (e) => {
//     const containerWidth = e.currentTarget.offsetWidth;
//     const clickPosition = e.nativeEvent.offsetX;
//     const percentage = Math.min(100, Math.max(0, (clickPosition / containerWidth) * 100));
//     setFanPosition(percentage);
//   };

//   const modes = ['High', 'Medium', 'Low'];

//   if (loading) {
//     return <div className="loading">Loading...</div>;
//   }

//   if (error) {
//     return <div className="error">Error: {error}</div>;
//   }


//   const handleBackClick = () => {
//     navigate('/machinescreen1'); 
//   };
//   return (
//     <div className='mainmain-container' style={{ backgroundImage: 'linear-gradient(to bottom, #3E99ED, #2B7ED6)' }}>
//       <div className="main-container">
//         {/* Header Section */}
//         {/* <div className="header">
//             <button className="icon-button">
//                <FiArrowLeft size={24} color="white" />
//             </button>
//           <div className="logo">
//             <img src={AIROlogo} alt="AIRO Logo" className="logo-image" />
//           </div>
//           <button className="power-button">
//             <FiPower size={24} color="#4CAF50" />
//           </button>
//         </div> */}
//         <div className="header">
//           <button className="icon-button" onClick={handleBackClick}>
//             <FiArrowLeft size={24} color="white" />
//           </button>

//           <img
//             src={AIROlogo}
//             alt="AIRO Logo"
//             className="logo"
//           />

//           <button className="power-button">
//             <FiPower size={30} color="#4CAF50" />
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

//         {/* Environment Info */}
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

//         {/* Integrated ControlButtons2 Section */}
//         <div className="control-buttons-container">
//           <div className="handle" />

//           <div className="section">
//             <h3 className="heading">Modes</h3>
//             <div className="mode-row">
//               {modes.map((mode, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setSelectedMode(mode)}
//                   className={`mode-button ${selectedMode === mode ? 'mode-button-selected' : ''}`}
//                 >
//                   <span className={`mode-text ${selectedMode === mode ? 'mode-text-selected' : ''}`}>
//                     {mode}
//                   </span>
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="section">
//             <h3 className="heading">Fan Speed</h3>
//             <div
//               className="line-with-dot-container"
//               onClick={handleFanMove}
//             >
//               <div className="line" />
//               <div
//                 className="dot"
//                 style={{ left: `${fanPosition}%` }}
//               />
//             </div>
//           </div>

//           <div className="logo-container">
//             <img
//               src={greenAire}
//               alt="GreenAire Logo"
//               className="logo-image"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Screen2;
















// import React, { useState, useEffect } from 'react';
// import {
//   FiArrowLeft,
//   FiPower,
//   FiSun,
//   FiDroplet,
//   FiThermometer
// } from 'react-icons/fi';
// import './Screen1.css';
// import './Screen2.css';
// import AIROlogo from './Images/AIRO.png';
// import greenAire from './Images/greenAire.png';
// import { useNavigate } from 'react-router-dom';

// const Screen2 = () => {
//   // State for sensor data
//   const [sensorData, setSensorData] = useState({
//     outsideTemp: 0,
//     humidity: 0,
//     roomTemp: 0,
//     fanSpeed: 'Medium',
//     temperature: 25,
//     powerStatus: 'off'
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
  
//   // State for ControlButtons2 functionality
//   const [selectedMode, setSelectedMode] = useState('IDEC');
//   const [fanPosition, setFanPosition] = useState(50);

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
//           temperature: parsedData['SRT'] || sensorData.temperature,
//           powerStatus: parsedData['PS'] === '1' ? 'on' : 'off'
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

//   // Format 3-digit temperature string to decimal format (e.g., "253" → "25.3")
//   const formatThreeDigitTemp = (temp) => {
//     if (typeof temp === 'string' && temp.length === 3) {
//       return `${temp.substring(0, 2)}.${temp.substring(2)}`;
//     }
//     return temp; // Return as-is if not a 3-digit string
//   };

//   const handleFanMove = (e) => {
//     const containerWidth = e.currentTarget.offsetWidth;
//     const clickPosition = e.nativeEvent.offsetX;
//     const percentage = Math.min(100, Math.max(0, (clickPosition / containerWidth) * 100));
//     setFanPosition(percentage);
//   };

//   const modes = ['IDEC', 'Auto', 'Fan', 'Indirect', 'Direct'];

//   if (loading) {
//     return <div className="loading">Loading...</div>;
//   }

//   if (error) {
//     return <div className="error">Error: {error}</div>;
//   }

//   const handleBackClick = () => {
//     navigate('/machinescreen1'); 
//   };

//   return (
//     <div className='mainmain-container' style={{ backgroundImage: 'linear-gradient(to bottom, #3E99ED, #2B7ED6)' }}>
//       <div className="main-container">
//         {/* Header Section */}
//         <div className="header">
//           <button className="icon-button" onClick={handleBackClick}>
//             <FiArrowLeft size={24} color="white" />
//           </button>

//           <img
//             src={AIROlogo}
//             alt="AIRO Logo"
//             className="logo"
//           />

//           <button className={`power-button ${sensorData.powerStatus === 'on' ? 'power-on' : 'power-off'}`}>
//             <FiPower size={30} color={sensorData.powerStatus === 'on' ? "#4CAF50" : "#F44336"} />
//           </button>
//         </div>

//         {/* Temperature Control */}
//         <div className="temp-container">
//           <div className="temp-circle-control">
//             <div className="temp-inner-circle">
//               <div className="temp-temperature">{formatThreeDigitTemp(sensorData.temperature)}°C</div>
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

//         {/* Environment Info */}
//         <div className="env-info">
//           <div className="env-item">
//             <FiSun className="env-icon" size={20} color="#FFFFFF" />
//             <div className="env-value">{formatThreeDigitTemp(sensorData.outsideTemp)}°C</div>
//             <div className="env-label">Outside Temp</div>
//           </div>
//           <div className="env-item">
//             <FiDroplet className="env-icon" size={20} color="#FFFFFF" />
//             <div className="env-value">{sensorData.humidity}%</div>
//             <div className="env-label">Humidity</div>
//           </div>
//           <div className="env-item">
//             <FiThermometer className="env-icon" size={20} color="#FFFFFF" />
//             <div className="env-value">{formatThreeDigitTemp(sensorData.roomTemp)}°C</div>
//             <div className="env-label">Room Temp</div>
//           </div>
//         </div>

//         {/* Integrated ControlButtons2 Section */}
//         <div className="control-buttons-container">
//           <div className="handle" />

//           <div className="section">
//             <h3 className="heading">Modes</h3>
//             <div className="mode-row">
//               {modes.map((mode, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setSelectedMode(mode)}
//                   className={`mode-button ${selectedMode === mode ? 'mode-button-selected' : ''}`}
//                 >
//                   <span className={`mode-text ${selectedMode === mode ? 'mode-text-selected' : ''}`}>
//                     {mode}
//                   </span>
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="section">
//             <h3 className="heading">Fan Speed</h3>
//             <div
//               className="line-with-dot-container"
//               onClick={handleFanMove}
//             >
//               <div className="line" />
//               <div
//                 className="dot"
//                 style={{ left: `${fanPosition}%` }}
//               />
//             </div>
//           </div>

//           <div className="logo-container">
//             <img
//               src={greenAire}
//               alt="GreenAire Logo"
//               className="logo-image"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Screen2;




import React, { useState, useEffect } from 'react';
import {
  FiArrowLeft,
  FiPower,
  FiSun,
  FiDroplet,
  FiThermometer
} from 'react-icons/fi';
import './Screen1.css';
import './Screen2.css';
import AIROlogo from './Images/AIRO.png';
import greenAire from './Images/greenAire.png';
import { useNavigate } from 'react-router-dom';

const Screen2 = () => {
  // State for sensor data
  const [sensorData, setSensorData] = useState({
    outsideTemp: 0,
    humidity: 0,
    roomTemp: 0,
    fanSpeed: '',
    temperature: 25,
    powerStatus: 'off'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // State for ControlButtons2 functionality
  const [selectedMode, setSelectedMode] = useState('IDEC');
  // Changed fanPosition to represent one of 4 fixed positions (0-3)
  const [fanPosition, setFanPosition] = useState(1); // Default to Medium (position 1)

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

  // Format 3-digit temperature string to decimal format (e.g., "253" → "25.3")
  const formatThreeDigitTemp = (temp) => {
    if (typeof temp === 'string' && temp.length === 3) {
      return `${temp.substring(0, 2)}.${temp.substring(2)}`;
    }
    return temp; // Return as-is if not a 3-digit string
  };

  const handleFanMove = (e) => {
    const containerWidth = e.currentTarget.offsetWidth;
    const clickPosition = e.nativeEvent.offsetX;
    
    // Calculate which of the 4 segments was clicked
    const segmentWidth = containerWidth / 4;
    const newPosition = Math.min(3, Math.floor(clickPosition / segmentWidth));
    
    setFanPosition(newPosition);
    
    // Update fan speed in sensorData based on position
    const fanSpeeds = ['High', 'Medium', 'Low', 'Off'];
    setSensorData(prev => ({
      ...prev,
      fanSpeed: fanSpeeds[newPosition]
    }));
  };

  // Convert position (0-3) to percentage for CSS (0%, 33.33%, 66.66%, 100%)
  const positionToPercentage = (pos) => {
    return pos * (100 / 3);
  };

  const modes = ['IDEC', 'Auto', 'Fan', 'Indirect', 'Direct'];

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  const handleBackClick = () => {
    navigate('/machinescreen1'); 
  };

  return (
    <div className='mainmain-container' style={{ backgroundImage: 'linear-gradient(to bottom, #3E99ED, #2B7ED6)' }}>
      <div className="main-container">
        {/* Header Section */}
        <div className="header">
          <button className="icon-button" onClick={handleBackClick}>
            <FiArrowLeft size={24} color="white" />
          </button>

          <img
            src={AIROlogo}
            alt="AIRO Logo"
            className="logo"
          />

          <button className={`power-button ${sensorData.powerStatus === 'on' ? 'power-on' : 'power-off'}`}>
            <FiPower size={30} color={sensorData.powerStatus === 'on' ? "#4CAF50" : "#F44336"} />
          </button>
        </div>

        {/* Temperature Control */}
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

        {/* Environment Info */}
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
                style={{ left: `${positionToPercentage(fanPosition)}%` }}
              />
              {/* Add markers for the 4 positions */}
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
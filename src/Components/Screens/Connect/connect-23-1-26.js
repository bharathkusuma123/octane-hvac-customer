// import React, { useState, useEffect } from 'react';
// import Navbar from "../../Screens/Navbar/Navbar";
// import './Connect.css';

// const Connect = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [showFallback, setShowFallback] = useState(false);
//   const [connectionStatus, setConnectionStatus] = useState('disconnected');
//   const [simulateProgress, setSimulateProgress] = useState(0);

//   const handleConnectClick = () => {
//     setIsModalOpen(true);
//     setShowFallback(false);
//     setConnectionStatus('connecting');
//     setSimulateProgress(0);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setConnectionStatus('disconnected');
//     setSimulateProgress(0);
//   };

//   // Simulate connection progress
//   useEffect(() => {
//     let progressInterval;
//     if (connectionStatus === 'connecting') {
//       progressInterval = setInterval(() => {
//         setSimulateProgress(prev => {
//           if (prev >= 100) {
//             clearInterval(progressInterval);
//             setConnectionStatus('connected');
//             return 100;
//           }
//           return prev + 40;
//         });
//       }, 500);
//     }
    
//     return () => clearInterval(progressInterval);
//   }, [connectionStatus]);

//   const deviceUrl = "http://192.168.178.86/";

//   return (
//     <div className="connect-container">
//       <Navbar />
//       <div className="connect-content">
//         <h1 className="connect-title">Device Connection</h1>
//         <p className="connect-subtitle">Connect your device to use all features</p>
        
        
//         <div className="connection-card">
//           <div className="card-icon">📱</div>
//           <h3>Ready to Connect</h3>
//           <p>Press the button below to start the connection process</p>
          
//           <button 
//             onClick={handleConnectClick}
//             className="connect-button"
//             aria-label="Connect device"
//           >
//             Connect Device
//           </button>
//         </div>

//        {isModalOpen && (
//   <div className="connect-modal-overlay">
//     <div className="connect-modal-content">
//       <div className="connect-modal-header">
//         <h2 className="connect-modal-title">Device Connection</h2>
//         <button 
//           className="connect-close-button" 
//           onClick={closeModal}
//           aria-label="Close connection"
//         >
//           &times;
//         </button>
//       </div>
      
//       <div className="modal-body">
//         {simulateProgress < 100 ? (
//           <div className="connection-progress">
//             <div className="progress-wrapper">
//               <div className="progress-bar">
//                 <div 
//                   className="progress" 
//                   style={{ width: `${simulateProgress}%` }}
//                 ></div>
//               </div>
//               <span className="progress-value">{simulateProgress}%</span>
//             </div>
//           </div>
//         ) : (
//           <div className="connection-content text-center">
//             <h3 className="no-device-text">There is no device ready to connect nearby.</h3>
//             <p className="note">Note: Make sure your HVAC device is turned on.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   </div>
// )}

//       </div>
//     </div>
//   );
// };

// export default Connect;

// src/Connect.js
import React, { useState } from "react";

const Connect = () => {
  const [status, setStatus] = useState("idle");
  const [pcb, setPcb] = useState(null);
  const [error, setError] = useState(null);

  // Change this to your ESP32 IP address
  const deviceBase = "http://192.168.178.86";

  const handleConnect = async () => {
    setError(null);
    setStatus("connecting");

    // Step 1: open ESP32 WiFi login page in a new tab
    window.open(deviceBase, "_blank");

    // Step 2: wait a few seconds for the user to enter WiFi credentials
    setTimeout(async () => {
      try {
        const res = await fetch(`${deviceBase}/submit`, {
          method: "GET",
          mode: "cors", // allow cross-origin requests
          headers: {
            "Content-Type": "text/plain",
          },
        });

        // Check if response is OK
        if (!res.ok) {
          throw new Error(`Server responded with status ${res.status}`);
        }

        const text = await res.text();
        console.log("Response from ESP32:", text);

        // Try to extract Device Serial ID from the HTML text
        const match = text.match(/Device Serial ID:\s*([A-Za-z0-9]+)/i);

        if (match && match[1]) {
          setPcb(match[1]);
          setStatus("connected");
        } else {
          setStatus("failed");
          setError("Could not find device serial ID in the response.");
        }
      } catch (err) {
        console.error("Fetch failed:", err);
        setStatus("failed");
        setError("Failed to connect to the ESP32. Please check network connection.");
      }
    }, 5000); // wait 5 seconds before attempting fetch
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ color: "#333" }}>🔗 Connect Device</h2>

      {status !== "connected" && (
        <button
          onClick={handleConnect}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "6px",
            marginTop: "10px",
          }}
        >
          Connect
        </button>
      )}

      {status === "connecting" && (
        <p style={{ marginTop: 20 }}>
          ⏳ Connecting... Please open the new tab and finish entering WiFi credentials.
        </p>
      )}

      {status === "connected" && (
        <div style={{ marginTop: 20 }}>
          <h3 style={{ color: "green" }}>✅ Connected Successfully!</h3>
          <p>
            Device Serial ID: <strong>{pcb}</strong>
          </p>
        </div>
      )}

      {status === "failed" && (
        <div style={{ marginTop: 20, color: "red" }}>
          <h4>❌ Connection Failed</h4>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default Connect;




// connect code from mathew's 

// import React, { useEffect, useState } from "react";

// const deviceBase = "http://192.168.178.86"; // ESP32 IP (used for iframe src)

// const Connect = () => {
//   const [status, setStatus] = useState("idle");
//   const [pcb, setPcb] = useState(null);
//   const [showIframe, setShowIframe] = useState(false);

//   useEffect(() => {
//     const handler = (event) => {
//       // For security, check event.origin if you know the ESP32 origin.
//       // The ESP32 will have an IP origin like "http://192.168.178.86".
//       // Example:
//       // if (event.origin !== 'http://192.168.178.86') return;

//       if (event?.data?.type === "ESP_PCB" && event.data.pcb) {
//         setPcb(event.data.pcb);
//         setStatus("connected");
//         setShowIframe(false);
//       }
//     };

//     window.addEventListener("message", handler);
//     return () => window.removeEventListener("message", handler);
//   }, []);

//   const handleConnect = () => {
//     setStatus("connecting");
//     setShowIframe(true);
//   };

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>🔗 Connect Device</h2>

//       {status !== "connected" && !showIframe && (
//         <button onClick={handleConnect}>Connect</button>
//       )}

//       {showIframe && (
//         <div style={{ marginTop: 20 }}>
//           <p>Enter WiFi credentials for ESP32 below:</p>
//           <iframe
//             src={deviceBase}
//             title="ESP32 Setup"
//             style={{ width: "100%", height: 420, border: "1px solid #ccc" }}
//           />
//           <p style={{ fontSize: 12, color: "#666" }}>
//             After submitting, the device will send the PCB to this page.
//           </p>
//         </div>
//       )}

//       {status === "connected" && (
//         <div style={{ marginTop: 20 }}>
//           <h3 style={{ color: "green" }}>✅ Connected!</h3>
//           <p>Device Serial ID: <strong>{pcb}</strong></p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Connect;


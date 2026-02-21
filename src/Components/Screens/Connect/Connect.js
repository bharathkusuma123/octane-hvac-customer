// src/Connect.js
import React, { useEffect, useState } from "react";
import Navbar from "../../Screens/Navbar/Navbar";
import "./Connect.css";

// const deviceBase = "http://192.168.178.86"; // ESP32 IP
// const deviceBase = "https://crm.funstay.in/";
const deviceBase = "http://69.62.76.211:3000/" ;

const Connect = () => {
  const [status, setStatus] = useState("idle"); // idle | connecting | connected
  const [pcb, setPcb] = useState(null);
  const [showIframe, setShowIframe] = useState(false);

  // 🔄 used to force iframe reload
  const [iframeKey, setIframeKey] = useState(Date.now());

  useEffect(() => {
    const handler = (event) => {
      // Optional security check
      // if (event.origin !== deviceBase) return;

      if (event?.data?.type === "ESP_PCB" && event.data.pcb) {
        setPcb(event.data.pcb);
        setStatus("connected");
        setShowIframe(false);
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const handleConnect = () => {
    setStatus("connecting");
    setShowIframe(true);
    reloadDevicePage(); // initial attempt
  };

  // 🔄 Reload ESP32 page (mobile-safe)
  const reloadDevicePage = () => {
    setIframeKey(Date.now());
  };

  // ⏳ Auto-reload once after opening iframe
  useEffect(() => {
    if (showIframe) {
      const timer = setTimeout(() => {
        reloadDevicePage();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showIframe]);

  return (
    <div className="connect-container">
      <Navbar />

      <div className="connect-content" style={{ padding: 20 }}>
        <h2>🔗 Connect Device</h2>

        {/* CONNECT BUTTON */}
        {status !== "connected" && !showIframe && (
          <button
            onClick={handleConnect}
            style={{
              padding: "10px 20px",
              fontSize: 16,
              borderRadius: 6,
            }}
          >
            Connect
          </button>
        )}

        {/* ESP32 SETUP IFRAME */}
        {showIframe && (
          <div style={{ marginTop: 20 }}>
            <p>Enter WiFi credentials below:</p>

            <iframe
              key={iframeKey}
              src={deviceBase}
              title="ESP32 Setup"
              style={{
                width: "100%",
                height: 420,
                border: "1px solid #ccc",
                borderRadius: 6,
              }}
            />

            {/* RELOAD BUTTON */}
            <button
              onClick={reloadDevicePage}
              style={{
                marginTop: 12,
                padding: "10px 16px",
                backgroundColor: "#1976d2",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              🔄 Reload Device Page
            </button>

            <p style={{ fontSize: 12, color: "#666", marginTop: 8 }}>
              If the page does not load, tap Reload.
            </p>
          </div>
        )}

        {/* CONNECTED STATE */}
        {status === "connected" && (
          <div style={{ marginTop: 20 }}>
            <h3 style={{ color: "green" }}>✅ Connected!</h3>
            <p>
              Device Serial ID: <strong>{pcb}</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Connect;


// src/Connect.js
// import { useEffect, useState } from "react";
// import Navbar from "../../Screens/Navbar/Navbar";
// import "./Connect.css";

// const Connect = () => {
//   const [status, setStatus] = useState("idle");
//   const [pcb, setPcb] = useState(null);

//   useEffect(() => {
//     const handler = (event) => {
//       if (event?.data?.type === "ESP_PCB" && event.data.pcb) {
//         setPcb(event.data.pcb);
//         setStatus("connected");
//       }
//     };

//     window.addEventListener("message", handler);
//     return () => window.removeEventListener("message", handler);
//   }, []);

//   const handleConnect = () => {
//     setStatus("connecting");
    
//     // Check if running in native app
//     if (window.isNativeApp || window.ReactNativeWebView) {
//       // Send message to React Native to open modal
//       window.ReactNativeWebView?.postMessage(
//         JSON.stringify({ type: "OPEN_ESP32" })
//       );
//     } else {
//       // Desktop: open in new tab
//       window.open("http://192.168.178.86", "_blank");
//     }
//   };

//   return (
//     <div className="connect-container">
//       <Navbar />

//       <div className="connect-content" style={{ padding: 20 }}>
//         <h2>🔗 Connect Device</h2>

//         {status !== "connected" && (
//           <div>
//             <p>Connect to your device's WiFi network first</p>
//             <button
//               onClick={handleConnect}
//               style={{
//                 padding: "12px 24px",
//                 fontSize: 16,
//                 borderRadius: 6,
//                 backgroundColor: "#1976d2",
//                 color: "#fff",
//                 border: "none",
//                 cursor: "pointer",
//               }}
//             >
//               {status === "connecting" ? "Connecting..." : "Connect Device"}
//             </button>
//           </div>
//         )}

//         {status === "connected" && (
//           <div style={{ marginTop: 20 }}>
//             <h3 style={{ color: "green" }}>✅ Connected!</h3>
//             <p>
//               Device Serial ID: <strong>{pcb}</strong>
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Connect;

// src/Connect.js
import React, { useEffect, useState } from "react";
import Navbar from "../../Screens/Navbar/Navbar"; // ✅ same Navbar as Dashboard
import "./Connect.css"; // optional (only if you want styling consistency)

const deviceBase = "http://192.168.178.86"; // ESP32 IP

const Connect = () => {
  const [status, setStatus] = useState("idle");
  const [pcb, setPcb] = useState(null);
  const [showIframe, setShowIframe] = useState(false);

  useEffect(() => {
    const handler = (event) => {
      // Optional security check
      // if (event.origin !== "http://192.168.178.86") return;

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
  };

  return (
    <div className="connect-container">
      {/* ✅ Navbar included */}
      <Navbar />

      <div className="connect-content" style={{ padding: 20 }}>
        <h2>🔗 Connect Device</h2>

        {status !== "connected" && !showIframe && (
          <button onClick={handleConnect}>Connect</button>
        )}

        {showIframe && (
          <div style={{ marginTop: 20 }}>
            <p>Enter WiFi credentials below:</p>

            <iframe
              src={deviceBase}
              title="ESP32 Setup"
              style={{
                width: "100%",
                height: 420,
                border: "1px solid #ccc",
              }}
            />

            <p style={{ fontSize: 12, color: "#666" }}>
              After submitting, the device will send the PCB to this page.
            </p>
          </div>
        )}

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

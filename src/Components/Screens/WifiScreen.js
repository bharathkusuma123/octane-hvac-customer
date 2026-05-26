import React from 'react';
import { useNavigate } from 'react-router-dom';
import './WifiScreen.css';

const WIFI_URL = 'http://72.60.200.39:90';

export default function WifiScreen() {
  const navigate = useNavigate();

  const handleOpen = () => {
    window.location.href = WIFI_URL;
  };

  return (
    <div className="wifi-container">
      <div className="wifi-header">
        <button className="wifi-back-btn" onClick={() => navigate(-1)}>
          &#8592; Back
        </button>
        <h2 className="wifi-header-title">Wi-Fi Configuration</h2>
        <div style={{ width: 60 }} />
      </div>

      <div className="wifi-blocked">
        <div className="wifi-blocked-icon">📶</div>
        <h3>Wi-Fi Configuration Portal</h3>
        <p>Click below to open the device portal in this same window.</p>
        <button className="wifi-open-btn" onClick={handleOpen}>
          Open Wi-Fi Portal
        </button>
      </div>
    </div>
  );
}
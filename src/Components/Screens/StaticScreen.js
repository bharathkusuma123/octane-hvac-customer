import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './StaticScreen.css';

export default function StaticScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    destinationPath = '/machinescreen1',
    destinationState = {},
    userMobile = '',
  } = location.state || {};

  const handleContinue = () => {
    navigate(destinationPath, { state: destinationState });
  };

   const handleWifi = () => {
  navigate('/wifi-instructions');
};


  return (
    <div className="static-container">
      <div className="static-card">
        <div className="static-icon">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="32" fill="#e8f5e9" />
            <path
              d="M20 34l8 8 16-16"
              stroke="#4CAF50"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h2 className="static-title">Login Successful!</h2>
        <p className="static-subtitle">How would you like to connect your device?</p>

        <div className="static-buttons">
          <button className="static-btn primary" onClick={handleContinue}>
            <span className="btn-icon">📱</span>
            Continue to App
            <span className="btn-sub">Use mobile data / existing network</span>
          </button>

          <div className="static-divider">
            <span>OR</span>
          </div>

          <button className="static-btn secondary" onClick={handleWifi}>
            <span className="btn-icon">📶</span>
            Configure Wi-Fi
            <span className="btn-sub">Connect device to a new Wi-Fi network</span>
          </button>
        </div>
      </div>
    </div>
  );
}
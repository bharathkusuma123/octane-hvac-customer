import React, { useState } from 'react';
import Navbar from "../../Screens/Navbar/Navbar";
import './Connect.css';

const Connect = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConnectClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Using a demo website that allows iframe embedding
  const deviceUrl = "https://google.com"; // Replace with actual device connection URL

  return (
    <div className="connect-container">
      <Navbar />
      <div className="connect-content">
        <h1 className="connect-title">Device Connection</h1>
        <p className="connect-subtitle">Tap below to connect your mobile device</p>
        
        <button 
          onClick={handleConnectClick}
          className="connect-button"
          aria-label="Connect device"
        >
          Connect Device
        </button>

        {isModalOpen && (
          <div className="connect-modal-overlay">
            <div className="connect-modal-content">
              <div className="connect-modal-header">
                <h2 className="connect-modal-title">Device Connection</h2>
                <button 
                  className="connect-close-button" 
                  onClick={closeModal}
                  aria-label="Close connection"
                >
                  &times;
                </button>
              </div>
              <div className="connect-iframe-container">
                <iframe 
                  src={deviceUrl}
                  title="Device Connection Interface"
                  className="connect-iframe"
                  allow="camera; microphone" // Add necessary permissions
                />
                <div className="connect-iframe-fallback">
                  <p>Connection interface couldn't be loaded.</p>
                  <a 
                    href={deviceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="connect-external-link"
                  >
                    Open in browser
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Connect;
import React, { useState } from 'react';
import Navbar from "../../Screens/Navbar/Navbar";
import './Connect.css';

const Connect = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  const handleConnectClick = () => {
    setIsModalOpen(true);
    setShowFallback(false); // reset fallback when modal is reopened
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Use a URL that allows embedding in iframes
  const deviceUrl = "https://iiiqbetshrms.web.app/"; // Replace with your actual device connection URL

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
                {!showFallback ? (
                  <iframe 
                    src={deviceUrl}
                    title="Device Connection Interface"
                    className="connect-iframe"
                    allow="camera; microphone"
                    sandbox="allow-scripts allow-same-origin allow-forms"
                    onError={() => setShowFallback(true)}
                  />
                ) : (
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
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Connect;

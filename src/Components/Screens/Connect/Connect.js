import React, { useState, useEffect } from 'react';
import Navbar from "../../Screens/Navbar/Navbar";
import './Connect.css';

const Connect = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [simulateProgress, setSimulateProgress] = useState(0);

  const handleConnectClick = () => {
    setIsModalOpen(true);
    setShowFallback(false);
    setConnectionStatus('connecting');
    setSimulateProgress(0);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setConnectionStatus('disconnected');
    setSimulateProgress(0);
  };

  // Simulate connection progress
  useEffect(() => {
    let progressInterval;
    if (connectionStatus === 'connecting') {
      progressInterval = setInterval(() => {
        setSimulateProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            setConnectionStatus('connected');
            return 100;
          }
          return prev + 40;
        });
      }, 500);
    }
    
    return () => clearInterval(progressInterval);
  }, [connectionStatus]);

  const deviceUrl = "http://192.168.178.86/";

  return (
    <div className="connect-container">
      <Navbar />
      <div className="connect-content">
        <h1 className="connect-title">Device Connection</h1>
        <p className="connect-subtitle">Connect your device to use all features</p>
        
        
        <div className="connection-card">
          <div className="card-icon">📱</div>
          <h3>Ready to Connect</h3>
          <p>Press the button below to start the connection process</p>
          
          <button 
            onClick={handleConnectClick}
            className="connect-button"
            aria-label="Connect device"
          >
            Connect Device
          </button>
        </div>

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
      
      <div className="modal-body">
        {simulateProgress < 100 ? (
          <div className="connection-progress">
            <div className="progress-wrapper">
              <div className="progress-bar">
                <div 
                  className="progress" 
                  style={{ width: `${simulateProgress}%` }}
                ></div>
              </div>
              <span className="progress-value">{simulateProgress}%</span>
            </div>
          </div>
        ) : (
          <div className="connection-content text-center">
            <h3 className="no-device-text">There is no device ready to connect nearby.</h3>
            <p className="note">Note: Make sure your HVAC device is turned on.</p>
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
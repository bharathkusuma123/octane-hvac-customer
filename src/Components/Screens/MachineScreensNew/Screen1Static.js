import React from 'react';
import {
        FiArrowLeft, FiPower, FiWind, FiClock, FiWatch, FiSettings, FiZap, FiLogOut, FiSun,
        FiDroplet,
        FiThermometer
} from 'react-icons/fi';
import './Screen1.css';
import AIROlogo from './Images/AIRO.png'
import greenAire from './Images/greenAire.png'

const Screen1 = () => {
        return (
                <div className='mainmain-container' style={{ backgroundImage: 'linear-gradient(to bottom, #3E99ED, #2B7ED6)' }}>

                        <div className="main-container">
                                {/* Header Section */}
                                {/* <div className="header">
                                        <button className="icon-button">
                                                <FiArrowLeft size={24} color="white" />
                                        </button>
                                        <div className="logo">AIRO</div>
                                        <button className="power-button">
                                                <FiPower size={24} color="#4CAF50" />
                                        </button>
                                </div> */}
                                <div className="header">
    <div className="logo">
        <img src={AIROlogo} alt="AIRO Logo" className="logo-image" />
    </div>
    <button className="power-button">
        <FiPower size={24} color="#4CAF50" />
    </button>
</div>

                                {/* Temperature Control */}
                                <div className="temp-container">
                                        <div className="temp-circle-control">
                                                <div className="temp-inner-circle">
                                                        <div className="temp-temperature">25°C</div>
                                                        <div className="temp-fan-container">
                                                                <div className="temp-fan-icon-container">
                                                                        <div className="temp-fan-line1"></div>
                                                                        <div className="temp-fan-line2"></div>
                                                                        <div className="temp-fan-line3"></div>
                                                                </div>
                                                                <span className="temp-fan-speed">Medium</span>
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

                                {/* Environment Info with Icons */}
                                <div className="env-info">
                                        <div className="env-item">
                                                <FiSun className="env-icon" size={20} color="#FFFFFF" />
                                                <div className="env-value">42°C</div>
                                                <div className="env-label">Outside Temp</div>
                                        </div>
                                        <div className="env-item">
                                                <FiDroplet className="env-icon" size={20} color="#FFFFFF" />
                                                <div className="env-value">14%</div>
                                                <div className="env-label">Humidity</div>
                                        </div>
                                        <div className="env-item">
                                                <FiThermometer className="env-icon" size={20} color="#FFFFFF" />
                                                <div className="env-value">28°C</div>
                                                <div className="env-label">Room Temp</div>
                                        </div>
                                </div>
                                {/* Control Buttons */}


                                {/* Footer Logo */}
                        </div>
                        <div className='footer-container'>
                                <div className="control-buttons">
                                        <button className="control-btn">
                                                <FiWind size={20} />
                                                <span>Modes</span>
                                        </button>
                                        <button className="control-btn">
                                                <FiClock size={20} />
                                                <span>Alarms</span>
                                        </button>
                                        <button className="control-btn">
                                                <FiWatch size={20} />
                                                <span>Timers</span>
                                        </button>
                                        <button className="control-btn">
                                                <FiSettings size={20} />
                                                <span>Settings</span>
                                        </button>
                                        <button className="control-btn">
                                                <FiZap size={20} />
                                                <span>Services</span>
                                        </button>
                                        <button className="control-btn">
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
                                </div>      </div>
                </div>
        );
};

export default Screen1;
// NavScreen.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaCogs,
  FaEnvelope,
  FaCommentDots,
  FaPlus,
} from 'react-icons/fa';
import './Navbar.css';

const screens = [
  { label: 'Dashboard', name: '/dashboard', icon: <FaHome /> },
  { label: 'Machines', name: '/machine', icon: <FaCogs /> },
  { label: 'Requests', name: '/request', icon: <FaEnvelope /> },
  { label: 'Feedback', name: '/feedback', icon: <FaCommentDots /> },
];

const NavScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeIcon, setActiveIcon] = useState(location.pathname);

  useEffect(() => {
    setActiveIcon(location.pathname);
  }, [location.pathname]);

  const handleIconClick = (path) => {
    navigate(path);
  };

  return (
    <>
      <div className="navbar-container">
        {screens.map((item, index) => {
          // Center button goes here
          if (index === 2) {
            return (
              <React.Fragment key={item.name}>
                <button
                  className={`nav-item ${activeIcon === item.name ? 'active' : ''}`}
                  onClick={() => handleIconClick(item.name)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>

                {/* Floating center button */}
                <div className="center-button" onClick={() => alert('Add')}>
                  <FaPlus />
                </div>
              </React.Fragment>
            );
          }

          return (
            <button
              key={item.name}
              className={`nav-item ${activeIcon === item.name ? 'active' : ''}`}
              onClick={() => handleIconClick(item.name)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};

export default NavScreen;

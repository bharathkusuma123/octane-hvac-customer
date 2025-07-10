import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaCogs,
  FaEnvelope,
  FaCommentDots,
  FaPlus,
  FaBell,
  FaUserCircle,
  FaTools,
} from 'react-icons/fa';
import './DelegateNavbar.css';
import logo from '../../Logos/hvac-logo-new.jpg';
import { useDelegateServiceItems } from "../../Components/AuthContext/DelegateServiceItemContext";

const screens = [
  { label: 'Dashboard', name: '/delegate-home', icon: <FaHome /> },
  { label: 'Machines', name: '/delegate-machines', icon: <FaCogs /> },
  { label: 'Requests', name: '/delegate-request ', icon: <FaEnvelope /> },
  { label: 'Feedback', name: '/delegate-survey', icon: <FaCommentDots /> },
];

const NavScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeIcon, setActiveIcon] = useState(location.pathname);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef();
const { serviceItems } = useDelegateServiceItems();
  useEffect(() => {
    setActiveIcon(location.pathname);
  }, [location.pathname]);

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleIconClick = (path) => {
    navigate(path);
  };

  return (
    <>
      {/* Top Navbar */}
      <div className="top-navbar">
        <img src={logo} alt="Logo" className="logo-img" />
        <div className="top-icons">
         
          
          <div className="service-dropdown">
    <select
      className="dropdown-select"
      onChange={(e) => alert(`Selected Service Item: ${e.target.value}`)}
    >
      <option value="">Select Service Item</option>
      {serviceItems.map((item) => (
        <option key={item.item_id} value={item.service_item}>
          {item.service_item}
        </option>
      ))}
    </select>
  </div>
         
          <FaBell className="top-icon" onClick={() => alert('Notifications Clicked!')} />
         
          {/* Profile Dropdown */}
          <div className="profile-dropdown" ref={profileRef}>
            <FaUserCircle
  className="top-icon"
   style={{ fontSize: '26px' }}
  onClick={() => {
    // console.log('Profile icon clicked');
    setShowProfileMenu((prev) => !prev);
  }}
/>
            {showProfileMenu && (
  <div className="dropdown-menu" style={{ display: 'block', background: 'white' }}>
  <div onClick={() => { setShowProfileMenu(false); navigate('/dashboard'); }}>
    Profile
  </div>
  <div onClick={() => { setShowProfileMenu(false); navigate('/'); }}>
    Logout
  </div>
</div>
)}

          </div>
        </div>
      </div>

      {/* Bottom Navbar */}
      <div className="navbar-container">
        {screens.map((item, index) => {
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

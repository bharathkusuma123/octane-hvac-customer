import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaCogs,
  FaEnvelope,
  FaCommentDots,
  FaBell,
  FaUserCircle
} from 'react-icons/fa';
import './DelegateNavbar.css';
import logo from '../../Logos/hvac-logo-new.jpg';
import { useDelegateServiceItems } from "../../Components/AuthContext/DelegateServiceItemContext";

const screens = [
  { label: 'Dashboard', name: '/delegate-home', icon: <FaHome />, key: 'dashboard' },
  { label: 'Machines', name: '/delegate-machines', icon: <FaCogs />, key: 'machines' },
  { label: 'Requests', name: '/delegate-display-request', icon: <FaEnvelope />, key: 'requests' },
  { label: 'Feedback', name: '/delegate-survey', icon: <FaCommentDots />, key: 'feedback' },
];

const NavScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeIcon, setActiveIcon] = useState(location.pathname);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [selectedServiceItemId, setSelectedServiceItemId] = useState('');
  const [permissions, setPermissions] = useState({});
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

  const handleIconClick = (path, isDisabled) => {
    if (!isDisabled) navigate(path);
  };

useEffect(() => {
  // Load previously selected service_item from localStorage
  const savedItemId = localStorage.getItem('selectedServiceItemId');
  if (savedItemId) {
    setSelectedServiceItemId(savedItemId);
    const foundItem = serviceItems.find(item => item.service_item === savedItemId);
    if (foundItem) {
      setPermissions(foundItem);
    }
  }
}, [serviceItems]);

const handleServiceItemChange = (e) => {
  const selectedId = e.target.value;
  setSelectedServiceItemId(selectedId);
  localStorage.setItem('selectedServiceItemId', selectedId); // persist selection

  const foundItem = serviceItems.find(item => item.service_item === selectedId);
  if (foundItem) {
    setPermissions(foundItem);
  } else {
    setPermissions({});
  }
};


  const getDisabledStatus = (key) => {
    if (key === 'dashboard') return false;

    if (key === 'machines') {
      return !(permissions.can_monitor_equipment && permissions.can_control_equipment);
    }

    if (key === 'requests') {
      return !(permissions.can_raise_service_request && permissions.can_close_service_request);
    }

    if (key === 'feedback') {
      return !(permissions.can_submit_customer_satisfaction_survey && permissions.can_log_customer_complaints);
    }

    return true;
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
              value={selectedServiceItemId}
              onChange={handleServiceItemChange}
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
              onClick={() => setShowProfileMenu(prev => !prev)}
            />
            {showProfileMenu && (
              <div className="dropdown-menu" style={{ display: 'block', background: 'white' }}>
                <div onClick={() => { setShowProfileMenu(false); navigate('/delegate-profile-details'); }}>
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
        {screens.map((item) => {
          const isDisabled = getDisabledStatus(item.key);
          return (
            <button
              key={item.name}
              className={`nav-item ${activeIcon === item.name ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}
              onClick={() => handleIconClick(item.name, isDisabled)}
              disabled={isDisabled}
              style={isDisabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
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

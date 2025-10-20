import React, { useState, useEffect, useRef, useContext } from 'react';
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
import { AuthContext } from "../../Components/AuthContext/AuthContext";

const screens = [
  { label: 'Dashboard', name: '/delegate-home', icon: <FaHome />, key: 'dashboard' },
  { label: 'Requests', name: '/delegate-display-request', icon: <FaEnvelope />, key: 'requests' },
  { label: 'Feedback', name: '/delegate-survey', icon: <FaCommentDots />, key: 'feedback' },
  { label: 'Monitor', name: '/delegate-machinescreen1', icon: <FaCogs />, key: 'machinescreen1' },
];

const NavScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeIcon, setActiveIcon] = useState(location.pathname);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef();
  const { logout } = useContext(AuthContext);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Use the enhanced context
  const { 
    serviceItems, 
    selectedServiceItem, 
    serviceItemPermissions, 
    updateSelectedServiceItem,
    loading 
  } = useDelegateServiceItems();

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

  const handleServiceItemChange = (e) => {
    const selectedId = e.target.value;
    updateSelectedServiceItem(selectedId);
  };

  const getDisabledStatus = (key) => {
    if (key === 'dashboard') return false;

    if (key === 'requests') {
      return !(serviceItemPermissions.can_raise_service_request && serviceItemPermissions.can_close_service_request);
    }

    if (key === 'feedback') {
      return !(serviceItemPermissions.can_submit_customer_satisfaction_survey && serviceItemPermissions.can_log_customer_complaints);
    }
    if (key === 'machinescreen1') {
      return !(serviceItemPermissions.can_monitor_equipment && serviceItemPermissions.can_control_equipment);
    }

    return true;
  };

  const handleLogout = async () => {
    setShowProfileMenu(false);
    setIsLoggingOut(true);
    
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <>
        <div className="top-navbar">
          <img src={logo} alt="Logo" className="logo-img" />
          <div className="top-icons">
            <div>Loading service items...</div>
          </div>
        </div>
        <div className="navbar-container">
          {screens.map((item) => (
            <button key={item.name} className="nav-item disabled" disabled>
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      {/* Top Navbar */}
      <div className="top-navbar">
        <img src={logo} alt="Logo" className="logo-img" />
        <div className="top-icons">
          <div className="service-dropdown">
            <select
              className="dropdown-select"
              value={selectedServiceItem}
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
                <div onClick={handleLogout}>
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
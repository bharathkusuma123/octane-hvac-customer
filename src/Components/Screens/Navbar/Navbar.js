// import React, { useState, useEffect, useRef, useContext } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import {
//   FaHome,
//   FaCogs,
//   FaEnvelope,
//   FaCommentDots,
//   FaPlus,
//   FaBell,
//   FaUserCircle, // 👈 Profile icon
// } from 'react-icons/fa';
// import './Navbar.css';
// import logo from '../../../Logos/hvac-logo-new.jpg';
// import { AuthContext } from "../../AuthContext/AuthContext";

// const screens = [
//   { label: 'Dashboard', name: '/home', icon: <FaHome /> },
//   { label: 'Machines', name: '/machine', icon: <FaCogs /> },
//   { label: 'Requests', name: '/request', icon: <FaEnvelope /> },
//   { label: 'Delegates', name: '/view-delegates', icon: <FaEnvelope /> },
//   { label: 'Feedback', name: '/display-feedback', icon: <FaCommentDots /> },
// ];

// const NavScreen = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [activeIcon, setActiveIcon] = useState(location.pathname);
//   const [showProfileMenu, setShowProfileMenu] = useState(false);
//   const profileRef = useRef();
//   const { logout } = useContext(AuthContext);

//   const handleLogout = () => {
//   setShowProfileMenu(false);
//   logout();
//   navigate("/");
// };


//   useEffect(() => {
//     setActiveIcon(location.pathname);
//   }, [location.pathname]);

//   // Close dropdown on outside click
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (profileRef.current && !profileRef.current.contains(event.target)) {
//         setShowProfileMenu(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const handleIconClick = (path) => {
//     navigate(path);
//   };

//   return (
//     <>
//       {/* Top Navbar */}
//       <div className="top-navbar">
//         <img src={logo} alt="Logo" className="logo-img" />
//         <div className="top-icons">
//           <FaBell className="top-icon" onClick={() => alert('Notifications Clicked!')} />
          
//           {/* Profile Dropdown */}
//           <div className="profile-dropdown" ref={profileRef}>
//             <FaUserCircle
//   className="top-icon"
//    style={{ fontSize: '26px' }}
//   onClick={() => {
//     // console.log('Profile icon clicked');
//     setShowProfileMenu((prev) => !prev);
//   }}
// />
//             {showProfileMenu && (
//   <div className="dropdown-menu" style={{ display: 'block', background: 'white' }}>
//   <div onClick={() => { setShowProfileMenu(false); navigate('/dashboard'); }}>
//     Profile
//   </div>
//    <div onClick={() => { setShowProfileMenu(false); navigate('/connect'); }}>
//     Connect 
//   </div>
//  <div onClick={handleLogout}>
//   Logout
// </div>
// </div>
// )}

//           </div>
//         </div>
//       </div>

//       {/* Bottom Navbar */}
//       <div className="navbar-container">
//         {screens.map((item, index) => {
//           if (index === 2) {
//             return (
//               <React.Fragment key={item.name}>
//                 <button
//                   className={`nav-item ${activeIcon === item.name ? 'active' : ''}`}
//                   onClick={() => handleIconClick(item.name)}
//                 >
//                   {item.icon}
//                   <span>{item.label}</span>
//                 </button>

//                 {/* Floating center button */}
//                 <div className="center-button" onClick={() => navigate('/service-form')}>
//                   <FaPlus />
//                 </div>
//               </React.Fragment>
//             );
//           }

//           return (
//             <button
//               key={item.name}
//               className={`nav-item ${activeIcon === item.name ? 'active' : ''}`}
//               onClick={() => handleIconClick(item.name)}
//             >
//               {item.icon}
//               <span>{item.label}</span>
//             </button>
//           );
//         })}
//       </div>
//     </>
//   );
// };

// export default NavScreen;




// src/Customer/Navbar/Navbar.js  (your NavScreen file)
// import React, { useState, useEffect, useRef, useContext } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import {
//   FaHome, FaCogs, FaEnvelope, FaPlus,
//   FaBell, FaUserCircle, FaUsers, FaInbox,
// } from 'react-icons/fa';
// import './Navbar.css';
// import logo from '../../../Logos/hvac-logo-new.jpg';
// import { AuthContext } from '../../AuthContext/AuthContext';
// import CustomerBell from './CustomerBell'; // ← ADD THIS IMPORT
// import logo9 from "../../Screens/MachineScreensNew/Images/AIRO.png"
// const screens = [
//   { label: 'Dashboard', name: '/home',           icon: <FaHome /> },
//   { label: 'Machines',  name: '/machine',         icon: <FaCogs /> },
//   { label: 'Requests',  name: '/request',         icon: <FaUsers /> },
//   { label: 'Delegates', name: '/view-delegates',  icon: <FaInbox /> },
// ];

// const NavScreen = () => {
//   const navigate   = useNavigate();
//   const location   = useLocation();
//   const [activeIcon, setActiveIcon]         = useState(location.pathname);
//   const [showProfileMenu, setShowProfileMenu] = useState(false);
//   const profileRef = useRef();
//   const { logout, user } = useContext(AuthContext); // ← add user here

//   const handleLogout = () => {
//     setShowProfileMenu(false);
//     logout();
//     navigate("/");
//   };

//   useEffect(() => {
//     setActiveIcon(location.pathname);
//   }, [location.pathname]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (profileRef.current && !profileRef.current.contains(event.target)) {
//         setShowProfileMenu(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const handleIconClick = (path) => {
//     navigate(path);
//   };

//   return (
//     <>
//       {/* Top Navbar */}
//       <div className="top-navbar">
//         <img src={logo9} alt="Logo" className="logo-img" />
//         <div className="top-icons">
//           <FaHome
//             className="top-icon"
//             onClick={() => navigate("/machinescreen1")}
//             style={{ cursor: "pointer" }}
//           />

//           {/* ✅ REPLACE the old FaBell line with this */}
//           {user?.customer_id
//             ? <CustomerBell />
//             : <FaBell className="top-icon" />
//           }

//           {/* Profile Dropdown — unchanged */}
//           <div className="profile-dropdown" ref={profileRef}>
//             <FaUserCircle
//               className="top-icon"
//               style={{ fontSize: '26px' }}
//               onClick={() => setShowProfileMenu((prev) => !prev)}
//             />
//             {showProfileMenu && (
//               <div className="dropdown-menu" style={{ display: 'block', background: 'white' }}>
//                 <div onClick={() => { setShowProfileMenu(false); navigate('/dashboard'); }}>
//                   Profile
//                 </div>
//                 <div onClick={() => { setShowProfileMenu(false); navigate('/connect'); }}>
//                   Connect
//                 </div>
//                 <div onClick={handleLogout}>
//                   Logout
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Bottom Navbar — completely unchanged */}
//       <div className="navbar-container">
//         {screens.map((item, index) => {
//           if (index === 2) {
//             return (
//               <React.Fragment key={item.name}>
//                 <div className="center-button" onClick={() => navigate('/service-form')}>
//                   <FaPlus />
//                 </div>
//                 <button
//                   className={`nav-item ${activeIcon === item.name ? 'active' : ''}`}
//                   onClick={() => handleIconClick(item.name)}
//                 >
//                   {item.icon}
//                   <span>{item.label}</span>
//                 </button>
//               </React.Fragment>
//             );
//           }
//           return (
//             <button
//               key={item.name}
//               className={`nav-item ${activeIcon === item.name ? 'active' : ''}`}
//               onClick={() => handleIconClick(item.name)}
//             >
//               {item.icon}
//               <span>{item.label}</span>
//             </button>
//           );
//         })}
//       </div>
//     </>
//   );
// };

// export default NavScreen;




import React, { useState, useEffect, useRef, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FaHome, FaCogs, FaEnvelope, FaPlus,
  FaBell, FaUserCircle, FaUsers, FaInbox,
  FaAngleLeft  // ← ADD THIS IMPORT
} from 'react-icons/fa';
import './Navbar.css';
import logo from '../../../Logos/hvac-logo-new.jpg';
import { AuthContext } from '../../AuthContext/AuthContext';
import CustomerBell from './CustomerBell';
import logo9 from "../../Screens/MachineScreensNew/Images/AIRO.png"

const screens = [
  { label: 'Dashboard', name: '/home',           icon: <FaHome /> },
  { label: 'Machines',  name: '/machine',         icon: <FaCogs /> },
  { label: 'Requests',  name: '/request',         icon: <FaUsers /> },
  { label: 'Delegates', name: '/view-delegates',  icon: <FaInbox /> },
];

const NavScreen = () => {
  const navigate   = useNavigate();
  const location   = useLocation();
  const [activeIcon, setActiveIcon]         = useState(location.pathname);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef();
  const { logout, user } = useContext(AuthContext);

  const handleLogout = () => {
    setShowProfileMenu(false);
    logout();
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

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
        {/* Left Arrow - Back button */}
        {/* <div className="back-arrow" onClick={handleGoBack} style={{ cursor: "pointer" }}>
          <FaArrowLeft size={24} color="#fff" />
          <FaAngleLeft 
  size={24} 
  color="#fff" 
  style={{ marginTop: "30px", cursor: "pointer" }} 
  onClick={handleGoBack}
/>
        </div> */}

        {/* Logo in the middle */}
        <img src={logo9} alt="Logo" className="logo-img" />

        {/* Right side icons */}
        <div className="top-icons">
          <FaHome
            className="top-icon"
            onClick={() => navigate("/machinescreen1")}
            style={{ cursor: "pointer" }}
          />

          {/* Customer Bell */}
          {user?.customer_id
            ? <CustomerBell />
            : <FaBell className="top-icon" />
          }

          {/* Profile Dropdown */}
          <div className="profile-dropdown" ref={profileRef}>
            <FaUserCircle
              className="top-icon"
              style={{ fontSize: '26px' }}
              onClick={() => setShowProfileMenu((prev) => !prev)}
            />
            {showProfileMenu && (
              <div className="dropdown-menu" style={{ display: 'block', background: 'white' }}>
                <div onClick={() => { setShowProfileMenu(false); navigate('/dashboard'); }}>
                  Profile
                </div>
                <div onClick={() => { setShowProfileMenu(false); navigate('/connect'); }}>
                  Connect
                </div>
                <div onClick={handleLogout}>
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navbar — completely unchanged */}
      <div className="navbar-container">
        {screens.map((item, index) => {
          if (index === 2) {
            return (
              <React.Fragment key={item.name}>
                <div className="center-button" onClick={() => navigate('/service-form')}>
                  <FaPlus />
                </div>
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
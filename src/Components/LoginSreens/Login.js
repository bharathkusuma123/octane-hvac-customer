import React, { useState, useRef, useContext } from 'react';
import './Login.css';
import { FaUser, FaLock } from 'react-icons/fa';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import logo from '../../Logos/hvac-logo-new.jpg';
import greenaire from '../../Logos/greenAire.png';
import axios from "axios";
import { AuthContext } from "../AuthContext/AuthContext";
import baseURL from '../ApiUrl/Apiurl';

export default function Login() { 
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const passwordRef = useRef();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);  // Start loader

    try {
      let fcmToken = '';

      if (window.ReactNativeWebView && window.fcmToken) {
        fcmToken = window.fcmToken;
      }

      const response = await axios.post(`${baseURL}/customer-login/`, {
        mobile,
        password,
        fcm_token: fcmToken,
      });

      const loginResponse = {
        status: "success",
        message: "Login successful",
        data: response.data.data
      };

      localStorage.setItem("user", JSON.stringify(loginResponse));

      const user = loginResponse.data;
      localStorage.setItem("userId", user.customer_id || user.delegate_id);
      localStorage.setItem("userMobile", user.mobile);
      localStorage.setItem("userName", user.full_name || user.delegate_name);
      localStorage.setItem("customerType", user.customer_type || "delegate");
      localStorage.setItem("isLoggedIn", "true");

      login(user);

      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify(loginResponse));
      }

      if (user.delegate_id) {
        try {
          const serviceItemsResponse = await axios.get(`${baseURL}/delegate-service-item-tasks/`);
          const allDelegateItems = serviceItemsResponse.data.data || [];

          const userServiceItems = allDelegateItems.filter(
            item => item.delegate === user.delegate_id
          );

          const hasMonitorPermission = userServiceItems.some(
            item => item.can_monitor_equipment === true
          );

          if (hasMonitorPermission) {
            navigate("/delegate-machinescreen1", { state: { userMobile: user.mobile } });
          } else {
            navigate("/delegate-home", { state: { userMobile: user.mobile } });
          }

        } catch (serviceError) {
          console.error("Error fetching service items:", serviceError);
          navigate("/delegate-home", { state: { userMobile: user.mobile } });
        }

      } else {
        navigate("/machinescreen1", { state: { userMobile: user.mobile } });
      }

    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid mobile number or password");
    }

    setIsLoading(false); // Stop loader
  };
   // Function to generate FCM token
  // const generateToken = async () => {
  //   try {
  //     const token = await messaging().getToken(); // Get Firebase FCM token
  //     return token;
  //   } catch (error) {
  //     console.error('Error getting Firebase FCM token:', error);
  //     return '';
  //   }
  // };

// 5-11-2025

//   const handleLogin = async (e) => {
//   e.preventDefault();
//   setError('');

//   try {
//     let fcmToken = '';

//     // ✅ Use Expo-provided token
//     if (window.ReactNativeWebView && window.fcmToken) {
//       fcmToken = window.fcmToken;
//       console.log("Using Expo token:", fcmToken);
//     }

//     const response = await axios.post(`${baseURL}/customer-login/`, {
//       mobile,
//       password,
//       fcm_token: fcmToken,
//     });

//     const user = response.data.data;

//     // Store user data in localStorage
//     localStorage.setItem("userId", user.customer_id || user.delegate_id);
//     localStorage.setItem("userMobile", user.mobile);
//     localStorage.setItem("userName", user.full_name || user.delegate_name);
//     localStorage.setItem("customerType", user.customer_type || "delegate");
//     localStorage.setItem("isLoggedIn", "true");

//     login(user);

//     // Send login message to Expo
//     if (window.ReactNativeWebView) {
//       window.ReactNativeWebView.postMessage(
//         JSON.stringify({ type: 'login', userId: user.customer_id || user.delegate_id })
//       );
//     }

//     // ✅ FIXED: Check if delegate has monitor permissions before navigating
//     if (user.delegate_id) {
//       // We need to fetch the service items to check permissions
//       try {
//         const serviceItemsResponse = await axios.get(`${baseURL}/delegate-service-item-tasks/`);
//         const allDelegateItems = serviceItemsResponse.data.data || [];
//         const userServiceItems = allDelegateItems.filter(
//           item => item.delegate === user.delegate_id
//         );
        
//         // Check if user has any service item with monitor permission
//         const hasMonitorPermission = userServiceItems.some(
//           item => item.can_monitor_equipment === true
//         );

//         console.log("User service items:", userServiceItems);
//         console.log("Has monitor permission:", hasMonitorPermission);

//         // Navigate based on monitor permission
//         if (hasMonitorPermission) {
//           navigate("/delegate-machinescreen1", { state: { userMobile: user.mobile } });
//         } else {
//           navigate("/delegate-home", { state: { userMobile: user.mobile } });
//         }
//       } catch (serviceError) {
//         console.error("Error fetching service items:", serviceError);
//         // Fallback to delegate-home if service items fetch fails
//         navigate("/delegate-home", { state: { userMobile: user.mobile } });
//       }
//     } else {
//       navigate("/machinescreen1", { state: { userMobile: user.mobile } });
//     }

//   } catch (err) {
//     console.error("Login error:", err);
//     setError("Invalid mobile number or password");
//   }
// };

  return (
    <>
      {/* FULL SCREEN LOADER */}
      {isLoading && (
        <div className="fullLoaderOverlay">
          <div className="fullLoader"></div>
        </div>
      )}

      <div className="container">
        <div className="card">
          <div className="logoContainer">
            <img src={logo} alt="AIRO Logo" className="logo" />
          </div>

          <h2 className="welcome">WELCOME BACK!</h2>
          <p className="subtitle">Please login to your account</p>

          <form onSubmit={handleLogin}>
            <div className="inputWrapper">
              <FaUser className="icon" />
              <input
                type="tel"
                placeholder="Enter Mobile Number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') passwordRef.current.focus();
                }}
              />
            </div>

            <div className="inputWrapper">
              <FaLock className="icon" />
              <input
                type={secureText ? 'password' : 'text'}
                placeholder="Enter Password"
                value={password}
                ref={passwordRef}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span onClick={() => setSecureText(!secureText)} className="eyeIcon">
                {secureText ? <FiEye /> : <FiEyeOff />}
              </span>
            </div>

            <div className="checkboxContainer">
              <span className="forgot" onClick={() => navigate('/security')}>Forgot Password?</span>
            </div>

            {error && <p className="errorText">{error}</p>}

            {/* Button (no spinner inside button) */}
            <button 
              type="submit" 
              className="loginButton shadow"
              disabled={isLoading}
            >
              LOGIN
            </button>

            <p className="orText">Or</p>

            <p className="registerText">
              Already purchased a product?{' '}
              <span className="registerLink" onClick={() => navigate('/signup')}>
                Set your password
              </span>
            </p>

            <p className="registerText">
              Not a customer yet?{' '}
              <span className="registerLink" onClick={() => navigate('/contact')}>
                Contact Us
              </span>
            </p>

            <img src={greenaire} alt="Green Aire" className="footerLogo" />
          </form>
        </div>
      </div>
    </>
  );
}

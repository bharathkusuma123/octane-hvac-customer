
import React, { useState, useRef, useContext } from 'react';
import './Login.css';
import { FaUser, FaLock } from 'react-icons/fa';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { FaApple } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import logo from '../../Logos/hvac-logo-new.jpg';
import googleicon from '../../Logos/googleicon.png';
import greenaire from '../../Logos/greenAire.png';
import axios from "axios";
import { AuthContext } from "../AuthContext/AuthContext";
import baseURL from '../ApiUrl/Apiurl';
import  Notification_Url from "../ApiUrl/PushNotificanURL";
import { generateToken } from "../../Firebase/Firebase";

export default function Login() {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [autoLogin, setAutoLogin] = useState(false);
  const [secureText, setSecureText] = useState(true);
   const [error, setError] = useState("");
  const passwordRef = useRef();
  const navigate = useNavigate();
   const { login } = useContext(AuthContext);

const handleLogin = async (e) => {
  e.preventDefault();
  setError('');

  try {
    const fcmToken = await generateToken();

    const response = await axios.post(`${baseURL}/customer-login/`, {
      mobile: mobile,
      password,
      fcm_token: fcmToken || '',
    });

    const user = response.data.data;

    // Store user data in localStorage
    localStorage.setItem("userId", user.customer_id || user.delegate_id); // fallback for delegate
    localStorage.setItem("userMobile", user.mobile);
    localStorage.setItem("userName", user.full_name || user.delegate_name);
    localStorage.setItem("customerType", user.customer_type || "delegate");

    login(user);

    // ✅ Conditional Navigation
    if (user.delegate_id) {
      navigate("/delegate-home", { state: { userMobile: user.mobile } });
    } else {
      navigate("/home", { state: { userMobile: user.mobile } });
            // navigate("/machinescreen1", { state: { userMobile: user.mobile } });

    }

    console.log("User data from API:", user);

    if (fcmToken) {
      try {
        const notifyResponse = await fetch(`${Notification_Url}/send-notification`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: fcmToken,
            title: 'Welcome to Octane!',
            body: 'You have successfully logged in.',
          }),
        });

        const notifyData = await notifyResponse.json();

        if (notifyResponse.ok) {
          console.log('Notification sent successfully:', notifyData);
        } else {
          console.error('Failed to send notification:', notifyData);
        }
      } catch (notifyError) {
        console.error('Error sending notification:', notifyError);
      }
    }

  } catch (err) {
    console.error("Login error:", err);
    setError("Invalid mobile number or password");
  }
};






  return (
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
            <label className="switchLabel">
              <input
                type="checkbox"
                checked={autoLogin}
                onChange={(e) => setAutoLogin(e.target.checked)}
              />
              <span className="label">Auto Login</span>
            </label>
            <span className="forgot" onClick={() => navigate('/security')}>Forgot Password/Pin?</span>
          </div>

          <button type="submit" className="loginButton shadow">LOGIN</button>

          <button type="button" className="socialButton">
            <img src={googleicon} alt="Google Icon" className="socialIcon" />
            <span className="socialText">Login with Google ID</span>
          </button>

          <button className="socialButton black">
            <FaApple className="socialIcon" color="#fff" />
            <span className="socialText white">Login with Apple ID</span>
          </button>

          <p className="orText">Or</p>
          <p className="registerText">
            Don’t have an account?{' '}
            <span className="registerLink" onClick={() => navigate('/signup')}>Register</span>
          </p>

          <img src={greenaire} alt="Green Aire" className="footerLogo" />
        </form>
      </div>
    </div>
  );
}
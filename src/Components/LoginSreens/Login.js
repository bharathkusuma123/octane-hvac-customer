
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

  try {
    const response = await axios.post(`${baseURL}/customer-login/`, {
      mobile: mobile,
      password,
    });

    const user = response.data.data;

    // localStorage.setItem("userRole", "customer");
    localStorage.setItem("userId", user.customer_id);
    localStorage.setItem("userMobile", user.mobile);
    localStorage.setItem("userName", user.full_name);
    localStorage.setItem("customerType", user.customer_type);

    login(user); // Optional if you use context

    // Navigate to dashboard
    navigate("/dashboard", { state: { userMobile: user.mobile } });

    console.log("User data from API:", user);
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
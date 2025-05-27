// import React, { useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";

// const LoginScreen = () => {
//   const [mobile, setMobile] = useState("");
//   const [password, setPassword] = useState("");
//   const [rememberMe, setRememberMe] = useState(false);
//   const navigate = useNavigate();
//   const passwordRef = useRef();

//   const handleLogin = (e) => {
//     e.preventDefault();
//     if (mobile === "9876543210" && password === "password") {
//       navigate("/nav");
//     } else {
//       alert("Login Failed: Invalid mobile number or password");
//     }
//   };

//   const handleForgotPassword = () => {
//     navigate("/security");
//   };

//   const handleSignUp = () => {
//     navigate("/signup");
//   };

//   return (
//     <div className="container d-flex justify-content-center align-items-center vh-100">
//       <div className="card p-4 shadow" style={{ maxWidth: "400px", width: "100%" }}>
//         <div className="text-center mb-3">
//           <img
//      src={require("../../Logos/hvac-logo-new.jpg")}            alt="HVAC Logo"
//             className="img-fluid"
//             style={{ maxHeight: "60px" }}
//           />
//         </div>
//         <h3 className="text-center mb-4">Welcome Back</h3>

//         <form onSubmit={handleLogin}>
//           <div className="mb-3">
//             <input
//               type="tel"
//               className="form-control"
//               placeholder="Enter Mobile Number"
//               value={mobile}
//               onChange={(e) => setMobile(e.target.value)}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") passwordRef.current.focus();
//               }}
//             />
//           </div>

//           <div className="mb-3">
//             <input
//               type="password"
//               className="form-control"
//               placeholder="Enter Password"
//               value={password}
//               ref={passwordRef}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </div>

//           <div className="form-check mb-3">
//             <input
//               type="checkbox"
//               className="form-check-input"
//               id="rememberMe"
//               checked={rememberMe}
//               onChange={(e) => setRememberMe(e.target.checked)}
//             />
//             <label className="form-check-label" htmlFor="rememberMe">
//               Remember Me
//             </label>
//           </div>

//           <button type="submit" className="btn btn-primary w-100">
//             Login
//           </button>

//           <div className="text-center mt-3">
//             <button
//               type="button"
//               className="btn btn-link"
//               onClick={handleForgotPassword}
//               style={{ color: "#007BFF" }}
//             >
//               Forgot Password?
//             </button>
//           </div>

//           <div className="text-center mt-3">
//             <span>If You're New Customer? </span>
//             <button
//               type="button"
//               className="btn btn-link p-0"
//               onClick={handleSignUp}
//               style={{ textDecoration: "none", color: "#007BFF" }}
//             >
//               Sign Up
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default LoginScreen;









// import React, { useState, useRef } from 'react';
// import './Login.css';
// import { FaUser, FaLock } from 'react-icons/fa';
// import { FiEye, FiEyeOff } from 'react-icons/fi';
// import { FaApple } from 'react-icons/fa';

// import { useNavigate } from 'react-router-dom';
// import logo from '../../Logos/hvac-logo-new.jpg';
// import googleicon from '../../Logos/googleicon.png';
// import greenaire from '../../Logos/greenAire.png';

// export default function Login() {
//   const [mobile, setMobile] = useState('');
//   const [password, setPassword] = useState('');
//   const [autoLogin, setAutoLogin] = useState(false);
//   const [secureText, setSecureText] = useState(true);
//   const passwordRef = useRef();
//   const navigate = useNavigate();

//   const handleLogin = (e) => {
//     e.preventDefault();
//     if (mobile === '9876543210' && password === 'password') {
//       navigate('/nav');
//     } else {
//       alert('Login Failed: Invalid mobile number or password');
//     }
//   };

//   return (
//     <div className="container">
//       <div className="card">
//         <div className="logoContainer">
//           <img src={logo} alt="AIRO Logo" className="logo" />
//         </div>
//         <h2 className="welcome">WELCOME BACK!</h2>
//         <p className="subtitle">Please login to your account</p>

//         <form onSubmit={handleLogin}>
//           <div className="inputWrapper">
//             <FaUser className="icon" />
//             <input
//               type="tel"
//               placeholder="Enter Mobile Number"
//               value={mobile}
//               onChange={(e) => setMobile(e.target.value)}
//               onKeyDown={(e) => {
//                 if (e.key === 'Enter') passwordRef.current.focus();
//               }}
//             />
//           </div>

//           <div className="inputWrapper">
//             <FaLock className="icon" />
//             <input
//               type={secureText ? 'password' : 'text'}
//               placeholder="Enter Password"
//               value={password}
//               ref={passwordRef}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//             <span onClick={() => setSecureText(!secureText)} className="eyeIcon">
//               {secureText ? <FiEye /> : <FiEyeOff />}
//             </span>
//           </div>

//           <div className="checkboxContainer">
//             <label className="switchLabel">
//               <input
//                 type="checkbox"
//                 checked={autoLogin}
//                 onChange={(e) => setAutoLogin(e.target.checked)}
//               />
//               <span className="label">Auto Login</span>
//             </label>
//             <span className="forgot" onClick={() => navigate('/security')}>Forgot Password/Pin?</span>
//           </div>

//           <button type="submit" className="loginButton shadow">LOGIN</button>

//           <button type="button" className="socialButton">
//             <img src={googleicon} alt="Google Icon" className="socialIcon" />
//             <span className="socialText">Login with Google ID</span>
//           </button>

//            <button className="socialButton black">
//           <FaApple className="socialIcon" color="#fff" />
//           <span className="socialText white">Login with Apple ID</span>
//         </button>

//           <p className="orText">Or</p>
//           <p className="registerText">
//             Don’t have an account?{' '}
//             <span className="registerLink" onClick={() => navigate('/signup')}>Register</span>
//           </p>

//           <img src={greenaire} alt="Green Aire" className="footerLogo" />
//         </form>
//       </div>
//     </div>
//   );
// }



import React, { useState, useRef } from 'react';
import './Login.css';
import { FaUser, FaLock } from 'react-icons/fa';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { FaApple } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import logo from '../../Logos/hvac-logo-new.jpg';
import googleicon from '../../Logos/googleicon.png';
import greenaire from '../../Logos/greenAire.png';
import axios from "axios";

export default function Login() {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [autoLogin, setAutoLogin] = useState(false);
  const [secureText, setSecureText] = useState(true);
   const [error, setError] = useState("");
  const passwordRef = useRef();
  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();

 try {
      
      const response = await axios.post("http://175.29.21.7:8006/login/", {
        mobile_no: mobile,   
        password,
      });

      const user = response.data.data;

      if (user.role === "Customer") {
        localStorage.setItem("userRole", "customer");
        
        navigate("/customer-dashboard");
      } else {
        setError("User is not an Customer");
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
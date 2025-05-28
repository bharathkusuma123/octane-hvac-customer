// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { FaArrowLeft } from "react-icons/fa";

// const SetPasswordScreen = () => {
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // TODO: Validate passwords here (e.g., match, length)
//     navigate("/"); // Navigate to login page
//   };

//   return (
//     <div className="container d-flex justify-content-center align-items-center py-5" style={{ minHeight: "100vh" }}>
//       <div className="card p-4 shadow position-relative" style={{ maxWidth: "500px", width: "100%" }}>
//         {/* Back Button */}
//         <button
//           className="btn btn-link position-absolute"
//           style={{ top: "15px", left: "15px" }}
//           onClick={() => navigate(-1)}
//         >
//           <FaArrowLeft size={20} color="#333" />
//         </button>

//         {/* Logo */}
//         <div className="text-center mb-3">
//           <img
//             src={require("../../Logos/hvac-logo-new.jpg")}
//             alt="HVAC Logo"
//             style={{ maxWidth: "150px", height: "auto" }}
//           />
//         </div>

//         <h4 className="text-center mb-4">Set New Password</h4>

//         <form onSubmit={handleSubmit}>
//           <div className="mb-3">
//             <input
//               type="password"
//               className="form-control"
//               placeholder="Enter Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>

//           <div className="mb-4">
//             <input
//               type="password"
//               className="form-control"
//               placeholder="Confirm Password"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               required
//             />
//           </div>

//           <button type="submit" className="btn btn-primary w-100">
//             Submit
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SetPasswordScreen;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaLock } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";
import logo from "../../Logos/hvac-logo-new.jpg";
import "./SetPasswordScreen.css";

const SetPasswordScreen = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    navigate("/"); // Go to login page
  };

  return (
    <div className="setpass-container">
      <div className="setpass-card">
        <button className="setpass-back-button" onClick={() => navigate(-1)}>
          <FaArrowLeft size={20} />
        </button>

        <div className="setpass-logo-container">
          <img src={logo} alt="HVAC Logo" className="setpass-logo" />
        </div>

        <h4 className="setpass-title">Set New Password</h4>

        <form onSubmit={handleSubmit}>
          {/* Password Field */}
          <div className="set-input-wrapper">
            <FaLock className="input-icon-inside" />
            <input
              type={showPassword ? "text" : "password"}
              className="pass-input"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          {/* Confirm Password Field */}
          <div className="set-input-wrapper">
            <FaLock className="input-icon-inside" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="pass-input"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span
              className="eye-icon"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            >
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          <button type="submit" className="setpass-submit-button shadow">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetPasswordScreen;


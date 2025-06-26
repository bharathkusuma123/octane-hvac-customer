import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import logo from "../../Logos/hvac-logo-new.jpg";
import "./OTPVerificationScreen.css";

const OTPVerificationScreen = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/set-sign-password");
  };

  return (
    <div className="otp-container">
      <div className="otp-card">
        <button className="otp-back-button" onClick={() => navigate(-1)}>
          <FaArrowLeft size={20} />
        </button>

        <div className="otp-logo-container">
          <img src={logo} alt="HVAC Logo" className="otp-logo" />
        </div>

        <h4 className="otp-title">OTP Verification</h4>

        <form onSubmit={handleSubmit}>
          <div className="otp-input-wrapper">
            <i className="bi bi-shield-lock-fill input-icon-inside"></i>
            <input
              type="text"
              className="otp-input"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              required
            />
          </div>

          <button type="submit" className="otp-submit-button shadow">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default OTPVerificationScreen;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaArrowLeft } from "react-icons/fa";

const OTPVerificationScreen = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/setpassword"); // adjust route as needed
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow position-relative" style={{ maxWidth: "400px", width: "100%" }}>
        {/* Back Button */}
        <button
          className="btn btn-link position-absolute"
          style={{ top: "15px", left: "15px" }}
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft size={20} color="#333" />
        </button>

        {/* Logo */}
        <div className="text-center mb-3">
          <img
            src={require("../../Logos/hvac-logo-new.jpg")}
            alt="HVAC Logo"
            style={{ maxWidth: "150px", height: "auto" }}
          />
        </div>

        <h4 className="text-center mb-3">OTP Verification</h4>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control text-center"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default OTPVerificationScreen;

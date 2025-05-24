import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaArrowLeft } from "react-icons/fa";

const SetPasswordScreen = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Validate passwords here (e.g., match, length)
    navigate("/"); // Navigate to login page
  };

  return (
    <div className="container d-flex justify-content-center align-items-center py-5" style={{ minHeight: "100vh" }}>
      <div className="card p-4 shadow position-relative" style={{ maxWidth: "500px", width: "100%" }}>
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

        <h4 className="text-center mb-4">Set New Password</h4>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <input
              type="password"
              className="form-control"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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

export default SetPasswordScreen;

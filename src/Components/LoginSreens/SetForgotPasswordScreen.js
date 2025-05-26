import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import logo from "../../Logos/hvac-logo-new.jpg"; // Ensure this path is correct

const SetPasswordScreen = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Password validation logic here (if needed)
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    navigate("/");
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 position-relative shadow" style={{ width: "100%", maxWidth: "400px" }}>
        
        {/* Back Button */}
        <button 
          className="btn btn-link position-absolute top-0 start-0 m-2 text-dark"
          onClick={() => navigate(-1)}
        >
          <i className="bi bi-arrow-left" style={{ fontSize: "1.2rem" }}></i>
        </button>

        <div className="text-center mb-4">
          <img src={logo} alt="Logo" className="img-fluid mb-2" style={{ height: 80 }} />
          <h4 className="fw-bold">Set New Password</h4>
        </div>

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

          <div className="mb-3">
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

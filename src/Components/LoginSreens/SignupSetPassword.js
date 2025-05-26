import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaLock } from "react-icons/fa";
import logo from "../../Logos/hvac-logo-new.jpg";
import "./SignupSetPassword.css";

const SignupSetPassword = () => {
  const [q1, setQ1] = useState("pet");
  const [q2, setQ2] = useState("school");
  const [a1, setA1] = useState("");
  const [a2, setA2] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const a2InputRef = useRef(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Submit logic here (e.g., save to Firebase or API)
    navigate("/"); // Navigate to login or home page
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <button className="signup-back-button" onClick={() => navigate(-1)}>
          <FaArrowLeft size={20} />
        </button>

        <div className="signup-logo-container">
          <img src={logo} alt="HVAC Logo" className="signup-logo" />
        </div>

        <h4 className="signup-title">Security Questions</h4>

        <form onSubmit={handleSubmit}>
          <label className="signup-label">Security Question 1</label>
          <select className="signup-select" value={q1} onChange={(e) => setQ1(e.target.value)}>
            <option value="pet">What is your pet's name?</option>
            <option value="birthplace">What is your birthplace?</option>
          </select>

          <input
            type="text"
            className="signup-input"
            placeholder="Answer"
            value={a1}
            onChange={(e) => setA1(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                a2InputRef.current?.focus();
              }
            }}
          />

          <label className="signup-label mt-3">Security Question 2</label>
          <select className="signup-select" value={q2} onChange={(e) => setQ2(e.target.value)}>
            <option value="school">What is your school name?</option>
            <option value="mother">What is your mother's maiden name?</option>
          </select>

          <input
            type="text"
            className="signup-input"
            placeholder="Answer"
            value={a2}
            onChange={(e) => setA2(e.target.value)}
            ref={a2InputRef}
          />

          <h4 className="signup-title mt-4">Set New Password</h4>

          {/* Password Field */}
          <div className="mb-3 position-relative">
            <FaLock className="position-absolute input-icon-global" />
            <input
              type="password"
              className="form-control ps-5 signup-input"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Confirm Password Field */}
          <div className="mb-3 position-relative">
            <FaLock className="position-absolute input-icon-global" />
            <input
              type="password"
              className="form-control ps-5 signup-input"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="sign-submit-button shadow">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupSetPassword;

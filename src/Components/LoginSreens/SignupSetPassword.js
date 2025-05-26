import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaLock } from "react-icons/fa";

import logo from "../../Logos/hvac-logo-new.jpg";
import "./SecurityQuestionsScreen.css"; // Keep this
import "./SetPasswordScreen.css"; // Import the password field styles

const SecurityQuestionsScreen = () => {
  const [q1, setQ1] = useState("pet");
  const [q2, setQ2] = useState("school");
  const [a1, setA1] = useState("");
  const [a2, setA2] = useState("");
  const a2InputRef = useRef(null);
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    navigate("/"); // Navigate to login page
  };

  return (
    <div className="security-container">
      <div className="security-card">
        <button className="security-back-button" onClick={() => navigate(-1)}>
          <FaArrowLeft size={20} />
        </button>

        <div className="security-logo-container">
          <img src={logo} alt="HVAC Logo" className="security-logo" />
        </div>

        <h4 className="security-title">Security Questions</h4>

        <form onSubmit={handleSubmit}>
          <label className="security-label">Security Question 1</label>
          <select
            className="security-select"
            value={q1}
            onChange={(e) => setQ1(e.target.value)}
          >
            <option value="pet">What is your pet's name?</option>
            <option value="birthplace">What is your birthplace?</option>
          </select>

          <input
            type="text"
            className="security-input"
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

          <label className="security-label mt-3">Security Question 2</label>
          <select
            className="security-select"
            value={q2}
            onChange={(e) => setQ2(e.target.value)}
          >
            <option value="school">What is your school name?</option>
            <option value="mother">What is your mother's maiden name?</option>
          </select>

          <input
            type="text"
            className="security-input"
            placeholder="Answer"
            value={a2}
            onChange={(e) => setA2(e.target.value)}
            ref={a2InputRef}
          />

          <hr />

          {/* Add password fields from SetPasswordScreen */}
          <h5 className="security-label mt-3">Set Your Password</h5>

          <div className="set-input-wrapper">
            <FaLock className="input-icon-inside" />
            <input
              type="password"
              className="pass-input"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="set-input-wrapper">
            <FaLock className="input-icon-inside" />
            <input
              type="password"
              className="pass-input"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="setpass-submit-button shadow mt-3">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default SecurityQuestionsScreen;

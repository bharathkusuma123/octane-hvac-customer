import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../Logos/hvac-logo-new.jpg";
import { FaArrowLeft } from "react-icons/fa";
import "./SignUpScreen.css";

const SignUpScreen = () => {
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleMobileChange = (e) => {
    const value = e.target.value;
    // Allow only digits and max 10 characters
    if (/^\d{0,10}$/.test(value)) {
      setMobile(value);
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (mobile.length !== 10) {
    alert("Mobile number must be exactly 10 digits.");
    return;
  }

  setLoading(true);
  try {
    const response = await fetch("http://175.29.21.7:8006/customers/");
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    const result = await response.json();
    const users = result.data || [];

    const matchedUser = users.find(
      (user) =>
        user.mobile === mobile &&
        user.email.toLowerCase() === email.toLowerCase()
    );

    if (matchedUser) {
      navigate("/customer-data", { state: { user: matchedUser } });
    } else {
      alert("No matching customer found with provided mobile and email.");
    }
  } catch (error) {
    alert("Error checking user details. Please try again later.");
    console.error("Error fetching users:", error);
  }
  setLoading(false);
};

  return (
    <div className="signup-container">
      <div className="signup-card">
        <button className="otp-back-button" onClick={() => navigate(-1)}>
          <FaArrowLeft size={20} />
        </button>

        <div className="signup-logo-container">
          <img src={logo} alt="Logo" className="signup-logo" />
          <h3 className="signup-title">Sign Up</h3>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="signup-input-wrapper">
            <i className="bi bi-telephone-fill input-icon"></i>
            <input
              type="tel"
              className="sign-input"
              placeholder="Enter Mobile Number"
              value={mobile}
              onChange={handleMobileChange}
              required
            />
          </div>

          <div className="signup-input-wrapper">
            <i className="bi bi-envelope-fill input-icon"></i>
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              className="sign-input"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="sign-submit-button shadow" disabled={loading}>
            {loading ? "Checking..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpScreen;

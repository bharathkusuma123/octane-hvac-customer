import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../Logos/hvac-logo-new.jpg";
import { FaArrowLeft } from "react-icons/fa";
import "./SignUpScreen.css";
import baseURL from "../ApiUrl/Apiurl";

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
    const response = await fetch(`${baseURL}/customer-signup/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mobile, email }),
    });

    const result = await response.json();
    console.log("API Response:", result);

    if (response.ok) {
      if (result.redirect === "otp-verification" && result.delegate_id && result.company_id) {
        // Delegate found - redirect with delegate data
        const user = {
          delegate_id: result.delegate_id,
          company_id: result.company_id,
          mobile,
          email,
          isDelegate: true,
        };
        navigate("/delegate-data", { state: { user } });

      } else if (result.customer_id && result.company_id) {
        // Customer found - redirect with customer data
        const user = {
          customer_id: result.customer_id,
          company_id: result.company_id,
          mobile,
          email,
          isDelegate: false,
        };
        navigate("/customer-data", { state: { user } });

      } else {
        alert(result.message || "No matching customer or delegate found.");
      }
    } else {
      alert(result.message || "Something went wrong.");
    }
  } catch (error) {
    alert("Error checking user details.");
    console.error("Error during user verification:", error);
  } finally {
    setLoading(false);
  }
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
              placeholder="Enter Email (optional)"
              value={email}
              className="sign-input"
              onChange={(e) => setEmail(e.target.value)}
              // required
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

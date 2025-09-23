import React from "react";
import { useNavigate } from "react-router-dom";
import "./Contact.css";

export default function Contact() {
  const navigate = useNavigate();

  return (
    <div className="contact-container">
      <div className="contact-card">
        <h2 className="contact-title">Welcome to GreenAire</h2>
        
        <div className="welcome-section">
          <p className="welcome-text">
            Thank you for downloading our application.
            As a leading provider of sustainable and innovative air conditioning solutions, 
            we are dedicated to delivering comfort, efficiency, and reliability.
          </p>
        </div>

        <div className="info-section">
          <h3 className="info-title">For more information, please visit:</h3>
          <p className="contact-text">
            <a
              href="https://www.greenaireint.com"
              target="_blank"
              rel="noreferrer"
              className="contact-link"
            >
              www.greenaireint.com
            </a>
          </p>
        </div>

        <div className="contact-section">
          <h3 className="info-title">For inquiries, contact us at:</h3>
          <p className="contact-text">
            📞 <a href="tel:+966138120077" className="contact-link">
              +966 13 8120077
            </a>
          </p>
          <p className="contact-text">
            ✉ <a href="mailto:info@greenaireint.com" className="contact-link">
              info@greenaireint.com
            </a>
          </p>
        </div>

        <button className="contact-back-btn" onClick={() => navigate("/")}>
          ⬅ Back to Login
        </button>
      </div>
    </div>
  );
}
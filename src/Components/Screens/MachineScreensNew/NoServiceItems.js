// components/NoServiceItems.js
import React from "react";
import { FiLogOut } from "react-icons/fi";
import AIROlogo from "./Images/AIRO.png";
import greenAire from "./Images/greenAire.png";

const NoServiceItems = ({ onLogout, onNavigateHome }) => {
  return (
    <div className="mainmain-container" style={{
      backgroundImage: "linear-gradient(to bottom, #3E99ED, #2B7ED6)",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
      textAlign: "center"
    }}>
      <div className="logo">
        <img
          src={AIROlogo}
          alt="AIRO Logo"
          className="logo-image"
          style={{ marginBottom: "20px" }}
        />
      </div>
      
      <div style={{
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        padding: "40px",
        borderRadius: "12px",
        maxWidth: "500px",
        width: "100%"
      }}>
        <h2 style={{ color: "white", marginBottom: "20px", fontSize: "24px" }}>
          No Machines Assigned
        </h2>
        <p style={{ color: "white", marginBottom: "30px", fontSize: "16px", lineHeight: "1.5" }}>
          You don't have any machines assigned to your account yet. 
          Please wait until a machine is assigned to you, or contact your administrator.
        </p>
        
        <div style={{ display: "flex", gap: "15px", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={onLogout}
            style={{
              padding: "12px 24px",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              color: "white",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <FiLogOut size={18} />
            Logout
          </button>
          <button
            onClick={onNavigateHome}
            style={{
              padding: "12px 24px",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              color: "white",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <FiLogOut size={18} />
            Go to Home
          </button>
        </div>
      </div>
      
      <div className="footer-logo" style={{ marginTop: "40px" }}>
        <img src={greenAire} alt="GreenAire Logo" className="logo-image" style={{background:'white'}} />
      </div>
    </div>
  );
};

export default NoServiceItems;
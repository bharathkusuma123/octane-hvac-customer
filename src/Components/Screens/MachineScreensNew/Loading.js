// components/Loading.js
import React from "react";
import { FiLogOut } from "react-icons/fi";

const Loading = ({ onLogout }) => {
  return (
    <div
      className="mainmain-container"
      style={{
        backgroundImage: "linear-gradient(to bottom, #3E99ED, #2B7ED6)",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        color: "white",
      }}
    >
      <div
        className="loading"
        style={{ color: "white", fontSize: "18px", marginBottom: "20px", gap: "10%" }}
      >
        Loading...
        <button
          onClick={onLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            color: "white",
            border: "1px solid white",
            borderRadius: "8px",
            padding: "8px 16px",
            cursor: "pointer",
            fontSize: "16px",
            transition: "0.3s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.25)")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.15)")}
        >
          <FiLogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Loading;
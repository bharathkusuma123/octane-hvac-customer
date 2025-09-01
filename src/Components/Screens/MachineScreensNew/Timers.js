import React from "react";
import { useNavigate } from "react-router-dom";

const Timers = () => {
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light text-center p-3">
      {/* Title */}
      <h1 className="fw-bold mb-4">Timers</h1>

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="btn btn-primary px-4 py-2"
      >
        Back
      </button>
    </div>
  );
};

export default Timers;

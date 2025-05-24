import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaArrowLeft } from "react-icons/fa";

const SecurityQuestionsScreen = () => {
  const [q1, setQ1] = useState("pet");
  const [q2, setQ2] = useState("school");
  const [a1, setA1] = useState("");
  const [a2, setA2] = useState("");
  const navigate = useNavigate();
  const a2InputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/set-forgot-password"); // Adjust route as needed
  };

  return (
    <div className="container d-flex justify-content-center align-items-center py-4" style={{ minHeight: "100vh" }}>
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

        <h4 className="text-center mb-4">Security Questions</h4>

        <form onSubmit={handleSubmit}>
          {/* Question 1 */}
          <label className="form-label fw-semibold">Security Question 1</label>
          <select className="form-select mb-2" value={q1} onChange={(e) => setQ1(e.target.value)}>
            <option value="pet">What is your pet's name?</option>
            <option value="birthplace">What is your birthplace?</option>
          </select>

          <input
            type="text"
            className="form-control mb-3"
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

          {/* Question 2 */}
          <label className="form-label fw-semibold">Security Question 2</label>
          <select className="form-select mb-2" value={q2} onChange={(e) => setQ2(e.target.value)}>
            <option value="school">What is your school name?</option>
            <option value="mother">What is your mother's maiden name?</option>
          </select>

          <input
            type="text"
            className="form-control mb-4"
            placeholder="Answer"
            value={a2}
            onChange={(e) => setA2(e.target.value)}
            ref={a2InputRef}
          />

          <button type="submit" className="btn btn-primary w-100">
            Next
          </button>
        </form>
      </div>
    </div>
  );
};

export default SecurityQuestionsScreen;

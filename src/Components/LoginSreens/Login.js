import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const LoginScreen = () => {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const passwordRef = useRef();

  const handleLogin = (e) => {
    e.preventDefault();
    if (mobile === "9876543210" && password === "password") {
      navigate("/nav");
    } else {
      alert("Login Failed: Invalid mobile number or password");
    }
  };

  const handleForgotPassword = () => {
    navigate("/security");
  };

  const handleSignUp = () => {
    navigate("/signup");
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ maxWidth: "400px", width: "100%" }}>
        <div className="text-center mb-3">
          <img
     src={require("../../Logos/hvac-logo-new.jpg")}            alt="HVAC Logo"
            className="img-fluid"
            style={{ maxHeight: "60px" }}
          />
        </div>
        <h3 className="text-center mb-4">Welcome Back</h3>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <input
              type="tel"
              className="form-control"
              placeholder="Enter Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") passwordRef.current.focus();
              }}
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Enter Password"
              value={password}
              ref={passwordRef}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-check mb-3">
            <input
              type="checkbox"
              className="form-check-input"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="rememberMe">
              Remember Me
            </label>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>

          <div className="text-center mt-3">
            <button
              type="button"
              className="btn btn-link"
              onClick={handleForgotPassword}
              style={{ color: "#007BFF" }}
            >
              Forgot Password?
            </button>
          </div>

          <div className="text-center mt-3">
            <span>If You're New Customer? </span>
            <button
              type="button"
              className="btn btn-link p-0"
              onClick={handleSignUp}
              style={{ textDecoration: "none", color: "#007BFF" }}
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;

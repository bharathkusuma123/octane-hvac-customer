import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSendCode = (e) => {
    e.preventDefault();
    alert(`A recovery code was sent to ${email}`);
    navigate(-1); // goBack equivalent
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ maxWidth: "400px", width: "100%" }}>
        <h3 className="text-center mb-4">Forgot Password</h3>
        <form onSubmit={handleSendCode}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Send Recovery Code
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordScreen;

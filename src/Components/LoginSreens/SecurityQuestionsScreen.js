// import React, { useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { FaArrowLeft } from "react-icons/fa";

// const SecurityQuestionsScreen = () => {
//   const [q1, setQ1] = useState("pet");
//   const [q2, setQ2] = useState("school");
//   const [a1, setA1] = useState("");
//   const [a2, setA2] = useState("");
//   const navigate = useNavigate();
//   const a2InputRef = useRef(null);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     navigate("/set-forgot-password"); // Adjust route as needed
//   };

//   return (
//     <div className="container d-flex justify-content-center align-items-center py-4" style={{ minHeight: "100vh" }}>
//       <div className="card p-4 shadow position-relative" style={{ maxWidth: "500px", width: "100%" }}>
//         {/* Back Button */}
//         <button
//           className="btn btn-link position-absolute"
//           style={{ top: "15px", left: "15px" }}
//           onClick={() => navigate(-1)}
//         >
//           <FaArrowLeft size={20} color="#333" />
//         </button>

//         {/* Logo */}
//         <div className="text-center mb-3">
//           <img
//             src={require("../../Logos/hvac-logo-new.jpg")}
//             alt="HVAC Logo"
//             style={{ maxWidth: "150px", height: "auto" }}
//           />
//         </div>

//         <h4 className="text-center mb-4">Security Questions</h4>

//         <form onSubmit={handleSubmit}>
//           {/* Question 1 */}
//           <label className="form-label fw-semibold">Security Question 1</label>
//           <select className="form-select mb-2" value={q1} onChange={(e) => setQ1(e.target.value)}>
//             <option value="pet">What is your pet's name?</option>
//             <option value="birthplace">What is your birthplace?</option>
//           </select>

//           <input
//             type="text"
//             className="form-control mb-3"
//             placeholder="Answer"
//             value={a1}
//             onChange={(e) => setA1(e.target.value)}
//             onKeyDown={(e) => {
//               if (e.key === "Enter") {
//                 e.preventDefault();
//                 a2InputRef.current?.focus();
//               }
//             }}
//           />

//           {/* Question 2 */}
//           <label className="form-label fw-semibold">Security Question 2</label>
//           <select className="form-select mb-2" value={q2} onChange={(e) => setQ2(e.target.value)}>
//             <option value="school">What is your school name?</option>
//             <option value="mother">What is your mother's maiden name?</option>
//           </select>

//           <input
//             type="text"
//             className="form-control mb-4"
//             placeholder="Answer"
//             value={a2}
//             onChange={(e) => setA2(e.target.value)}
//             ref={a2InputRef}
//           />

//           <button type="submit" className="btn btn-primary w-100">
//             Next
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SecurityQuestionsScreen;





//===============================================================================================================================




// import React, { useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaArrowLeft } from "react-icons/fa";
// import logo from "../../Logos/hvac-logo-new.jpg";
// import "./SecurityQuestionsScreen.css";

// const SecurityQuestionsScreen = () => {
//   const [q1, setQ1] = useState("pet");
//   const [q2, setQ2] = useState("school");
//   const [a1, setA1] = useState("");
//   const [a2, setA2] = useState("");
//   const a2InputRef = useRef(null);
//   const navigate = useNavigate();

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     navigate("/setpassword"); // Navigate to next screen
//   };

//   return (
//     <div className="security-container">
//       <div className="security-card">
//         <button className="security-back-button" onClick={() => navigate(-1)}>
//           <FaArrowLeft size={20} />
//         </button>

//         <div className="security-logo-container">
//           <img src={logo} alt="HVAC Logo" className="security-logo" />
//         </div>

//         <h4 className="security-title">Security Questions</h4>

//         <form onSubmit={handleSubmit}>
//           <label className="security-label">Security Question 1</label>
//           <select className="security-select" value={q1} onChange={(e) => setQ1(e.target.value)}>
//             <option value="pet">What is your pet's name?</option>
//             <option value="birthplace">What is your birthplace?</option>
//           </select>

//           <input
//             type="text"
//             className="security-input"
//             placeholder="Answer"
//             value={a1}
//             onChange={(e) => setA1(e.target.value)}
//             onKeyDown={(e) => {
//               if (e.key === "Enter") {
//                 e.preventDefault();
//                 a2InputRef.current?.focus();
//               }
//             }}
//           />

//           <label className="security-label mt-3">Security Question 2</label>
//           <select className="security-select" value={q2} onChange={(e) => setQ2(e.target.value)}>
//             <option value="school">What is your school name?</option>
//             <option value="mother">What is your mother's maiden name?</option>
//           </select>

//           <input
//             type="text"
//             className="security-input"
//             placeholder="Answer"
//             value={a2}
//             onChange={(e) => setA2(e.target.value)}
//             ref={a2InputRef}
//           />

//           <button type="submit" className="security-submit-button shadow mt-4">
//             Next
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SecurityQuestionsScreen;








import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaLock } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Swal from "sweetalert2";

import "./SecurityQuestionsScreen.css";
import logo from "../../Logos/hvac-logo-new.jpg";
import baseURL from "../ApiUrl/Apiurl";

const SECURITY_QUESTION_CHOICES = [
  "What is your mother’s maiden name?",
  "What was the name of your first pet?",
  "What was your first car?",
  "What is the name of the town where you were born?",
  "What was your childhood nickname?",
];

const SecurityQuestionsScreen = () => {
  const [mobile, setMobile] = useState("");
  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
  const [a1, setA1] = useState("");
  const [a2, setA2] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const a2InputRef = useRef(null);
  const navigate = useNavigate();

 const handleSubmit = async (e) => {
  e.preventDefault();

  console.log("🔐 Forgot Password Submit Triggered");

  // ✅ Basic validation
  if (!mobile || !q1 || !q2 || !a1 || !a2 || !newPassword) {
    console.warn("⚠️ Missing required fields");

    Swal.fire({
      icon: "warning",
      title: "Incomplete Form",
      text: "Please fill in all fields.",
    });
    return;
  }

  if (q1 === q2) {
    console.warn("⚠️ Same security questions selected", { q1, q2 });

    Swal.fire({
      icon: "error",
      title: "Invalid Questions",
      text: "Please select two different security questions.",
    });
    return;
  }

  const payload = {
    mobile,
    security_question1: q1,
    answer1: a1,
    security_question2: q2,
    answer2: a2,
    new_password: newPassword,
  };

  console.log("📤 Forgot password request payload", {
    ...payload,
    new_password: "******",
  });

  try {
    const response = await fetch(`${baseURL}/customer-forgot-password/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log("📡 Response Status:", response.status);

    const result = await response.json();
    console.log("📥 Response Body:", result);

    // ❌ HANDLE BACKEND ERRORS PROPERLY
    if (!response.ok) {
      let errorMessage = "Please check your details and try again.";

      if (result?.error) {
        // Security answers mismatch
        errorMessage = result.error;
      } 
      else if (result?.new_password && Array.isArray(result.new_password)) {
        // Password validation error
        errorMessage = result.new_password[0];
      }

      console.error("❌ Password reset failed:", result);

      Swal.fire({
        icon: "error",
        title: "Reset Failed",
        text: errorMessage,
      });

      return;
    }

    // ✅ SUCCESS
    console.log("✅ Password reset successful for mobile:", mobile);

    Swal.fire({
      icon: "success",
      title: "Success",
      text: "Password reset successfully!",
    }).then(() => navigate("/"));

  } catch (err) {
    console.error("🚨 Forgot password request crashed", err);

    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Something went wrong. Please try again later.",
    });
  }
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

        <h4 className="security-title">Forgot Password</h4>

        <form onSubmit={handleSubmit}>
          <input
            type="tel"
            className="security-input"
            placeholder="Enter your registered mobile"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
          />

          <label className="security-label">Security Question 1</label>
          <select
            className="security-select"
            value={q1}
            onChange={(e) => setQ1(e.target.value)}
            required
          >
            <option value="">Select Question 1</option>
            {SECURITY_QUESTION_CHOICES.map((question, idx) => (
              <option key={idx} value={question}>
                {question}
              </option>
            ))}
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
            required
          />

          <label className="security-label ">Security Question 2</label>
          <select
            className="security-select"
            value={q2}
            onChange={(e) => setQ2(e.target.value)}
            required
          >
            <option value="">Select Question 2</option>
            {SECURITY_QUESTION_CHOICES.map((question, idx) => (
              <option key={idx} value={question}>
                {question}
              </option>
            ))}
          </select>

          <input
            type="text"
            className="security-input"
            placeholder="Answer"
            value={a2}
            onChange={(e) => setA2(e.target.value)}
            ref={a2InputRef}
            required
          />

          <label className="security-label ">New Password</label>
          <div className="set-input-wrapper">
            <FaLock className="input-icon-inside" />
            <input
              type={showPassword ? "text" : "password"}
              className="pass-input"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <span
              className="eye-icon-right"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          <button type="submit" className="security-submit-button shadow ">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default SecurityQuestionsScreen;



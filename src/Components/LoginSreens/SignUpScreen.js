// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import logo from "../../Logos/hvac-logo-new.jpg"; // Ensure this path is correct

// const SignUpScreen = () => {
//   const [mobile, setMobile] = useState("");
//   const [email, setEmail] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     navigate("/otp");
//   };

//   return (
//     <div className="container d-flex justify-content-center align-items-center vh-100 ">
//       <div className="card p-4 position-relative shadow" style={{ width: "100%", maxWidth: "400px" }}>
        
//         {/* Back Button */}
//         <button 
//           className="btn btn-link position-absolute top-0 start-0 m-2 text-dark"
//           onClick={() => navigate(-1)}
//         >
//           <i className="bi bi-arrow-left" style={{ fontSize: "1.2rem" }}></i>
//         </button>

//         <div className="text-center mb-4">
//           <img src={logo} alt="Logo" className="img-fluid mb-2"   style={{ maxHeight: "60px" }} />
//           <h3 className="fw-bold">Sign Up</h3>
//         </div>

//         <form onSubmit={handleSubmit}>
//           <div className="mb-3">
//             <input
//               type="tel"
//               className="form-control"
//               placeholder="Enter Mobile Number"
//               value={mobile}
//               onChange={(e) => setMobile(e.target.value)}
//               required
//             />
//           </div>

//           <div className="mb-3">
//             <input
//               type="email"
//               className="form-control"
//               placeholder="Enter Email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>

//           <button type="submit" className="btn btn-primary w-100">
//             Submit
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SignUpScreen;













import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../Logos/hvac-logo-new.jpg";
import "./SignUpScreen.css"; // Import the CSS

const SignUpScreen = () => {
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/otp");
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <button className="back-button" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left"></i>
        </button>

        <div className="signup-logo-container">
          <img src={logo} alt="Logo" className="signup-logo" />
          <h3 className="signup-title">Sign Up</h3>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="signup-input-wrapper">
            <i className="bi bi-phone-fill input-icon"></i>
            <input
              type="tel"
              placeholder="Enter Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
          </div>

          <div className="signup-input-wrapper">
            <i className="bi bi-envelope-fill input-icon"></i>
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="signup-submit-button shadow">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpScreen;

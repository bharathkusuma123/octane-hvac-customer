// import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import "./CustomerData.css";
// import { FaArrowLeft } from "react-icons/fa";

// const CustomerData = () => {
//         const { state } = useLocation();
//         const navigate = useNavigate();

//         if (!state || !state.user) {
//                 return <div className="no-user-data">No user data found. Please go back and sign up again.</div>;
//         }

//         const user = state.user;

//         const handleConfirm = () => {
//                 navigate("/set-sign-password", { state: { user } }); // You can customize route
//         };

//         return (
//                 <div className="otp-container">
//                         <div className="otp-card">
//                                 <button className="otp-back-button" onClick={() => navigate(-1)}>
//                                         <FaArrowLeft size={20} />
//                                 </button>
//                                 <h2 className="otp-title">Confirm Your Information</h2>
//                                 <div className="otp-details">
//                                           <div className="otp-row"><span className="label">User Id:</span><span className="value">{user.user_id}</span></div>
//                                         <div className="otp-row"><span className="label">User Name:</span><span className="value">{user.username}</span></div>
//                                         <div className="otp-row"><span className="label">Full Name:</span><span className="value">{user.full_name}</span></div>
//                                         <div className="otp-row"><span className="label">Email:</span><span className="value">{user.email}</span></div>
//                                         <div className="otp-row"><span className="label">Mobile:</span><span className="value">{user.mobile_no}</span></div>
//                                         <div className="otp-row"><span className="label">City:</span><span className="value">{user.city}</span></div>
//                                         <div className="otp-row"><span className="label">Country:</span><span className="value">{user.country_code}</span></div>
//                                         <div className="otp-row"><span className="label">Status:</span><span className="value">{user.status}</span></div>
//                                         <div className="otp-row"><span className="label">Address:</span><span className="value">{user.address}</span></div>

//                                 </div>
//                                 <button className="confirm-button" onClick={handleConfirm}>Confirm & Continue</button>
//                         </div>
//                 </div>
//         );
// };

// export default CustomerData;




// CustomerData.js
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./CustomerData.css";
import { FaArrowLeft } from "react-icons/fa";

const CustomerData = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state || !state.user) {
    return (
      <div className="no-user-data">
        No user data found. Please go back and sign up again.
      </div>
    );
  }

  const user = state.user;

  const handleConfirm = () => {
    navigate("/set-sign-password", { state: { user_id: user.customer_id } });
  };

  return (
    <div className="otp-container">
      <div className="otp-card">
        <button className="otp-back-button" onClick={() => navigate(-1)}>
          <FaArrowLeft size={20} />
        </button>
        <h2 className="otp-title">Confirm Your Information</h2>
        <div className="otp-details">
          <div className="otp-row">
            <span className="label">User Id:</span>
            <span className="value">{user.customer_id}</span>
          </div>
          <div className="otp-row">
            <span className="label">User Name:</span>
            <span className="value">{user.username}</span>
          </div>
          <div className="otp-row">
            <span className="label">Full Name:</span>
            <span className="value">{user.full_name}</span>
          </div>
          <div className="otp-row">
            <span className="label">Email:</span>
            <span className="value">{user.email}</span>
          </div>
          <div className="otp-row">
            <span className="label">Mobile:</span>
            <span className="value">{user.mobile}</span>
          </div>
          <div className="otp-row">
            <span className="label">City:</span>
            <span className="value">{user.city}</span>
          </div>
          <div className="otp-row">
            <span className="label">Country:</span>
            <span className="value">{user.country_code}</span>
          </div>
          <div className="otp-row">
            <span className="label">Status:</span>
            <span className="value">{user.status}</span>
          </div>
          <div className="otp-row">
            <span className="label">Address:</span>
            <span className="value">{user.address}</span>
          </div>
        </div>
        <button className="confirm-button" onClick={handleConfirm}>
          Confirm & Continue
        </button>
      </div>
    </div>
  );
};

export default CustomerData;

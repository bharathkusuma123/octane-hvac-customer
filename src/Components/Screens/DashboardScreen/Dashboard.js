import React, { useState, useEffect, useContext } from 'react';
import "./Dashboard.css";
import Navbar from "../../Screens/Navbar/Navbar";
import axios from "axios";
import baseURL from '../../ApiUrl/Apiurl';
import { FaEdit, FaTrashAlt, FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../AuthContext/AuthContext';

const Dashboard = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const { user, logout } = useContext(AuthContext);
  const userId = user?.customer_id;
  const company_id = user?.company_id;

  useEffect(() => {
    if (userId && company_id) {
      axios
        .get(`${baseURL}/customers/${userId}/?user_id=${userId}&company_id=${company_id}`)
        .then((res) => {
          if (res.data && res.data.data) {
            setUserDetails(res.data.data);
          } else {
            console.warn("No matching user found.");
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, [userId, company_id]);

  const handleEditClick = () => {
    navigate(`/edit-customer/${userDetails.customer_id}`);
  };

 const handleDeleteAccount = () => {
  if (userId) {
    axios
      .delete(`${baseURL}/customers/${userId}/?user_id=${userId}&company_id=${company_id}`)
      .then(response => {
        console.log("Account deleted successfully", response);
        setShowConfirm(false);
        // Logout user and redirect to home page
        if (logout) {
          logout();
        }
        navigate("/");
      })
      .catch(error => {
        console.error("Error deleting account:", error);
        // Handle error (show message to user, etc.)
        alert("Failed to delete account. Please try again.");
        setShowConfirm(false);
      });
  }
};

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        <h2>
          Customer Dashboard
          {userDetails && (
            <FaEdit
              className="edit-icon"
              onClick={handleEditClick}
              style={{ marginLeft: "10px", cursor: "pointer", color: "blue" }}
            />
          )}
        </h2>
        
        {userDetails ? (
          <div className="user-details">
            <p><strong>Customer ID:</strong> {userDetails.customer_id}</p>
            <p><strong>Username:</strong> {userDetails.username}</p>
            <p><strong>Full Name:</strong> {userDetails.full_name}</p>
            <p><strong>Email:</strong> {userDetails.email}</p>
            <p><strong>Mobile No:</strong> {userDetails.mobile}</p>
            <p><strong>Telephone:</strong> {userDetails.telephone}</p>
            <p><strong>City:</strong> {userDetails.city}</p>
            <p><strong>Country Code:</strong> {userDetails.country_code}</p>
            <p><strong>Address:</strong> {userDetails.address}</p>
            <p><strong>Customer Type:</strong> {userDetails.customer_type}</p>
            <p><strong>Status:</strong> {userDetails.status}</p>
            <p><strong>Remarks:</strong> {userDetails.remarks}</p>
            
            {/* Delete Account Section */}
            {/* <div 
              className="delete-account-section"
              style={{
                marginTop: "2.5rem",
                padding: "1.25rem",
                border: "1px solid #e6e6e6",
                borderRadius: "10px",
                backgroundColor: "#f9f9f9",
                transition: "all 0.3s ease",
                cursor: "pointer"
              }}
              onClick={() => setShowConfirm(true)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
                e.currentTarget.style.borderColor = "#ff6b6b";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = "#e6e6e6";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(255, 107, 107, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "15px"
                  }}>
                    <FaTrashAlt style={{ color: "#ff6b6b", fontSize: "18px" }} />
                  </div>
                  <div>
                    <h5 style={{ color: "#ff6b6b", margin: "0 0 4px 0", fontWeight: "600" }}>Delete Account</h5>
                    <p style={{ color: "#888", margin: "0", fontSize: "0.9rem" }}>Permanently remove your account and all data</p>
                  </div>
                </div>
                <div style={{ color: "#ccc", fontSize: "14px" }}>
                  ›
                </div>
              </div>
            </div> */}
          </div>
        ) : (
          <p>Loading user details...</p>
        )}
      </div>

      {/* Confirmation Modal */}
      {/* {showConfirm && (
        <div 
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            padding: "20px"
          }}
        >
          <div 
            className="confirmation-modal"
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "2rem",
              width: "100%",
              maxWidth: "450px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
              animation: "modalAppear 0.3s ease-out"
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <div style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                backgroundColor: "rgba(255, 107, 107, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1rem"
              }}>
                <FaExclamationTriangle style={{ color: "#ff6b6b", fontSize: "24px" }} />
              </div>
              <h4 style={{ fontWeight: "600", color: "#333", margin: "0 0 0.5rem 0" }}>Confirm Account Deletion</h4>
              <p style={{ color: "#666", lineHeight: "1.5", margin: 0 }}>
                Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
              </p>
            </div>
            
            <div style={{ 
              display: "flex", 
              justifyContent: "center", 
              gap: "12px",
              flexWrap: "wrap" 
            }}>
              <button
                style={{
                  padding: "10px 24px",
                  backgroundColor: "#f1f1f1",
                  border: "none",
                  borderRadius: "6px",
                  color: "#333",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#e5e5e5";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "#f1f1f1";
                }}
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                style={{
                  padding: "10px 24px",
                  backgroundColor: "#ff6b6b",
                  border: "none",
                  borderRadius: "6px",
                  color: "white",
                  fontWeight: "500",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "all 0.2s ease"
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#ff5252";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "#ff6b6b";
                }}
                onClick={handleDeleteAccount}
              >
                <FaTrashAlt style={{ fontSize: "14px" }} />
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default Dashboard;
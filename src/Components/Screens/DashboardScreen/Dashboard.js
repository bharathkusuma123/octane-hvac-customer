import React, { useState, useEffect, useContext } from 'react';
import "./Dashboard.css";
import Navbar from "../../Screens/Navbar/Navbar";
import axios from "axios";
import baseURL from '../../ApiUrl/Apiurl';
import { FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../AuthContext/AuthContext';

const Dashboard = () => {
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate();

  const { user } = useContext(AuthContext); // ← Access both user and company
  const userId = user?.customer_id   
  const company_id = user?.company_id   // ← Support both customer & delegate

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
          </div>
        ) : (
          <p>Loading user details...</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

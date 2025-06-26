import React, { useState, useEffect } from 'react';
import "./Dashboard.css";
import Navbar from "../../Screens/Navbar/Navbar";
import axios from "axios";
import baseURL from '../../ApiUrl/Apiurl';

const Dashboard = () => {
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const customerId = localStorage.getItem("userId"); // make sure you store this after login

    if (customerId) {
      axios.get(`${baseURL}/customers/`)
        .then((res) => {
          const matchedUser = res.data.data.find(user => user.customer_id === customerId);
          if (matchedUser) {
            setUserDetails(matchedUser);
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, []);

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        <h2>Customer Dashboard</h2>
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
            {/* <p><strong>Created By:</strong> {userDetails.created_by}</p>
            <p><strong>Updated By:</strong> {userDetails.updated_by}</p> */}
          </div>
        ) : (
          <p>Loading user details...</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

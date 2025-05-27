// import React, { useState, useEffect } from 'react';
// import "./Dashboard.css";
// import Navbar from "./Navbar/Navbar";

// const Dashboard = () => {
//   const [userId, setUserId] = useState(null);
//   const [userMobile, setUserMobile] = useState(null);

//   useEffect(() => {
//     setUserId(localStorage.getItem("userId"));
//     setUserMobile(localStorage.getItem("userMobile"));
//   }, []);

//   return (
//     <div className="dashboard-container">
//       <Navbar />
//       <h2>Customer Dashboard</h2>
//       <p>Logged in as UserID: <strong>{userId || "Not found"}</strong></p>
//       <p>Mobile Number: <strong>{userMobile || "Not found"}</strong></p>
//     </div>
//   );
// };

// export default Dashboard;



import React, { useState, useEffect } from 'react';
import "./Dashboard.css";
import Navbar from "./Navbar/Navbar";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Simulating API call – Replace with actual API fetch
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const userMobile = localStorage.getItem("userMobile");

        // Example fetch - replace URL with your actual API endpoint
        const response = await fetch(`http://175.29.21.7:8006/users/`);
        const data = await response.json();

        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        <h2>Customer Dashboard</h2>
        {userData ? (
          <div className="user-details">
            <p><strong>Full Name:</strong> {userData.full_name}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Mobile Number:</strong> {userData.mobile_no}</p>
            <p><strong>City:</strong> {userData.city}</p>
            <p><strong>Customer Type:</strong> {userData.customer_type}</p>
            <p><strong>Role:</strong> {userData.role}</p>
            <p><strong>Address:</strong> {userData.address}</p>
            <p><strong>Status:</strong> {userData.status}</p>
          </div>
        ) : (
          <p>Loading user details...</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

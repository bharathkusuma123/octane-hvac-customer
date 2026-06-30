import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from "../Components/AuthContext/AuthContext";
import NavScreen from "../Components/Screens/Navbar/Navbar";
import baseURL from "../Components/ApiUrl/Apiurl";
import "./Home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user } = useContext(AuthContext);
  const userId = user?.customer_id;

  const [serviceCount, setServiceCount] = useState(0);
  const [delegateCount, setDelegateCount] = useState(0);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        // The API already filters by user_id, so we just need to count what's returned
        const response = await fetch(`${baseURL}/service-pools/?user_id=${userId}&company_id=${user?.company_id}`);
        if (response.ok) {
          const result = await response.json();
          const services = result.data || [];
          
          // Since the API filters by user_id, all services returned belong to this user
          // But if the API doesn't filter properly, we can check if the service has a customer field
          // or use the total_count from pagination
          
          // Option 1: Use the total_count from pagination
          const totalCount = result.pagination?.total_count || services.length;
          setServiceCount(totalCount);
          
          console.log("Services fetched:", services.length, "Total:", totalCount);
        } else {
          console.error("Failed to fetch services:", response.status);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    const fetchDelegates = async () => {
      try {
        let allDelegates = [];
        let currentPage = 1;
        let hasMorePages = true;

        while (hasMorePages) {
          const response = await fetch(`${baseURL}/delegates/?page=${currentPage}`);
          if (response.ok) {
            const result = await response.json();
            const delegates = result.data || [];
            allDelegates = [...allDelegates, ...delegates];
            
            const pagination = result.pagination;
            if (pagination && pagination.has_next) {
              currentPage++;
            } else {
              hasMorePages = false;
            }
          } else {
            console.error("Failed to fetch delegates:", response.status);
            hasMorePages = false;
          }
        }

        // Filter delegates by checking if delegate_id starts with userId
        const filteredDelegates = allDelegates.filter(delegate => {
          return delegate.delegate_id && delegate.delegate_id.startsWith(`${userId}-`);
        });
        
        setDelegateCount(filteredDelegates.length);
        console.log(`Found ${filteredDelegates.length} delegates for user ${userId}`);
        
      } catch (error) {
        console.error("Error fetching delegates:", error);
      }
    };

    const fetchCustomerUsername = async () => {
      try {
        const response = await fetch(
          `${baseURL}/customers/${userId}/?user_id=${userId}&company_id=${user?.company_id}`
        );

        if (response.ok) {
          const result = await response.json();
          const customer = result.data;

          if (customer && customer.username) {
            setUsername(customer.username);
            console.log("Fetched username:", customer.username);
          } else {
            console.warn("Customer not found or missing username");
          }
        } else {
          console.error("Failed to fetch customer:", response.status);
        }
      } catch (error) {
        console.error("Error fetching customer username:", error);
      }
    };

    if (userId) {
      fetchServices();
      fetchDelegates();
      fetchCustomerUsername();
    }
  }, [userId]);

  return (
    <div className="home">
      {username && <h2 className="welcome-text">Hey, {username}</h2>}
      
      <div className="card-container">
        <div 
          className="info-card" 
          onClick={() => navigate("/request")}
          style={{ cursor: "pointer" }}
        >
          <h3>My Services</h3>
          <p>{serviceCount}</p>
        </div>

        <div 
          className="info-card" 
          onClick={() => navigate("/view-delegates")}
          style={{ cursor: "pointer" }}
        >
          <h3>My Delegates</h3>
          <p>{delegateCount}</p>
        </div>
      </div>

      <NavScreen />
    </div>
  );
};

export default Home;
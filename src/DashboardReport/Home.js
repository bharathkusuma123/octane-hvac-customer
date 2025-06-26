import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from "../Components/AuthContext/AuthContext";
import NavScreen from "../Components/Screens/Navbar/Navbar";
import baseURL from "../Components/ApiUrl/Apiurl";
import "./Home.css";

const Home = () => {
  const { user } = useContext(AuthContext);
  const userId = user?.customer_id;

  const [serviceCount, setServiceCount] = useState(0);
  const [delegateCount, setDelegateCount] = useState(0);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${baseURL}/service-pools/`);
        if (response.ok) {
          const result = await response.json();
          const services = result.data || [];
          const filteredServices = services.filter(service => service.customer === userId);
          setServiceCount(filteredServices.length);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    const fetchDelegates = async () => {
      try {
        const response = await fetch(`${baseURL}/delegates/`);
        if (response.ok) {
          const result = await response.json();
          const delegates = result.data || [];
          const filteredDelegates = delegates.filter(delegate => delegate.customer === userId);
          setDelegateCount(filteredDelegates.length);
        }
      } catch (error) {
        console.error("Error fetching delegates:", error);
      }
    };

    const fetchCustomerUsername = async () => {
      try {
        const response = await fetch(`${baseURL}/customers/`);
        if (response.ok) {
          const result = await response.json();
          const customers = result.data || [];
          const matchedCustomer = customers.find(cust => cust.customer_id === userId);
          if (matchedCustomer) {
            setUsername(matchedCustomer.username);
          }
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
        <div className="info-card">
          <h3>My Services</h3>
          <p>{serviceCount}</p>
        </div>
        <div className="info-card">
          <h3>My Delegates</h3>
          <p>{delegateCount}</p>
        </div>
      </div>
      <NavScreen />
    </div>
  );
};

export default Home;

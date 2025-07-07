import React, { useContext, useEffect, useState } from 'react';
import NavScreen from '../../Screens/Navbar/Navbar';
import { AuthContext } from "../../AuthContext/AuthContext";
import baseURL from '../../ApiUrl/Apiurl';
import { useNavigate } from 'react-router-dom';
import "./Machine.css";

const MachineScreen = () => {
  const { user } = useContext(AuthContext);
  const userId = user?.customer_id;

  const [serviceItems, setServiceItems] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 

useEffect(() => {
  const fetchServiceItems = async () => {
    try {
      const response = await fetch(`${baseURL}/service-items/`);
      if (response.ok) {
        const result = await response.json();
        const serviceItemsArray = result.data;

        const userServiceItem = serviceItemsArray.find(
          (item) => item.customer === user?.customer_id
        );

        if (userServiceItem) {
          setSelectedCompany(userServiceItem.company);

          const filteredItems = serviceItemsArray
            .filter((item) => item.customer === user?.customer_id)
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // 🔽 Sort by created_at DESC

          setServiceItems(filteredItems);
        }
      } else {
        console.error('Failed to load service items');
      }
    } catch (error) {
      console.error('Error fetching service items:', error);
    } finally {
      setLoading(false);
    }
  };

  if (userId) {
    fetchServiceItems();
  }
}, [userId]);


  return (
    <div className="machine-table-container">
      <div className="machine-table-header">
        <h2 className="machine-table-title">Machine Screen</h2>
      </div>

      {/* <p>Customer ID: {userId}</p>
      <p>Company: {selectedCompany}</p> */}

      <div className="table-responsive">
        {loading ? (
          <div className="loading-message">Loading service items...</div>
        ) : serviceItems.length > 0 ? (
          <table className="machines-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Service Item ID</th>
                <th>Serial Number</th>
                <th>Location</th>
                <th>Product Description</th>
                <th>Installation Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {serviceItems.map((item,index) => (
                <tr key={item.service_item_id}>
                  <td>{index+1}</td>
                  <td
                    style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                    onClick={() => navigate(`/machines/${item.service_item_id}`)} // ✅ navigate
                  >
                    {item.service_item_id}
                  </td>
                  <td>{item.serial_number}</td>
                  <td>{item.location}</td>
                  <td>{item.product_description}</td>
                  <td>{item.installation_date}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        item.status.toLowerCase() === 'active'
                          ? 'active'
                          : item.status.toLowerCase() === 'inactive'
                          ? 'inactive'
                          : 'pending'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-machines-message">No service items found for your account.</div>
        )}
      </div>

      <NavScreen />
    </div>
  );
};

export default MachineScreen;

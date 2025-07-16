import React, { useContext, useEffect, useState } from 'react';
import NavScreen from '../../Screens/Navbar/Navbar';
import { AuthContext } from "../../AuthContext/AuthContext";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./Machine.css";

const MachineScreen = () => {
  const { user } = useContext(AuthContext);
  const userId = user?.customer_id;
  const companyId = user?.company_id;

  const [serviceItems, setServiceItems] = useState([]);
  const [loading, setLoading] = useState(true);
 const navigate = useNavigate(); 

  useEffect(() => {
    if (userId && companyId) {
      axios.get(`http://175.29.21.7:8006/service-items/`, {
        params: {
          user_id: userId,
          company_id: companyId
        }
      })
      .then(response => {
        if (response.data.status === "success") {
          setServiceItems(response.data.data);
        }
      })
      .catch(error => {
        console.error("Error fetching service items:", error);
      })
      .finally(() => {
        setLoading(false);
      });
    }
  }, [userId, companyId]);

return (
  <div className="request-screen-wrapper">
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h2 className="machine-table-title">Machine Screen</h2>
      {/* <div>
        <p className="mb-1">User ID: {userId}</p>
        <p className="mb-1">Company ID: {companyId}</p>
      </div> */}
    </div>

    <NavScreen />

    {loading ? (
      <p>Loading data...</p>
    ) : (
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Service Item</th>
                 <th>Serial Number</th>
                <th>Location</th>
                <th>Product Description</th>
                <th>Installation Date</th>
                <th>Status</th>

            </tr>
          </thead>
          <tbody>
            {serviceItems.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
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
      </div>
    )}
  </div>
);

};

export default MachineScreen;

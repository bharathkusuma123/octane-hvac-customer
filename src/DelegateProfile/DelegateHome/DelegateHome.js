import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from "../../Components/AuthContext/AuthContext";
import DelegateNavbar from "../DelegateNavbar/DelegateNavbar";
import baseURL from "../../Components/ApiUrl/Apiurl";
import axios from "axios";

const DelegateHome = () => {
  const { user } = useContext(AuthContext);
  const [delegateId, setDelegateId] = useState('');
  const [serviceItems, setServiceItems] = useState([]);

  useEffect(() => {
    if (user?.delegate_id) {
      setDelegateId(user.delegate_id);

      // Fetch service items
      axios.get(`${baseURL}/delegate-service-item-tasks/`)
        .then(response => {
          if (response.data.status === "success") {
            const filteredItems = response.data.data.filter(
              item => item.delegate === user.delegate_id
            );
            setServiceItems(filteredItems);
          } else {
            console.error("API Error:", response.data.message);
          }
        })
        .catch(error => {
          console.error("API Fetch Error:", error);
        });
    }
  }, [user]);

  return (
    <div style={{ marginTop: '25%' }} className="px-4">
  

      {/* ✅ Service Items Table */}
      <h3 className="mt-4">Delegate Service Items</h3>
      <table className="table mt-3 table-bordered">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Service Item</th>
          </tr>
        </thead>
        <tbody>
          {serviceItems.length > 0 ? (
            serviceItems.map((item, index) => (
              <tr key={item.item_id}>
                <td>{index + 1}</td>
                <td>{item.service_item}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="text-center">No service items assigned.</td>
            </tr>
          )}
        </tbody>
      </table>

      <DelegateNavbar />
    </div>
  );
};

export default DelegateHome;

import React, { useContext, useEffect, useState } from 'react';
import NavScreen from '../../Screens/Navbar/Navbar';
import { AuthContext } from "../../AuthContext/AuthContext";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./Machine.css";
import EditServiceItemModal from './EditServiceItemModal'; // Import the modal component
import { FaEdit } from 'react-icons/fa';

const MachineScreen = () => {
  const { user } = useContext(AuthContext);
  const userId = user?.customer_id;
  const companyId = user?.company_id;

  const [serviceItems, setServiceItems] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
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

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };

  const handleUpdateSuccess = (updatedItem) => {
    setServiceItems(prevItems => 
      prevItems.map(item => 
        item.service_item_id === updatedItem.service_item_id ? updatedItem : item
      )
    );
  };

  return (
    <div className="request-screen-wrapper">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="machine-table-title">Machine Screen</h2>
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
                <th>Service Item Name</th>
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
                    onClick={() => navigate(`/machines/${item.service_item_id}`)}
                  >
                    {item.service_item_id}
                  </td>
               <td>
  {item.service_item_name}
  <FaEdit 
    style={{ 
      cursor: 'pointer',
      color: '#1890ff',
      marginLeft: '8px',
      fontSize: '16px'
    }}
    onClick={(e) => {
      e.stopPropagation();
      handleEditClick(item);
    }}
    title="Edit"
  />
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

      {/* Edit Modal */}
      {selectedItem && (
        <EditServiceItemModal
          show={showEditModal}
          handleClose={() => setShowEditModal(false)}
          serviceItem={selectedItem}
          userId={userId}
          companyId={companyId}
          onUpdate={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

export default MachineScreen;
import React, { useContext, useEffect, useState } from 'react';
import NavScreen from '../../Screens/Navbar/Navbar';
import { AuthContext } from "../../AuthContext/AuthContext";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./Machine.css";
import EditServiceItemModal from './EditServiceItemModal';
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
    <div className="machine-screen-wrapper">
      <div className="machine-screen-header">
        <h2 className="machine-screen-title">Machine Screen</h2>
      </div>

      <NavScreen />

      {loading ? (
        <p className="machine-loading-text">Loading data...</p>
      ) : (
        <div className="machine-cards-container">
          {serviceItems.map((item, index) => (
            <div key={index} className="machine-card">
              <div className="machine-card-header">
                <span className="machine-card-sno">{index + 1}</span>
                <h3 
                  className="machine-card-id"
                  onClick={() => navigate(`/machines/${item.service_item_id}`)}
                >
                  {item.service_item_id}
                </h3>
              </div>
              
              <div className="machine-card-body">
                <div className="machine-card-row">
                  <span className="machine-card-label">Name:</span>
                  <span className="machine-card-value">
                    {item.service_item_name}
                    <FaEdit 
                      className="machine-card-edit-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(item);
                      }}
                      title="Edit"
                    />
                  </span>
                </div>
                
                <div className="machine-card-row">
                  <span className="machine-card-label">Serial Number:</span>
                  <span className="machine-card-value">{item.serial_number}</span>
                </div>
                
                <div className="machine-card-row">
                  <span className="machine-card-label">Location:</span>
                  <span className="machine-card-value">{item.location}</span>
                </div>
                
                <div className="machine-card-row">
                  <span className="machine-card-label">Description:</span>
                  <span className="machine-card-value">{item.product_description}</span>
                </div>
                
                <div className="machine-card-row">
                  <span className="machine-card-label">Installation Date:</span>
                  <span className="machine-card-value">{item.installation_date}</span>
                </div>
                
                <div className="machine-card-row">
                  <span className="machine-card-label">Status:</span>
                  <span className={`machine-card-status machine-status-${item.status.toLowerCase()}`}>
                    {item.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
import React, { useContext, useEffect, useState } from 'react';
import NavScreen from '../../Screens/Navbar/Navbar';
import { AuthContext } from "../../AuthContext/AuthContext";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./Machine.css";
import EditServiceItemModal from './EditServiceItemModal';
import { FaEdit, FaChevronDown, FaChevronUp, FaTachometerAlt } from 'react-icons/fa';
import baseURL from '../../ApiUrl/Apiurl';

const MachineScreen = () => { 
  const { user } = useContext(AuthContext);
  const userId = user?.customer_id;
  const companyId = user?.company_id;

  const [serviceItems, setServiceItems] = useState([]); 
  const [serviceComponents, setServiceComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [componentsLoading, setComponentsLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [expandedCards, setExpandedCards] = useState({});
  const navigate = useNavigate(); 

  // Function to convert date to Indian format (DD-MM-YYYY)
  const formatToIndianDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      
      return `${day}-${month}-${year}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString; // Return original if formatting fails
    }
  };

  useEffect(() => {
    if (userId && companyId) {
      // Fetch service items
      axios.get(`${baseURL}/service-items/`, {
        params: {
          user_id: userId,
          company_id: companyId
        }
      })
      .then(response => {
        if (response.data.status === "success") {
          setServiceItems(response.data.data);
          // Initialize all cards as collapsed
          const initialExpandedState = {};
          response.data.data.forEach((item, index) => {
            initialExpandedState[index] = false;
          });
          setExpandedCards(initialExpandedState);
        }
      })
      .catch(error => {
        console.error("Error fetching service items:", error);
      })
      .finally(() => {
        setLoading(false);
      });

      // Fetch service item components
      setComponentsLoading(true);
      axios.get(`${baseURL}/service-item-components/`, {
        params: {
          user_id: userId,
          company_id: companyId
        }
      })
      .then(response => {
        if (response.data.status === "success") {
          setServiceComponents(response.data.data);
        }
      })
      .catch(error => {
        console.error("Error fetching service components:", error);
      })
      .finally(() => {
        setComponentsLoading(false);
      });
    }
  }, [userId, companyId]);

  // Function to get components for a specific service item
  const getComponentsForItem = (serviceItemId) => {
    return serviceComponents.filter(component => 
      component.service_item === serviceItemId
    );
  };

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

  const toggleCardExpand = (index) => {
    setExpandedCards(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

 return (
    <div className="machine-screen-wrapper">
      <div className="machine-screen-header">
        <div className="machine-header-content">
          <h2 className="machine-screen-title">Machine Screen</h2>
          <button 
            className="btn btn-primary machine-monitor-btn"
            onClick={() => navigate('/machinescreen1')}
            title="View Machine Monitoring Dashboard"
          >
            <FaTachometerAlt className="me-2" />
            Show Complete Machine Data
          </button>
        </div>
      </div>

      <NavScreen />

      {loading ? (
        <p className="machine-loading-text">Loading data...</p>
      ) : (
        <div className="machine-cards-container">
          {serviceItems.map((item, index) => {
            const itemComponents = getComponentsForItem(item.service_item_id);
            
            return (
              <div key={index} className="machine-card">
                <div className="machine-card-header" onClick={() => toggleCardExpand(index)}>
                  <span className="machine-card-sno">{index + 1}</span>
                  <h3 
                    className="machine-card-id"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/machines/${item.service_item_id}`);
                    }}
                  >
                    {item.service_item_id}
                  </h3>
                  <div className="machine-card-toggle">
                    {expandedCards[index] ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                </div>
                
                {expandedCards[index] && (
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
                      <span className="machine-card-value">{formatToIndianDate(item.installation_date)}</span>
                    </div>
                    
                    <div className="machine-card-row">
                      <span className="machine-card-label">Status:</span>
                      <span className={`machine-card-status machine-status-${item.status.toLowerCase()}`}>
                        {item.status}
                      </span>
                    </div>

                    {/* Display components for this service item */}
                    {componentsLoading ? (
                      <div className="machine-card-row">
                        <span className="machine-loading-text">Loading components...</span>
                      </div>
                    ) : itemComponents.length > 0 ? (
                      <div className="machine-components-section">
                        <h4 className="machine-components-title">Components:</h4>
                        {itemComponents.map((component, compIndex) => (
                          <div key={compIndex} className="machine-component-item">
                            <div className="machine-card-row">
                              <span className="machine-card-label">Component ID:</span>
                              <span className="machine-card-value">{component.service_component_id}</span>
                            </div>
                            <div className="machine-card-row">
                              <span className="machine-card-label">Serial Number:</span>
                              <span className="machine-card-value">{component.component_serial_number}</span>
                            </div>
                            <div className="machine-card-row">
                              <span className="machine-card-label">Warranty:</span>
                              <span className="machine-card-value">
                                {formatToIndianDate(component.warranty_start_date)} to {formatToIndianDate(component.warranty_end_date)}
                              </span>
                            </div>
                            <hr className="machine-component-divider" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="machine-card-row">
                        <span className="machine-card-label">Components:</span>
                        <span className="machine-card-value">No components found</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
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
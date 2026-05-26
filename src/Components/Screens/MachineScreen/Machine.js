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

  // PM badge counts keyed by service_item_id
  const [pmBadgeCounts, setPmBadgeCounts] = useState({});

  const navigate = useNavigate(); 

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
      return dateString;
    }
  };

  // ─── Fetch PM badge counts for all service items ──────────────────────────
  const fetchPmBadgeCounts = async () => {
    if (!userId || !companyId) return;
    try {
      const response = await fetch(
        `${baseURL}/service-item-pm-schedules/?user_id=${userId}&company_id=${companyId}`
      );
      const data = await response.json();
      if (data.status === 'success') {
        // Group counts by service_item, only Customer + Pending + is_alert_sent
        const counts = {};
        data.data.forEach((schedule) => {
          if (
            schedule.responsible?.toLowerCase() === 'customer' &&
            schedule.status === 'Pending' &&
            schedule.is_alert_sent === true
          ) {
            const itemId = schedule.service_item;
            counts[itemId] = (counts[itemId] || 0) + 1;
          }
        });
        setPmBadgeCounts(counts);
      }
    } catch (err) {
      console.error('Failed to fetch PM badge counts:', err);
    }
  };

  useEffect(() => {
    if (userId && companyId) {
      // Fetch service items
      axios.get(`${baseURL}/service-items/`, {
        params: { user_id: userId, company_id: companyId }
      })
      .then(response => {
        if (response.data.status === "success") {
          setServiceItems(response.data.data);
          const initialExpandedState = {};
          response.data.data.forEach((item, index) => {
            initialExpandedState[index] = false;
          });
          setExpandedCards(initialExpandedState);
        }
      })
      .catch(error => console.error("Error fetching service items:", error))
      .finally(() => setLoading(false));

      // Fetch service item components
      setComponentsLoading(true);
      axios.get(`${baseURL}/service-item-components/`, {
        params: { user_id: userId, company_id: companyId }
      })
      .then(response => {
        if (response.data.status === "success") {
          setServiceComponents(response.data.data);
        }
      })
      .catch(error => console.error("Error fetching service components:", error))
      .finally(() => setComponentsLoading(false));

      // Fetch PM badge counts
      fetchPmBadgeCounts();
    }
  }, [userId, companyId]);

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

  // ─── Badge pill ───────────────────────────────────────────────────────────
  const PmBadge = ({ count }) => {
    if (!count || count === 0) return null;
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#dc3545',
          color: 'white',
          borderRadius: '50%',
          minWidth: '20px',
          height: '20px',
          fontSize: '11px',
          fontWeight: '700',
          marginLeft: '8px',
          padding: '0 4px',
          lineHeight: 1,
          verticalAlign: 'middle',
          flexShrink: 0,
        }}
      >
        {count > 99 ? '99+' : count}
      </span>
    );
  };

  return (
    <div className="machine-screen-wrapper">
      <div className="machine-screen-header">
        <div className="machine-header-content">
          <h2 className="machine-screen-title">Your Machines</h2>
        </div>
      </div>

      <NavScreen />

      {loading ? (
        <p className="machine-loading-text">Loading data...</p>
      ) : (
        <div className="machine-cards-container">
          {serviceItems.map((item, index) => {
            const itemComponents = getComponentsForItem(item.service_item_id);
            const badgeCount = pmBadgeCounts[item.service_item_id] || 0;

            return (
              <div key={index} className="machine-card">
                <div
                  className="machine-card-header"
                  onClick={() => toggleCardExpand(index)}
                >
                  <span className="machine-card-sno">{index + 1}</span>

                  {/* Service item name + PM badge */}
                  <h3
                    className="machine-card-id"
                    style={{ display: 'flex', alignItems: 'center' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/machines/${item.service_item_id}`);
                    }}
                  >
                    {item.service_item_name}
                    <PmBadge count={badgeCount} />
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

                    {/* PM Schedule pending badge info row */}
                    {badgeCount > 0 && (
                      <div className="machine-card-row">
                        <span className="machine-card-label">PM Actions Pending:</span>
                        <span
                          className="machine-card-value"
                          style={{ color: '#dc3545', fontWeight: '600' }}
                        >
                          {badgeCount} task{badgeCount !== 1 ? 's' : ''} require{badgeCount === 1 ? 's' : ''} attention
                        </span>
                      </div>
                    )}

                    {/* Components */}
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
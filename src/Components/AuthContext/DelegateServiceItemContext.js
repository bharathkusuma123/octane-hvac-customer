// contexts/DelegateServiceItemContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import baseURL from "../ApiUrl/Apiurl";
import { AuthContext } from "./AuthContext";

const DelegateServiceItemContext = createContext();

export const DelegateServiceItemProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [serviceItems, setServiceItems] = useState([]);
  const [selectedServiceItem, setSelectedServiceItem] = useState('');
  const [serviceItemPermissions, setServiceItemPermissions] = useState({});
  const [serviceItemDetails, setServiceItemDetails] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServiceItems = async () => {
      if (user?.delegate_id) {
        try {
          // Fetch delegate service item permissions
          const delegateResponse = await axios.get(`${baseURL}/delegate-service-item-tasks/`);
          const allDelegateItems = delegateResponse.data.data || [];
          const filteredDelegateItems = allDelegateItems.filter(
            item => item.delegate === user.delegate_id
          );
          setServiceItems(filteredDelegateItems);

          // Fetch complete service item details
          const serviceItemsResponse = await axios.get(`${baseURL}/service-items/?user_id=${user.delegate_id}&company_id=${user.company_id}`);
          const allServiceItems = serviceItemsResponse.data.data || [];

          // Create a mapping of service_item_id to service item details
          const serviceItemsMap = {};
          allServiceItems.forEach(item => {
            serviceItemsMap[item.service_item_id] = item;
          });
          setServiceItemDetails(serviceItemsMap);
          
          // Load previously selected service item from localStorage
          const savedItemId = localStorage.getItem('selectedServiceItemId');
          if (savedItemId) {
            const foundDelegateItem = filteredDelegateItems.find(item => item.service_item === savedItemId);
            if (foundDelegateItem) {
              setSelectedServiceItem(savedItemId);
              setServiceItemPermissions(foundDelegateItem);
            }
          } else if (filteredDelegateItems.length > 0) {
            // Auto-select first item if none saved
            const firstItem = filteredDelegateItems[0];
            setSelectedServiceItem(firstItem.service_item);
            setServiceItemPermissions(firstItem);
            localStorage.setItem('selectedServiceItemId', firstItem.service_item);
          }
        } catch (error) {
          console.error('Error fetching service items:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchServiceItems();
  }, [user]);

  const updateSelectedServiceItem = (serviceItemId) => {
    const foundItem = serviceItems.find(item => item.service_item === serviceItemId);
    if (foundItem) {
      setSelectedServiceItem(serviceItemId);
      setServiceItemPermissions(foundItem);
      localStorage.setItem('selectedServiceItemId', serviceItemId);
    }
  };

  const clearSelectedServiceItem = () => {
    setSelectedServiceItem('');
    setServiceItemPermissions({});
    localStorage.removeItem('selectedServiceItemId');
  };

  // Get the complete service item details for the selected item
  const getSelectedServiceDetails = () => {
    if (selectedServiceItem && serviceItemDetails[selectedServiceItem]) {
      return serviceItemDetails[selectedServiceItem];
    }
    return null;
  };

  const value = {
    serviceItems,
    selectedServiceItem,
    serviceItemPermissions,
    serviceItemDetails,
    getSelectedServiceDetails,
    updateSelectedServiceItem,
    clearSelectedServiceItem,
    loading
  };

  return (
    <DelegateServiceItemContext.Provider value={value}>
      {children}
    </DelegateServiceItemContext.Provider>
  );
};

export const useDelegateServiceItems = () => useContext(DelegateServiceItemContext);
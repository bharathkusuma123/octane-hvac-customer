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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServiceItems = async () => {
      if (user?.delegate_id) {
        try {
          const response = await axios.get(`${baseURL}/delegate-service-item-tasks/`);
          const allItems = response.data.data || [];
          const filteredItems = allItems.filter(
            item => item.delegate === user.delegate_id
          );
          setServiceItems(filteredItems);
          
          // Load previously selected service item from localStorage
          const savedItemId = localStorage.getItem('selectedServiceItemId');
          if (savedItemId) {
            const foundItem = filteredItems.find(item => item.service_item === savedItemId);
            if (foundItem) {
              setSelectedServiceItem(savedItemId);
              setServiceItemPermissions(foundItem);
            }
          }
        } catch (error) {
          console.error('Error fetching delegate service items:', error);
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
    } else {
      setSelectedServiceItem(serviceItemId);
      setServiceItemPermissions({});
      localStorage.setItem('selectedServiceItemId', serviceItemId);
    }
  };

  const clearSelectedServiceItem = () => {
    setSelectedServiceItem('');
    setServiceItemPermissions({});
    localStorage.removeItem('selectedServiceItemId');
  };

  const value = {
    serviceItems,
    selectedServiceItem,
    serviceItemPermissions,
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
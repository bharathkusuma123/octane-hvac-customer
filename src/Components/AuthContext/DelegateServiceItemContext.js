// contexts/DelegateServiceItemContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import baseURL from "../ApiUrl/Apiurl";
import { AuthContext } from "./AuthContext";

const DelegateServiceItemContext = createContext();

export const DelegateServiceItemProvider = ({ children }) => {
  const { user } =  useContext(AuthContext);
  const [serviceItems, setServiceItems] = useState([]);

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
        } catch (error) {
          console.error('Error fetching delegate service items:', error);
        }
      }
    };

    fetchServiceItems();
  }, [user]);

  return (
    <DelegateServiceItemContext.Provider value={{ serviceItems }}>
      {children}
    </DelegateServiceItemContext.Provider>
  );
};

export const useDelegateServiceItems = () => useContext(DelegateServiceItemContext);

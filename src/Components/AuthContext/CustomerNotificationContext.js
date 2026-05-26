// src/CustomerContext/CustomerNotificationContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import baseURL from '../ApiUrl/Apiurl';

const CustomerNotificationContext = createContext();

const UPDATED_STATUSES = [
  'Under Process',
  'Waiting for Spares',
  'Waiting for Quote',
  'Waiting for Client Approval',
  'Closed',
  'Reopened',
];

export const CustomerNotificationProvider = ({ children, customerId, companyId }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount]     = useState(0);
  const [lastSeenAt, setLastSeenAt]       = useState(
    () => localStorage.getItem(`lastSeen_${customerId}`) || null
  );

  const fetchUpdates = useCallback(async () => {
    if (!customerId || !companyId) return;
    try {
      const response = await axios.get(`${baseURL}/service-pools/`, {
        params: {
          user_id:    customerId,
          company_id: companyId,
        },
      });

      const allRequests = response.data?.data || [];

      // Only requests where engineer has acted (not "Open")
      const actedRequests = allRequests.filter(r =>
        UPDATED_STATUSES.includes(r.status)
      );

      // Count unread — requests updated after customer last saw the bell
      const unread = lastSeenAt
        ? actedRequests.filter(r => new Date(r.updated_at) > new Date(lastSeenAt))
        : actedRequests;

      setNotifications(actedRequests);
      setUnreadCount(unread.length);
    } catch (err) {
      console.error('Failed to fetch customer notifications:', err);
    }
  }, [customerId, companyId, lastSeenAt]);

  // Poll every 30 seconds
  useEffect(() => {
    fetchUpdates();
    const interval = setInterval(fetchUpdates, 30000);
    return () => clearInterval(interval);
  }, [fetchUpdates]);

  // Called when customer clicks the bell — clears badge
  const markAsSeen = useCallback(() => {
    const now = new Date().toISOString();
    localStorage.setItem(`lastSeen_${customerId}`, now);
    setLastSeenAt(now);
    setUnreadCount(0);
  }, [customerId]);

  return (
    <CustomerNotificationContext.Provider
      value={{ notifications, unreadCount, markAsSeen, fetchUpdates }}
    >
      {children}
    </CustomerNotificationContext.Provider>
  );
};

export const useCustomerNotifications = () => {
  const context = useContext(CustomerNotificationContext);

  if (!context) {
    throw new Error(
      "useCustomerNotifications must be used within CustomerNotificationProvider"
    );
  }

  return context;
};
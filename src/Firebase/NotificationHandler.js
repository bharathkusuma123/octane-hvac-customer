import React, { useEffect } from 'react';
import { onMessageListener } from './Firebase';
import { toast } from 'react-toastify';

const NotificationHandler = () => {
  useEffect(() => {
    const setupNotifications = async () => {
      try {
        // Listen for foreground messages
        onMessageListener()
          .then((payload) => {
            console.log('Foreground message received:', payload);
            if (payload.notification) {
              // Display notification using toast or native API
              toast.info(`${payload.notification.title}: ${payload.notification.body}`);
              
              // Or use native notifications
              if (Notification.permission === 'granted') {
                new Notification(payload.notification.title, {
                  body: payload.notification.body,
                  icon: payload.notification.image
                });
              }
            }
          })
          .catch((err) => console.log('Failed: ', err));
      } catch (error) {
        console.error('Notification setup error:', error);
      }
    };

    setupNotifications();
  }, []);

  return null; // This component doesn't render anything
};

export default NotificationHandler;
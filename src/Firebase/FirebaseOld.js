import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { useNavigate } from 'react-router-dom';



const firebaseConfig = {
  apiKey: "AIzaSyDVp-QW_qn6chS_ymv0jZsY42nNVg3bOj8",
  authDomain: "hvac-d1f0f.firebaseapp.com",
  projectId: "hvac-d1f0f",
  storageBucket: "hvac-d1f0f.firebasestorage.app",
  messagingSenderId: "68719274682",
  appId: "1:68719274682:web:8faa0757d78eeaadc77083"
};



const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const generateToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
    //  vapidKey: "BNg-lnZPmKI-1hAZLMoCVwIXvu0MTf6ZpePN3oKbjzMy0MOVrazZavHfh3M8uuzeGwXibWKOGfHDB75_j306SSo",
vapidKey: "BHVj2p-U-jiidcyB7VTaEZpbbW1AANZmuCd72e0Po1c_BXm5LAlIwrBmHPVDAimUnVE0_rWD98i1TOmFQro1oII",
      });
      console.log("FCM Token:", token);
      return token;
    }
    return null;
  } catch (error) {
    console.error("Error getting token", error);
    return null;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("Message received. ", payload);
      
      // Handle foreground notifications
      if (payload.notification) {
        const notificationTitle = payload.notification.title || 'New Notification';
        const notificationOptions = {
          body: payload.notification.body || 'You have a new message',
          icon: payload.notification.image || '/logo192.png',
          data: {
            url: '/hot-properties-map' // Same URL as in service worker
          }
        };
        
        // Show notification
        if (Notification.permission === 'granted') {
          navigator.serviceWorker.ready.then(registration => {
            registration.showNotification(notificationTitle, notificationOptions);
          });
        }
      }
      
      resolve(payload);
    });
  });

// Add this in your main app component to handle notification clicks
export const setupNotificationClickHandler = (navigate) => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'NOTIFICATION_CLICK') {
        const url = event.data.url || '/hot-properties-map';
        navigate(url);
      }
    });
  }
};
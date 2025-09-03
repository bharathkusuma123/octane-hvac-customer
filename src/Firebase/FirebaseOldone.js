import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported
} from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyDVp-QW_qn6chS_ymv0jZsY42nNVg3bOj8",
  authDomain: "hvac-d1f0f.firebaseapp.com",
  projectId: "hvac-d1f0f",
  storageBucket: "hvac-d1f0f.firebasestorage.app",
  messagingSenderId: "68719274682",
  appId: "1:68719274682:web:8faa0757d78eeaadc77083"
};

const app = initializeApp(firebaseConfig);

let messaging = null;

isSupported().then((supported) => {
  if (supported) {
    messaging = getMessaging(app);
  } else {
    console.warn("Firebase Messaging is not supported in this browser.");
  }
});

export const generateToken = async () => {
  if (!messaging) return null;

  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
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
    if (!messaging) return;
    onMessage(messaging, (payload) => {
      console.log("Message received. ", payload);

      if (payload.notification) {
        const notificationTitle = payload.notification.title || 'New Notification';
        const notificationOptions = {
          body: payload.notification.body || 'You have a new message',
          icon: payload.notification.image || '/logo192.png',
          data: {
            url: '/hot-properties-map'
          }
        };

        if (Notification.permission === 'granted') {
          navigator.serviceWorker.ready.then(registration => {
            registration.showNotification(notificationTitle, notificationOptions);
          });
        }
      }

      resolve(payload);
    });
  });

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

export { app, messaging };

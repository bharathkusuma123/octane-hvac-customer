importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

firebase.initializeApp({
  apiKey: "AIzaSyDVp-QW_qn6chS_ymv0jZsY42nNVg3bOj8",
  authDomain: "hvac-d1f0f.firebaseapp.com",
  projectId: "hvac-d1f0f",
  storageBucket: "hvac-d1f0f.firebasestorage.app",
  messagingSenderId: "68719274682",
  appId: "1:68719274682:web:8faa0757d78eeaadc77083"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Received background message:', payload);

  const notificationTitle = payload.notification?.title || 'New Notification';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new message',
    icon: payload.notification?.image || '/logo192.png',
    data: {
      url: '/servicemanager/service-pool', // Navigate here on click
      notificationId: payload.data?.notificationId || 'default-id',
    },
    actions: JSON.parse(payload.data?.actions || '[]'), // optional
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// ✅ SINGLE handler for notification clicks (including main & action clicks)
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.notification);
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Focus an existing client if available
      const matchingClient = clientList.find((client) => client.url.includes(urlToOpen));
      if (matchingClient) return matchingClient.focus();
      return clients.openWindow(urlToOpen);
    })
  );
});

// Optional: Handle notification close event
self.addEventListener('notificationclose', (event) => {
  console.log('[SW] Notification closed:', event.notification);
});

// Optional: If you want Accept/Reject buttons
self.addEventListener('notificationaction', (event) => {
  console.log('[SW] Notification action:', event.action);

  const notificationId = event.notification.data?.notificationId;
  const action = event.action;

  event.waitUntil(
    fetch('http://localhost:5000/handle-action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notificationId, action })
    })
    .then(res => res.json())
    .then(data => console.log('Action response:', data))
    .catch(err => console.error('Error sending action:', err))
  );
});

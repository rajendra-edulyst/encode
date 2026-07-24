importScripts('https://www.gstatic.com/firebasejs/11.1.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.1.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyAL69kXHSiWbyVyrxxOPgTkvbYGOQZQbac",
    authDomain: "encode-d92ce.firebaseapp.com",
    projectId: "encode-d92ce",
    storageBucket: "encode-d92ce.firebasestorage.app",
    messagingSenderId: "1036532864069",
    appId: "1:1036532864069:web:fd5edc5631a36248153f2c",
    measurementId: "G-9B2708D05B"
});


let messaging = null;

try {
    messaging = firebase.messaging();
} catch (err) {
    console.error("❌ Firebase messaging not supported in SW:", err);
}
if (messaging) {
    messaging.onBackgroundMessage((payload) => {
        console.log('[SW] Background message:', payload);

        const title =
            payload.notification?.title ||
            payload.data?.title ||
            "New Notification";

        const body =
            payload.notification?.body ||
            payload.data?.body ||
            "You have a new message";

        const data = payload.data || {};

        const options = {
            body,
            icon: payload.notification?.icon || '/favicon.ico',
            badge: '/favicon.ico',
            data: {
                ...data,
                fcmTitle: title,
                fcmBody: body,
            },
        };

        self.registration.showNotification(title, options);
    });
}

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    const data = event.notification?.data || {};
    const redirectUrl = data.redirect_url || '/';

    event.waitUntil(
        (async () => {
            try {
                const clientList = await self.clients.matchAll({
                    type: 'window',
                    includeUncontrolled: true,
                });


                for (const client of clientList) {
                    if (client.url.includes(self.location.origin)) {
                        client.postMessage({
                            type: 'FCM_NOTIFICATION_CLICK',
                            payload: {
                                title: data.fcmTitle || 'New Message',
                                body: data.fcmBody || '',
                                redirect_url: redirectUrl,
                            },
                        });

                        return client.focus();
                    }
                }


                return await self.clients.openWindow(redirectUrl);
            } catch (err) {
                console.error("❌ Notification click error:", err);
            }
        })()
    );
});

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});
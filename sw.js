// Bandit Racing League — Official Service Worker (PWA & Live Alerts)
const CACHE_NAME = 'brl-pwa-cache-v1';
const SUPABASE_URL = "https://iydgkfvfukaimhxyhdzq.supabase.co";
const SUPABASE_KEY = "sb_publishable_Zu-OJndOV2JZB0_C9_REnQ_oVCKo4u8";

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys.map((k) => {
                    if (k !== CACHE_NAME) {
                        return caches.delete(k);
                    }
                })
            )
        ).then(() => self.clients.claim())
    );
});

// Network-first fetch strategy so website updates are always instant
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;
    const url = new URL(event.request.url);
    if (url.origin !== self.location.origin) return;

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                if (response && response.status === 200 && response.type === 'basic') {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone)).catch(() => {});
                }
                return response;
            })
            .catch(() => caches.match(event.request))
    );
});

// Handle incoming Web Push events
self.addEventListener('push', (event) => {
    let payload = {
        title: '🏁 Bandit Racing League Alert',
        body: 'New update posted on banditracingleague.net!',
        url: '/index.html',
        tag: 'brl-alert-' + Date.now()
    };

    if (event.data) {
        try {
            const parsed = event.data.json();
            payload = Object.assign(payload, parsed);
        } catch (e) {
            payload.body = event.data.text();
        }
    }

    event.waitUntil(
        self.registration.showNotification(payload.title, {
            body: payload.body,
            icon: '/assets/app-icon-192.png',
            badge: '/assets/app-icon-192.png',
            vibrate: [200, 100, 200, 100, 300],
            tag: payload.tag || 'brl-live-alert',
            renotify: true,
            data: { url: payload.url || '/index.html' },
            actions: [
                { action: 'open', title: 'Open BRL App' },
                { action: 'dismiss', title: 'Dismiss' }
            ]
        })
    );
});

// Handle messages from the client page to trigger native OS notifications
self.addEventListener('message', (event) => {
    if (!event.data) return;
    if (event.data.type === 'SHOW_BRL_NOTIFICATION') {
        const { title, body, url, tag } = event.data;
        event.waitUntil(
            self.registration.showNotification(title || '🏁 Bandit Racing League', {
                body: body || 'Tap to view the latest Bandit Racing League update.',
                icon: '/assets/app-icon-192.png',
                badge: '/assets/app-icon-192.png',
                vibrate: [200, 100, 200, 100, 300],
                tag: tag || ('brl-notif-' + Date.now()),
                renotify: true,
                data: { url: url || '/index.html' },
                actions: [
                    { action: 'open', title: 'View Now' },
                    { action: 'dismiss', title: 'Dismiss' }
                ]
            })
        );
    }
});

// Handle notification tap
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    if (event.action === 'dismiss') return;

    const targetUrl = (event.notification.data && event.notification.data.url) ? event.notification.data.url : '/index.html';

    event.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            for (const client of clientList) {
                if (client.url.includes(self.location.origin) && 'focus' in client) {
                    client.navigate(targetUrl);
                    return client.focus();
                }
            }
            if (self.clients.openWindow) {
                return self.clients.openWindow(targetUrl);
            }
        })
    );
});

// Bandit Racing League — Official Service Worker (PWA & Live Alerts)
const CACHE_NAME = 'brl-pwa-cache-v5';
const STATE_CACHE_NAME = 'brl-pwa-state-v1';
const STATE_URL = '/__brl_sw_state__';
const ICON_URL = '/assets/app-icon-192.png?v=20261031';
const PRECACHE_ASSETS = [
    '/manifest.json?v=20261031',
    '/favicon.ico?v=20261031',
    '/assets/favicon-16x16.png?v=20261031',
    '/assets/favicon-32x32.png?v=20261031',
    '/assets/apple-touch-icon.png?v=20261031',
    '/assets/app-icon-192.png?v=20261031',
    '/assets/app-icon-512.png?v=20261031',
    '/assets/app-icon-maskable-192.png?v=20261031',
    '/assets/app-icon-maskable-512.png?v=20261031'
];
const SUPABASE_URL = "https://iydgkfvfukaimhxyhdzq.supabase.co";
const SUPABASE_KEY = "sb_publishable_Zu-OJndOV2JZB0_C9_REnQ_oVCKo4u8";

let swLastSeenNotifId = 0;

// Persist lastSeenNotifId in Cache Storage so it survives when mobile OS puts Service Worker to sleep
async function loadPersistedLastSeenId() {
    if (swLastSeenNotifId > 0) return swLastSeenNotifId;
    try {
        const cache = await caches.open(STATE_CACHE_NAME);
        const resp = await cache.match(STATE_URL);
        if (resp) {
            const data = await resp.json();
            if (data && data.lastSeenId) {
                swLastSeenNotifId = Math.max(swLastSeenNotifId, Number(data.lastSeenId) || 0);
            }
        }
    } catch (e) {}
    return swLastSeenNotifId;
}

async function savePersistedLastSeenId(id) {
    const numId = Number(id) || 0;
    if (numId <= 0) return;
    swLastSeenNotifId = Math.max(swLastSeenNotifId, numId);
    try {
        const cache = await caches.open(STATE_CACHE_NAME);
        await cache.put(
            STATE_URL,
            new Response(JSON.stringify({ lastSeenId: swLastSeenNotifId }), {
                headers: { 'Content-Type': 'application/json' }
            })
        );
    } catch (e) {}
}

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) =>
            Promise.allSettled(
                PRECACHE_ASSETS.map((url) =>
                    fetch(url, { cache: 'reload' }).then((resp) => {
                        if (resp && resp.status === 200) {
                            return cache.put(url, resp);
                        }
                    })
                )
            )
        ).catch(() => {})
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys.map((k) => {
                    if (k !== CACHE_NAME && k !== STATE_CACHE_NAME) {
                        return caches.delete(k);
                    }
                })
            )
        ).then(() => self.clients.claim())
    );
});

// Network-first fetch strategy so website & app updates are always instant on every device
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;
    const url = new URL(event.request.url);
    if (url.origin !== self.location.origin) return;
    if (url.pathname === STATE_URL) return;

    event.respondWith(
        fetch(event.request, { cache: 'no-store' })
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

// Background Periodic Sync / Sync for installed PWAs
async function checkSupabaseAlertsInBackground() {
    try {
        await loadPersistedLastSeenId();
        const resp = await fetch(`${SUPABASE_URL}/rest/v1/league_data?id=eq.2`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            },
            cache: 'no-store'
        });
        if (!resp.ok) return;
        const rows = await resp.json();
        if (!rows || !rows.length || !rows[0].data) return;
        const notifs = Array.isArray(rows[0].data.appNotifications) ? rows[0].data.appNotifications : [];
        if (!notifs.length) return;

        notifs.sort((a, b) => (b.id || 0) - (a.id || 0));
        const latest = notifs[0];
        const latestId = Number(latest.id) || 0;
        if (!latestId) return;

        // If no previous state was ever saved, notify if the alert was posted within the last 6 hours
        const isRecent = (Date.now() - latestId) < (6 * 3600 * 1000);
        if ((swLastSeenNotifId > 0 && latestId > swLastSeenNotifId) || (swLastSeenNotifId === 0 && isRecent)) {
            await savePersistedLastSeenId(latestId);
            await self.registration.showNotification(latest.title || '🏁 Bandit Racing League Alert', {
                body: latest.body || 'Tap to view the latest Bandit Racing League update.',
                icon: ICON_URL,
                badge: ICON_URL,
                vibrate: [200, 100, 200, 100, 300],
                tag: 'brl-notif-' + latestId,
                renotify: true,
                data: { url: latest.url || '/index.html', id: latestId },
                actions: [
                    { action: 'open', title: 'View Now' },
                    { action: 'dismiss', title: 'Dismiss' }
                ]
            });
        } else if (swLastSeenNotifId === 0) {
            await savePersistedLastSeenId(latestId);
        }
    } catch (e) {}
}

self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'brl-check-alerts') {
        event.waitUntil(checkSupabaseAlertsInBackground());
    }
});

self.addEventListener('sync', (event) => {
    if (event.tag === 'brl-check-alerts') {
        event.waitUntil(checkSupabaseAlertsInBackground());
    }
});

// Handle incoming W3C Web Push (VAPID) events even when the app is completely closed
self.addEventListener('push', (event) => {
    let payload = {
        id: Date.now(),
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

    const notifId = Number(payload.id) || Date.now();
    const notifTag = payload.tag || ('brl-notif-' + notifId);

    event.waitUntil(
        savePersistedLastSeenId(notifId).then(() =>
            self.registration.showNotification(payload.title || '🏁 Bandit Racing League Alert', {
                body: payload.body || 'Tap to view the latest Bandit Racing League update.',
                icon: ICON_URL,
                badge: ICON_URL,
                vibrate: [200, 100, 200, 100, 300],
                tag: notifTag,
                renotify: true,
                data: { url: payload.url || '/index.html', id: notifId },
                actions: [
                    { action: 'open', title: 'Open BRL App' },
                    { action: 'dismiss', title: 'Dismiss' }
                ]
            })
        )
    );
});

// Handle messages from the client page to trigger native OS notifications or sync state
self.addEventListener('message', (event) => {
    if (!event.data) return;
    if (event.data.type === 'SYNC_LAST_SEEN_ID' && event.data.id) {
        event.waitUntil(savePersistedLastSeenId(event.data.id));
        return;
    }
    if (event.data.type === 'CHECK_ALERTS_NOW') {
        event.waitUntil(checkSupabaseAlertsInBackground());
        return;
    }
    if (event.data.type === 'SHOW_BRL_NOTIFICATION') {
        const { title, body, url, tag, id } = event.data;
        event.waitUntil(
            (id ? savePersistedLastSeenId(id) : Promise.resolve()).then(() =>
                self.registration.showNotification(title || '🏁 Bandit Racing League', {
                    body: body || 'Tap to view the latest Bandit Racing League update.',
                    icon: ICON_URL,
                    badge: ICON_URL,
                    vibrate: [200, 100, 200, 100, 300],
                    tag: tag || ('brl-notif-' + (id || Date.now())),
                    renotify: true,
                    data: { url: url || '/index.html', id: id || Date.now() },
                    actions: [
                        { action: 'open', title: 'View Now' },
                        { action: 'dismiss', title: 'Dismiss' }
                    ]
                })
            )
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

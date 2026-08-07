const CACHE = 'parky-v5'; // CAMBIA VERSIONE

self.addEventListener('install', e => {e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./','./index.html','./manifest.json']))); self.skipWaiting();});
self.addEventListener('activate', e => {e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE && caches.delete(k))))); self.clients.claim();});
self.addEventListener('notificationclick', e => {e.notification.close(); e.waitUntil(clients.openWindow('./'));});
self.addEventListener('fetch', e => {e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));});

// QUESTO È OBBLIGATORIO PER LE ALARM
self.addEventListener('trigger', e => {
  if (e.name === 'showTriggeredNotification') {
    e.waitUntil(self.registration.showNotification(e.notification.title, e.notification.options));
  }
});
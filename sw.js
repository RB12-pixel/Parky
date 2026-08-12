const CACHE = 'parky-v5'; // alza la versione così si aggiorna
const FILES = ['./','./index.html','./manifest.json','./icon-192.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE && caches.delete(k))))
  );
  self.clients.claim();
});

// CACHE PER FUNZIONARE OFFLINE
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});

// CLICK SULLA NOTIFICA
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow('./index.html'));
});

// QUESTO SERVE PER FAR PARTIRE LE NOTIFICHE PROGRAMMATE
self.addEventListener('notificationclose', e => {
  // opzionale: se chiudi la notifica senza cliccare
});
const CACHE = 'parky-v2'; // ho cambiato v1 -> v2 così si aggiorna

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => {
      return cache.addAll([
        './',
        './index.html',
        './salva.html',
        './impostazioni.html',
        './manifest.json'
      ]);
    })
  );
  self.skipWaiting(); // forza aggiornamento
});

self.addEventListener('activate', e => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});

// NUOVO: QUANDO CLICCHI LA NOTIFICA
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow('index.html')); // apre l'app
});
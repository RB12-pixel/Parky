self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('parky-v1').then(cache => {
      return cache.addAll([
        './',
        './index.html',
        './salva.html',
        './impostazioni.html',
        './manifest.json'
      ]);
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});
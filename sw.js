const CACHE = 'parky-v7';
const FILES = ['./','./index.html','./manifest.json','./icon-192.png'];
let timerScadenza = null;
let timerPreavviso = null;

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE && caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});

// QUI RICEVIAMO I COMANDI DALL'APP
self.addEventListener('message', e => {
  if(e.data.type === 'CANCEL_TACHI'){
    clearTimeout(timerScadenza);
    clearTimeout(timerPreavviso);
  }
  
  if(e.data.type === 'SET_TACHI'){
    clearTimeout(timerScadenza);
    clearTimeout(timerPreavviso);
    
    const ora = Date.now();
    
    // TIMER PREAVVISO 5 MIN
    const diffPre = e.data.preavviso - ora;
    if(diffPre > 0){
      timerPreavviso = setTimeout(() => {
        self.registration.showNotification('⚠️ PARKY - Mancano 5 minuti', {
          body: 'Il disco scade tra poco. Preparati!',
          icon: './icon-192.png',
          tag: 'parky-preavviso'
        });
      }, diffPre);
    }
    
    // TIMER SCADENZA
    const diffScad = e.data.scadenza - ora;
    if(diffScad > 0){
      timerScadenza = setTimeout(() => {
        self.registration.showNotification('🚗 PARKY - TACHI SCADUTO!', {
          body: 'Sposta l\'auto prima della multa! 🔔',
          icon: './icon-192.png',
          tag: 'parky-scadenza',
          requireInteraction: true
        });
      }, diffScad);
    }
  }
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow('./index.html'));
});
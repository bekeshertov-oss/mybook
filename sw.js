const CACHE_NAME = 'braslav-static';

const STATIC_ASSETS = [
  '/mybook/style.css',
  '/mybook/manifest.json',
  '/mybook/icon-192.png',
  '/mybook/icon.png',
  '/mybook/1.png'
];

/* ===== INSTALL ===== */
self.addEventListener('install', event => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
  );
});

/* ===== ACTIVATE ===== */
self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

/* ===== FETCH ===== */
self.addEventListener('fetch', event => {

  // HTML всегда из сети — без кэша
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request));
    return;
  }

  // Остальное: cache first
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

const CACHE_NAME = 'braslav-static';
const ASSETS = [
  '/mybook/style.css',
  '/mybook/icon-192.png',
  '/mybook/icon.png',
  '/mybook/1.png'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  // HTML всегда из сети — моментальное обновление
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request));
    return;
  }

  // Остальное: cache first
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

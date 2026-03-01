const CACHE_NAME = 'braslav-sea-v3'; // ← МЕНЯЙ ВЕРСИЮ

const STATIC_ASSETS = [
  '/mybook/',
  '/mybook/index.html',
  '/mybook/style.css',
  '/mybook/manifest.json',
  '/mybook/icon-192.png',
  '/mybook/icon.png',
  '/mybook/1.png',
  '/mybook/offline.html'
];

/* ===== INSTALL ===== */
self.addEventListener('install', event => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
});

/* ===== ACTIVATE ===== */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

/* ===== FETCH ===== */
self.addEventListener('fetch', event => {

  // HTML — всегда пробуем сеть
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache =>
            cache.put(event.request, copy)
          );
          return response;
        })
        .catch(() => caches.match('/mybook/offline.html'))
    );
    return;
  }

  // Остальное — cache first
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

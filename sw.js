const CACHE_NAME = 'braslav-sea-v2'; // меняй версию при обновлении

const ASSETS = [
  '/mybook/',
  '/mybook/index.html',
  '/mybook/style.css',
  '/mybook/manifest.json',
  '/mybook/icon-192.png',
  '/mybook/icon.png',
  '/mybook/1.png'
];

// ===== INSTALL =====
self.addEventListener('install', (event) => {
  self.skipWaiting(); // активировать сразу

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// ===== ACTIVATE =====
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim()) // применить сразу
  );
});

// ===== FETCH (network first для HTML) =====
self.addEventListener('fetch', (event) => {

  // Для HTML — сначала сеть, потом кэш
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Для остальных файлов — cache first
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

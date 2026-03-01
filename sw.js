const CACHE_NAME = 'braslav-sea-v1';
const ASSETS = [
  '/mybook/',
  '/mybook/index.html',
  '/mybook/style.css',
  '/mybook/manifest.json',
  '/mybook/icon-192.png',
  '/mybook/icon.png',
  '/mybook/1.png'
];

// Установка Service Worker и кэширование ресурсов
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Активация и удаление старого кэша
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

// Ответ из кэша (позволяет приложению открываться мгновенно)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

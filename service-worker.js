const cacheName = 'organizador-ftk-v1';
const filesToCache = [
    '/testes/',
    '/testes/index.html',
    '/testes/mobile.html',
    '/testes/style.css',
    '/testes/style-mobile.css',
    '/testes/main.js',
    '/testes/mobile.js',
    '/testes/Organizador FTK.png'
];

// Instala o service worker
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(filesToCache);
    })
  );
});

// Ativa e atualiza o service worker
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== cacheName) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// Intercepta requisições e serve o cache
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});

const cacheName = 'frservices-v1';
const filesToCache = [
  '/testes/',
  '/testes/index.html',
  '/testes/mobile.html',
  '/testes/style.css',
  '/testes/style-mobile.css',
  '/testes/main.js',
  '/testes/mobile.js',
  '/testes/LogoAPP.jpg'
];

self.addEventListener('install', (e) => {
  console.log('[F&R Services SW] Instalando...');
  e.waitUntil(
    caches.open(cacheName).then((cache) => {
      console.log('[F&R Services SW] Cache adicionando arquivos...');
      return cache.addAll(filesToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  console.log('[F&R Services SW] Ativando e limpando caches antigos...');
  e.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== cacheName) {
            console.log('[F&R Services SW] Removendo cache antigo:', key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      if (response) {
        console.log('[F&R Services SW] Servindo do cache:', e.request.url);
        return response;
      }
      console.log('[F&R Services SW] Buscando da rede:', e.request.url);
      return fetch(e.request).catch(() => {
        return caches.match('Sem internet');
      });
    })
  );
});

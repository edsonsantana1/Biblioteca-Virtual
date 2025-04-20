// Service Worker - sw.js
const CACHE_NAME = 'biblioteca-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/main.js',
  '/js/bookDetails.js',
  '/src/icons/ic_launcher.png',  // ícone de 192x192
  '/src/icons/512.png',         // ícone de 512x512
  '/offline.html'           
];

// Instalação: pré-cache dos recursos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Ativação: limpeza de caches antigos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Intercepta requests: retorna do cache ou busca na rede
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        return cachedResponse || fetch(event.request)
          .catch(() => caches.match('/offline.html'));
      })
  );
});

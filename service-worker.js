const CACHE_NAME = 'pwa-cache-v1';
const urlsToCache = [
  '/Gangsterz400/',
  '/Gangsterz400/index.html',
  '/Gangsterz400/script.js',
  '/Gangsterz400/manifest.json',
  '/Gangsterz400/icon-192.jpg',
  '/Gangsterz400/icon-512.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
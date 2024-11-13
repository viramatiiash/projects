const CACHE_NAME = 'audio-guide-cache';

const urlsToCache = [
  './',
  './index.html',
  './script.js',
  './style.css',
  './assets/audio/barcelona.mp3',
  './assets/audio/berlin.mp3',
  './assets/audio/berlin-2.mp3',
  './assets/audio/ivano-frankivsk.mp3',
  './assets/audio/paris.mp3',
  './assets/audio/texas.mp3',
  './assets/audio/to-ye-lviv.mp3',
  './assets/audio/cairo.mp3',
  './assets/audio/oslo.mp3',
  './assets/audio/mexiko.mp3',
  './assets/audio/tokyo.mp3',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  console.log('Service Worker встановлено');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker активовано');
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName); 
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response; 
      }
      return fetch(event.request); 
    })
  );
});

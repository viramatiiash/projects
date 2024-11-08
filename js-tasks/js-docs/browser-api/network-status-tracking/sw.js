const CACHE_NAME = 'offline-cache';

const queuedRequests = [];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(['./index.html', './script.js', './style.css']);
    })
  );
  console.log('Service Worker встановлено');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker активовано');
  return self.clients.claim();
});

const saveRequestToQueue = async (request) => {
  console.log('Запит збережено в черзі для відправлення');
  queuedRequests.push(request);
};

self.addEventListener('fetch', (event) => {
  if (event.request.method === 'POST') {
    if (!navigator.onLine) {
      event.respondWith(
        (async () => {
          saveRequestToQueue(event.request.clone());
          return new Response(
            JSON.stringify({
              success: false,
              message:
                'Запит збережено для відправлення після відновлення з’єднання',
            }),
            {
              headers: { 'Content-Type': 'application/json' },
            }
          );
        })()
      );
    } else {
      event.respondWith(fetch(event.request));
    }
  } else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});

self.addEventListener('sync', async () => {
  if (navigator.onLine && queuedRequests.length > 0) {
    for (const request of queuedRequests) {
      await fetch(request.clone());
    }
    queuedRequests.length = 0;
  }
});

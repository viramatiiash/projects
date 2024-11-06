let cacheHits = 0;
let cacheMisses = 0;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('static-cache').then((cache) => {
      console.log('Додаємо файли в static-cache');
      return cache.addAll([
        './', 
        './index.html', 
        './style.css', 
        './script.js',
      ]);
    })
  );
  console.log('Service Worker встановлено');
  self.skipWaiting(); 
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker активовано');
  return self.clients.claim(); 
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  console.log(`Обробка запиту: ${event.request.url}`);

  if (url.origin === location.origin) {
    console.log(
      `Використання стратегії Cache First для статичного ресурсу: ${event.request.url}`
    );
    event.respondWith(cacheFirst(event.request));
  } else {
    console.log(
      `Використання стратегії Network First для динамічного ресурсу: ${event.request.url}`
    );
    event.respondWith(networkFirst(event.request));
  }
});

const cacheFirst = (request) => {
  return caches.match(request).then((cachedResponse) => {
    if (cachedResponse) {
      cacheHits++; 
      console.log(`Завантажено з кешу (Cache First): ${request.url}`);
      return cachedResponse;
    }
    cacheMisses++; 
    console.log(`Запит з мережі для ресурсу (Cache First): ${request.url}`);
    return fetch(request).then((networkResponse) => {
      return caches.open('static-cache').then((cache) => {
        console.log(`Кешування нового ресурсу (Cache First): ${request.url}`);
        cache.put(request, networkResponse.clone());
        return networkResponse;
      });
    });
  });
}

const fetchWithTimeout = (request, timeout = 5000) => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Запит перевищив час очікування'));
    }, timeout);

    fetch(request)
      .then((response) => {
        clearTimeout(timer);
        resolve(response);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
}

const networkFirst = (request) => {
  console.log(`Спроба запиту з мережі (Network First): ${request.url}`);
  return fetchWithTimeout(request)
    .then((networkResponse) => {
      cacheHits++;
      console.log(
        `Отримано відповідь з мережі і кешується (Network First): ${request.url}`
      );
      return caches.open('dynamic-cache').then((cache) => {
        cache.put(request, networkResponse.clone());
        return networkResponse;
      });
    })
    .catch((error) => {
      cacheMisses++;
      console.error(`Помилка мережевого запиту: ${error.message}`);
      console.log(
        `Завантажено з кешу через відсутність мережі (Network First): ${request.url}`
      );
      return caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        } else {
          console.error(`Ресурс не знайдено в кеші: ${request.url}`);
          return new Response('Ресурс не знайдено', {
            status: 404,
            headers: { 'Content-Type': 'text/plain' },
          });
        }
      });
    });
}

const getCacheHitPercentage = () => {
  if (cacheHits + cacheMisses === 0) {
    return 0;
  }
  return (cacheHits / (cacheHits + cacheMisses)) * 100;
}

const logCacheMetrics = () => {
  const hitPercentage = getCacheHitPercentage();
  console.log(`Відсоток запитів, обслужених з кешу: ${hitPercentage.toFixed(2)}%`);
  console.log(`Загальна кількість запитів з кешу: ${cacheHits}`);
  console.log(`Загальна кількість промахів: ${cacheMisses}`);
}

setInterval(logCacheMetrics, 30000);

self.addEventListener('message', (event) => {
  const { action, url } = event.data;

  switch (action) {
    case 'cacheResource':
      cacheResource(url);
      break;
    case 'deleteResource':
      deleteResource(url);
      break;
    case 'updateResource':
      updateResource(url);
      break;
    default:
      console.log(`Невідома дія: ${action}`);
  }
});

const cacheResource = (url) => {
  caches.open('dynamic-cache').then((cache) => {
    fetch(url).then((response) => {
      if (response.ok) {
        cache.put(url, response);
        console.log(`Ресурс додано до кешу: ${url}`);
      }
    });
  });
}

const deleteResource = (url) => {
  caches.open('dynamic-cache').then((cache) => {
    cache.delete(url).then((success) => {
      if (success) {
        console.log(`Ресурс видалено з кешу: ${url}`);
      } else {
        console.log(`Не вдалося видалити ресурс: ${url}`);
      }
    });
  });
}

const updateResource = (url) => {
  caches.open('dynamic-cache').then((cache) => {
    fetch(url).then((response) => {
      if (response.ok) {
        cache.put(url, response);
        console.log(`Ресурс оновлено в кеші: ${url}`);
      }
    });
  });
}

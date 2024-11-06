/*
Завдання: Розробка кешувального проксі-сервера за допомогою Service Worker

Мета: Розробити кешувальний проксі-сервер з використанням Service Worker для оптимізації мережевих запитів до різних API.

Технічні вимоги:

? Настройка Service Worker:
[+] Ініціалізуйте та зареєструйте Service Worker у вашому додатку.
[+] Реалізуйте обробку подій fetch у Service Worker для перехоплення всіх вихідних HTTP запитів.

? Розробка алгоритму кешування:

[+] Створіть алгоритм, який визначає, коли відповідь на запит слід кешувати, і коли її слід повторно використовувати.
[+] Використовуйте Cache API для зберігання і керування кешованими відповідями.
[+] Розробіть стратегію кешування, яка оптимально підходить для вашого додатка (наприклад, Cache First, Network First, Stale While Revalidate).

? Обробка запитів та відповідей:

[+] Реалізуйте логіку для перевірки наявності даних у кеші перед відправленням запиту до мережі.
[+] Забезпечте можливість обробки помилок та таймаутів запитів, щоб забезпечити стабільність додатка навіть при нестабільному інтернет-з'єднанні.

? Додаткові завдання для розширення проекту:

[+] Динамічне управління кешем: Розробіть інтерфейс для динамічного управління ресурсами у кеші (додавання, видалення, оновлення).
[+] Аналітика використання кешу: Впровадіть збір метрик для аналізу ефективності кешування, наприклад, відсоток запитів, обслужених з кешу.
*/

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('./sw.js')
    .then((registration) => {
      console.log('Service Worker зареєстровано');
    })
    .catch((err) =>
      console.error('Не вдалося зареєструвати Service Worker:', err)
    );

  navigator.serviceWorker.ready
    .then((registration) => {
      if ('sync' in registration) {
        return registration.sync.register('syncdata');
      }
      throw new Error('Фонова синхронізація не підтримується');
    })
    .then(() => console.log('Синхронізація зареєстрована'))
    .catch((err) => console.error('Помилка фонової синхронізації:', err));
}

    function sendMessageToSW(message) {
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage(message);
      } else {
        console.log("Service Worker не знайдено.");
      }
    }

    function cacheResource() {
      const url = document.getElementById('resourceUrl').value;
      sendMessageToSW({ action: 'cacheResource', url });
    }

    function deleteResource() {
      const url = document.getElementById('resourceUrl').value;
      sendMessageToSW({ action: 'deleteResource', url });
    }

    function updateResource() {
      const url = document.getElementById('resourceUrl').value;
      sendMessageToSW({ action: 'updateResource', url });
    }
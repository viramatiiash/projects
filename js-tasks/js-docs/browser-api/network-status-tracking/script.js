/* Завдання: Застосунок для відстеження статусу мережевого з'єднання з використанням Service Workers і Fetch API

Опис завдання: Розробіть додаток, який використовує Service Workers для кешування даних та забезпечення функціональності офлайн з можливістю синхронізації даних при відновленні з'єднання.

Технічні вимоги:

[+] Кешування даних: Використовуйте Service Workers для кешування зовнішніх запитів до API, що забезпечує доступ до збережених даних навіть без інтернет-з'єднання.

[+] Функціональність офлайн: Забезпечте можливість перегляду та взаємодії з даними у режимі офлайн.

[+] Синхронізація даних: Використовуйте Fetch API для відправлення зібраних офлайн даних на сервер після відновлення інтернет-з'єднання. Використовуйте підходи, що відрізняються від XMLHttpRequest, такі як Promises для керування асинхронними запитами.
*/

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then((registration) => {
    console.log('Service Worker зареєстровано:', registration);
  }).catch((error) => {
    console.error('Помилка реєстрації Service Worker:', error);
  });
}

document.getElementById('sendData').addEventListener('click', async () => {
  try {
    const response = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: 'Ваші дані тут' }),
    });

    const result = await response.json();
    console.log('Відповідь сервера:', result);
  } catch (error) {
    console.error(
      'Запит збережено для відправлення після відновлення з’єднання'
    );
  }
});
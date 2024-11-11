/* Завдання: Чат-додаток із використанням WebSockets

Опис завдання: Створіть чат-додаток, який дозволяє користувачам спілкуватися в реальному часі. Використовуйте WebSockets для забезпечення двостороннього зв'язку між клієнтами та сервером.

Технічні вимоги:

[+] Створення WebSocket-сервера: Реалізуйте сервер, який може обробляти множину одночасних підключень користувачів.

[+] Інтерфейс користувача для чату: Використовуйте HTML/CSS/JS для створення користувацького інтерфейсу, де користувачі можуть вводити та отримувати повідомлення.

[+] Безпека з'єднань: Забезпечте безпеку зв'язку через SSL/TLS і розгляньте міркування безпеки, такі як XSS та CSRF захисти.

[] Повідомлення про статус: Додайте функціональність, щоб користувачі могли бачити, чи є інші користувачі онлайн. */

const ws = new WebSocket('wss://localhost:8080');
let username = '';
const tick = `
<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#00000"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>
`;

// Коли з'єднання встановлено
ws.onopen = () => {
  console.log('Підключено до WebSocket-сервера');
};

function saveUsername() {
  const usernameInput = document.getElementById('username');
  username = usernameInput.value.trim();

  if (username) {
    document.getElementById('username-saved').classList.remove('hidden');
    document.getElementById('message-container').classList.remove('hidden');
    console.log('Ім’я збережено:', username);
    document.getElementById('topbar').style.display = 'block';
    document.getElementById('main-title').style.display = 'none';
    document.getElementById('username-container').classList.add('hidden');
    document.getElementById('chat').style.display = 'block';
    document.getElementById('messages').style.display = 'block';

    // Надіслати повідомлення про підключення без прив'язки до конкретного користувача
    ws.send(
      JSON.stringify({
        message: `User ${username} has joined the chat.`,
        systemMessage: true,
      })
    );
  } else {
    alert('Please, enter your nickname.');
  }
}

ws.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data); // Парсинг отриманих даних з JSON

    // Якщо це системне повідомлення (про підключення), то воно не має бути частиною чат-потоку
    if (data.systemMessage) {
      const systemMessage = document.createElement('div');
      systemMessage.classList.add('system-message');

      // Додаємо контейнер з іконкою
      const icon = document.createElement('div');
      icon.classList.add('iconContainer');
      icon.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
      <path d="M320-200v-560l440 280-440 280Zm80-280Zm0 134 210-134-210-134v268Z"/>
    </svg>
  `;
      systemMessage.appendChild(icon);

      // Додаємо текстове повідомлення
      const messageText = document.createElement('span');
      messageText.classList.add('messageText');
      messageText.innerText = data.message;
      systemMessage.appendChild(messageText);

      document.getElementById('messages').appendChild(systemMessage); // Додавання до чату
      return; // Виходимо, щоб не додавати це як звичайне повідомлення
    }

    // Відображаємо повідомлення як звичайне повідомлення в чаті
    const listItem = document.createElement('li');
    listItem.innerHTML = `<span><span class="online"></span>${data.username}</span> ${data.message}`; // Відображення імені користувача та повідомлення
    document.getElementById('messages').appendChild(listItem); // Додавання до списку повідомлень
  } catch (error) {
    console.error('Помилка при обробці отриманого повідомлення:', error);
  }
};

// Функція надсилання повідомлення
function sendMessage() {
  const messageInput = document.getElementById('messageInput');
  const message = messageInput.value.trim();

  if (message && username) {
    // Перевірка, чи є ім'я та повідомлення
    ws.send(JSON.stringify({ type: 'message', username, message })); // Відправка повідомлення з ім'ям
    messageInput.value = ''; // Очищення поля вводу повідомлення
  } else if (!username) {
    alert("Спершу введіть і збережіть ваше ім'я.");
  }
}

// Обробка помилок з'єднання
ws.onerror = (error) => {
  console.error('WebSocket помилка:', error);
};

// Коли з'єднання закрите
ws.onclose = () => {
  console.log("З'єднання закрито");
};

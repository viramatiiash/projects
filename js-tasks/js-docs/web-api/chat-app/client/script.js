/* Завдання: Чат-додаток із використанням WebSockets

Опис завдання: Створіть чат-додаток, який дозволяє користувачам спілкуватися в реальному часі. Використовуйте WebSockets для забезпечення двостороннього зв'язку між клієнтами та сервером.

Технічні вимоги:

[+] Створення WebSocket-сервера: Реалізуйте сервер, який може обробляти множину одночасних підключень користувачів.

[+] Інтерфейс користувача для чату: Використовуйте HTML/CSS/JS для створення користувацького інтерфейсу, де користувачі можуть вводити та отримувати повідомлення.

[+] Безпека з'єднань: Забезпечте безпеку зв'язку через SSL/TLS і розгляньте міркування безпеки, такі як XSS та CSRF захисти.

[+] Повідомлення про статус: Додайте функціональність, щоб користувачі могли бачити, чи є інші користувачі онлайн. */

const ws = new WebSocket('wss://localhost:8080');
let username = '';
let usersOnlineStatus = {};

ws.onopen = () => {
  console.log('Підключено до WebSocket-сервера');
};

const saveUsername = () => {
  const usernameInput = document.getElementById('username');
  username = usernameInput.value.trim();

  if (username) {
    const showNotification = () => {
      const notification = document.getElementById('username-saved');
      notification.classList.add('show');
      setTimeout(() => {
        notification.classList.remove('show');
      }, 3000);
    };
    showNotification();

    document.getElementById('message-container').classList.remove('hidden');
    document.getElementById('topbar').style.display = 'block';
    document.getElementById('main-title').style.display = 'none';
    document.getElementById('username-container').classList.add('hidden');
    document.getElementById('chat').style.display = 'block';
    document.getElementById('messages').style.display = 'block';

    ws.send(
      JSON.stringify({
        message: `User ${username} has joined the chat.`,
        systemMessage: true,
        username,
      })
    );
  } else {
    alert('Please, enter your nickname.');
  }
};

ws.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data);

    if (data.systemMessage) {
      if (data.message.includes('joined the chat')) {
        userConnected(data.username);
      }

      if (data.message.includes('left the chat')) {
        userDisconnected(data.username);
      }

      const systemMessage = document.createElement('div');
      systemMessage.classList.add('system-message');

      const icon = document.createElement('div');
      icon.classList.add('iconContainer');
      icon.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
      <path d="M320-200v-560l440 280-440 280Zm80-280Zm0 134 210-134-210-134v268Z"/>
    </svg>
  `;
      systemMessage.appendChild(icon);

      const messageText = document.createElement('span');
      messageText.classList.add('messageText');
      messageText.innerText = data.message;
      systemMessage.appendChild(messageText);

      document.getElementById('messages').appendChild(systemMessage);
      return;
    }

    const userStatus = usersOnlineStatus[data.username] || 'offline';
    const listItem = document.createElement('li');
    listItem.innerHTML = `<span>${data.username}<sup class="online">${userStatus}</sup></span> ${data.message}`;
    document.getElementById('messages').appendChild(listItem);
  } catch (error) {
    console.error('Помилка при обробці отриманого повідомлення:', error);
  }
};

const sendMessage = () => {
  const messageInput = document.getElementById('messageInput');
  const message = messageInput.value.trim();

  if (message && username) {
    ws.send(JSON.stringify({ type: 'message', username, message }));
    messageInput.value = '';
    userConnected(username);
  } else if (!username) {
    alert("Спершу введіть і збережіть ваше ім'я.");
  }
};

messageInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    sendMessage();
  }
});

ws.onerror = (error) => {
  console.error('WebSocket помилка:', error);
};

window.addEventListener('beforeunload', () => {
  if (username) {
    ws.send(
      JSON.stringify({
        message: `User ${username} has left the chat.`,
        systemMessage: true,
        username,
      })
    );
    usersOnlineStatus[username] = 'offline';
  }
});

ws.onclose = () => {
  console.log("З'єднання закрито");
  usersOnlineStatus[username] = 'offline';
  updateUserStatus(username, 'offline');
  userDisconnected(username);
};

const updateUserStatus = (username, status) => {
  usersOnlineStatus[username] = status;
  const allMessages = document.querySelectorAll('#messages li');
  allMessages.forEach((message) => {
    if (message.innerHTML.includes(username)) {
      const statusElement =
        message.querySelector('.online') || message.querySelector('.offline');
      if (statusElement) {
        statusElement.textContent = status;
        statusElement.className = status;
      }
    }
  });
};

function userConnected(username) {
  usersOnlineStatus[username] = 'online';
  updateUserStatus(username, 'online');
}

function userDisconnected(username) {
  usersOnlineStatus[username] = 'offline';
  updateUserStatus(username, 'offline');
}

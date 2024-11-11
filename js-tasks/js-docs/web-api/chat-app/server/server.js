const WebSocket = require('ws');
const fs = require('fs');
const https = require('https');

const server = https.createServer({
  cert: fs.readFileSync('server.cert'),
  key: fs.readFileSync('server.key'),
});
const wss = new WebSocket.Server({ server });

let clients = [];

wss.on('connection', (ws) => {
  clients.push(ws);
  console.log("Клієнт підключився через захищене з'єднання");

  ws.on('message', (message) => {
    const data = JSON.parse(message); // Парсинг JSON від клієнта
    console.log('Отримано повідомлення:', data);

    // Якщо це системне повідомлення, то не відправляти його як повідомлення від користувача
    if (data.systemMessage) {
      // Відправка системного повідомлення всім клієнтам
      clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data)); // Відправка системного повідомлення всім клієнтам
        }
      });
    } else {
      // Якщо це звичайне повідомлення, надсилаємо його всім клієнтам як звичайне повідомлення
      clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data)); // Відправка звичайного повідомлення
        }
      });
    }
  });

ws.on('close', () => {
  clients = clients.filter((client) => client !== ws);
  console.log('Клієнт відключився');
});
});

server.listen(8080, () => {
  console.log('Сервер запущено на https://localhost:8080');
});

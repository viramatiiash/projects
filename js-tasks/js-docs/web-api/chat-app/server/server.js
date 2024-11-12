const WebSocket = require('ws');
const fs = require('fs');
const https = require('https');

const server = https.createServer({
  cert: fs.readFileSync('server.cert'),
  key: fs.readFileSync('server.key'),
});
const wss = new WebSocket.Server({ server });

function broadcast(data) {
  const message = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

wss.on('connection', (ws) => {
  console.log("Клієнт підключився через захищене з'єднання");

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('Отримано повідомлення:', data);
      broadcast(data);
    } catch (error) {
      console.error('Помилка парсингу повідомлення:', error);
    }
  });

  ws.on('close', () => {
    console.log('Клієнт відключився');
  });
});

server.listen(8080, () => {
  console.log('Сервер запущено на https://localhost:8080');
});

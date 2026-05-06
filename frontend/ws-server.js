const WebSocket = require('ws');

const PORT = 5000;
const wss = new WebSocket.Server({ port: PORT });

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (msg) => {
    console.log('Received:', msg);
    ws.send(`Server received: ${msg}`);
  });

  ws.on('close', () => console.log('Client disconnected'));
});

console.log(`WebSocket server running on ws://localhost:${PORT}`);

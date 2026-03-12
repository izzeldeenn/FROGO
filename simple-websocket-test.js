const WebSocket = require('ws');

console.log('Creating simple WebSocket server...');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  console.log('Client connected');
  
  ws.on('message', function incoming(message) {
    console.log('received:', message.toString());
    ws.send('Echo: ' + message.toString());
  });
  
  ws.on('close', function close() {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server started on port 8080');

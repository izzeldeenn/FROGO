console.log('Starting WebSocket server...');

// Import and initialize the WebSocket manager
const { wsManager } = require('../src/lib/websocket-server');

console.log('WebSocket server is running on port 8080');

// Keep the process running
process.on('SIGINT', () => {
  console.log('Shutting down WebSocket server...');
  wsManager.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Shutting down WebSocket server...');
  wsManager.close();
  process.exit(0);
});

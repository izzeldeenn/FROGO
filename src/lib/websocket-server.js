const WebSocketServer = require('ws');

class WebSocketManager {
  constructor() {
    this.wss = null;
    this.clients = new Set();
  }

  initializeServer() {
    if (this.wss) return;

    try {
      this.wss = new WebSocketServer({ 
        port: 8080
      });

      this.wss.on('connection', (ws) => {
        console.log('New WebSocket client connected');
        this.clients.add(ws);

        // Send initial leaderboard when client connects
        this.sendInitialLeaderboard(ws);

        ws.on('message', async (message) => {
          try {
            const data = JSON.parse(message);
            
            if (data.type === 'update_device') {
              // Simple database update simulation
              console.log('Device update received:', data);
              // Broadcast updated leaderboard to all clients
              await this.broadcastLeaderboard();
            }
          } catch (error) {
            console.error('Error processing WebSocket message:', error);
          }
        });

        ws.on('close', () => {
          console.log('WebSocket client disconnected');
          this.clients.delete(ws);
        });

        ws.on('error', (error) => {
          console.error('WebSocket error:', error);
          this.clients.delete(ws);
        });
      });

      console.log('WebSocket server initialized on port 8080');
    } catch (error) {
      console.error('Error initializing WebSocket server:', error);
    }
  }

  async sendInitialLeaderboard(ws) {
    try {
      // Get real data from database
      const { getAllDevices } = require('./sqlite');
      const devices = await getAllDevices();
      
      const update = {
        type: 'leaderboard_update',
        data: devices
      };
      
      if (ws.readyState === 1) { // WebSocket.OPEN
        ws.send(JSON.stringify(update));
      }
    } catch (error) {
      console.error('Error sending initial leaderboard:', error);
    }
  }

  async broadcastLeaderboard() {
    try {
      // Get real data from database
      const { getAllDevices } = require('./sqlite');
      const devices = await getAllDevices();
      
      const update = {
        type: 'leaderboard_update',
        data: devices
      };

      const message = JSON.stringify(update);
      
      // Send to all connected clients
      this.clients.forEach(client => {
        if (client.readyState === 1) { // WebSocket.OPEN
          client.send(message);
        }
      });
    } catch (error) {
      console.error('Error broadcasting leaderboard:', error);
    }
  }

  // Public method to trigger leaderboard broadcast
  async broadcastUpdate() {
    await this.broadcastLeaderboard();
  }

  close() {
    if (this.wss) {
      this.wss.close();
      this.wss = null;
    }
  }
}

// Create singleton instance
const wsManager = new WebSocketManager();

// Initialize the server immediately
try {
  wsManager.initializeServer();
} catch (error) {
  console.error('Failed to initialize WebSocket server:', error);
}

// Export the manager
module.exports = { wsManager };

import { WebSocketServer, WebSocket } from 'ws';
import { dbOperations } from './sqlite';

interface LeaderboardUpdate {
  type: 'leaderboard_update';
  data: any[];
}

interface ClientMessage {
  type: 'update_device';
  deviceId: string;
  updates: any;
}

export class WebSocketManager {
  private wss: WebSocketServer | null = null;
  private clients: Set<WebSocket> = new Set();

  constructor() {
    this.initializeServer();
  }

  private initializeServer() {
    if (this.wss) return;

    this.wss = new WebSocketServer({ 
      port: 8080,
      path: '/ws'
    });

    this.wss.on('connection', (ws: WebSocket) => {
      console.log('New WebSocket client connected');
      this.clients.add(ws);

      // Send initial leaderboard when client connects
      this.sendInitialLeaderboard(ws);

      ws.on('message', async (message: string) => {
        try {
          const data: ClientMessage = JSON.parse(message);
          
          if (data.type === 'update_device') {
            // Update database
            await dbOperations.updateDevice(data.deviceId, {
              ...data.updates,
              last_active: new Date().toISOString()
            });

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
  }

  private async sendInitialLeaderboard(ws: WebSocket) {
    try {
      const devices = await dbOperations.getAllDevices();
      const update: LeaderboardUpdate = {
        type: 'leaderboard_update',
        data: devices
      };
      
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(update));
      }
    } catch (error) {
      console.error('Error sending initial leaderboard:', error);
    }
  }

  private async broadcastLeaderboard() {
    try {
      const devices = await dbOperations.getAllDevices();
      const update: LeaderboardUpdate = {
        type: 'leaderboard_update',
        data: devices
      };

      const message = JSON.stringify(update);
      
      // Send to all connected clients
      this.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    } catch (error) {
      console.error('Error broadcasting leaderboard:', error);
    }
  }

  // Public method to trigger leaderboard broadcast (called from API routes)
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

// Singleton instance
export const wsManager = new WebSocketManager();

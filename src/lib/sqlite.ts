import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(process.cwd(), 'data', 'devices.db');

// Ensure data directory exists
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);

// Initialize database
export function initializeDatabase() {
  // Create devices table if it doesn't exist
  const createTable = db.prepare(`
    CREATE TABLE IF NOT EXISTS devices (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      avatar TEXT DEFAULT '🖥️',
      score INTEGER DEFAULT 0,
      rank INTEGER DEFAULT 0,
      study_time INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      last_active TEXT NOT NULL
    )
  `);
  
  createTable.run();
}

// Database operations
export const dbOperations = {
  // Get all devices ordered by score
  getAllDevices: () => {
    const stmt = db.prepare('SELECT * FROM devices ORDER BY score DESC');
    return stmt.all();
  },

  // Get device by ID
  getDeviceById: (id: string) => {
    const stmt = db.prepare('SELECT * FROM devices WHERE id = ?');
    return stmt.get(id);
  },

  // Insert or update device
  upsertDevice: (device: {
    id: string;
    name: string;
    avatar?: string;
    score: number;
    rank: number;
    study_time: number;
    created_at: string;
    last_active: string;
  }) => {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO devices (id, name, avatar, score, rank, study_time, created_at, last_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    return stmt.run(
      device.id,
      device.name,
      device.avatar || '🖥️',
      device.score,
      device.rank,
      device.study_time,
      device.created_at,
      device.last_active
    );
  },

  // Update device
  updateDevice: (id: string, updates: {
    name?: string;
    avatar?: string;
    score?: number;
    rank?: number;
    study_time?: number;
    last_active?: string;
  }) => {
    try {
      console.log('SQLite updateDevice called:', { id, updates });
      
      // Check if there are any updates to apply
      const updateKeys = Object.keys(updates);
      if (updateKeys.length === 0) {
        console.log('No updates to apply');
        return { changes: 0 }; // No updates to apply
      }
      
      const fields = updateKeys.map(key => `${key} = ?`).join(', ');
      const values = Object.values(updates);
      
      console.log('SQL Query:', `UPDATE devices SET ${fields} WHERE id = ?`);
      console.log('Values:', [...values, id]);
      
      const stmt = db.prepare(`UPDATE devices SET ${fields} WHERE id = ?`);
      const result = stmt.run(...values, id);
      
      console.log('Update result:', result);
      return result;
    } catch (error) {
      console.error('SQLite updateDevice error:', error);
      throw error;
    }
  },

  // Delete device
  deleteDevice: (id: string) => {
    const stmt = db.prepare('DELETE FROM devices WHERE id = ?');
    return stmt.run(id);
  }
};

// Initialize on import
initializeDatabase();

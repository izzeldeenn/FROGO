import { createClient } from '@libsql/client';

console.log('TURSO_DATABASE_URL:', process.env.TURSO_DATABASE_URL ? 'SET' : 'NOT SET');
console.log('TURSO_AUTH_TOKEN:', process.env.TURSO_AUTH_TOKEN ? 'SET' : 'NOT SET');

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL || '',
  authToken: process.env.TURSO_AUTH_TOKEN || '',
});

// Initialize database
export async function initializeDatabase() {
  try {
    // Create devices table if it doesn't exist
    await turso.execute(`
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
    console.log('Turso database initialized successfully');
  } catch (error) {
    console.error('Error initializing Turso database:', error);
    throw error;
  }
}

// Database operations
export const tursoOperations = {
  // Get all devices ordered by score
  getAllDevices: async () => {
    try {
      const result = await turso.execute('SELECT * FROM devices ORDER BY score DESC');
      return result.rows;
    } catch (error) {
      console.error('Error getting devices:', error);
      throw error;
    }
  },

  // Get device by ID
  getDeviceById: async (id: string) => {
    try {
      const result = await turso.execute({
        sql: 'SELECT * FROM devices WHERE id = ?',
        args: [id]
      });
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error getting device by ID:', error);
      throw error;
    }
  },

  // Insert or update device
  upsertDevice: async (device: {
    id: string;
    name: string;
    avatar?: string;
    score: number;
    rank: number;
    study_time: number;
    created_at: string;
    last_active: string;
  }) => {
    try {
      // First try to update, if no rows affected then insert
      const updateResult = await turso.execute({
        sql: `
          UPDATE devices 
          SET name = ?, avatar = ?, score = ?, rank = ?, study_time = ?, created_at = ?, last_active = ?
          WHERE id = ?
        `,
        args: [
          device.name,
          device.avatar || '🖥️',
          device.score,
          device.rank,
          device.study_time,
          device.created_at,
          device.last_active,
          device.id
        ]
      });

      // If no rows were updated, insert new record
      if (updateResult.rowsAffected === 0) {
        await turso.execute({
          sql: `
            INSERT INTO devices (id, name, avatar, score, rank, study_time, created_at, last_active)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `,
          args: [
            device.id,
            device.name,
            device.avatar || '🖥️',
            device.score,
            device.rank,
            device.study_time,
            device.created_at,
            device.last_active
          ]
        });
      }

      return updateResult;
    } catch (error) {
      console.error('Error upserting device:', error);
      throw error;
    }
  },

  // Update device
  updateDevice: async (id: string, updates: {
    name?: string;
    avatar?: string;
    score?: number;
    rank?: number;
    study_time?: number;
    last_active?: string;
  }) => {
    try {
      const updateKeys = Object.keys(updates);
      if (updateKeys.length === 0) {
        return { changes: 0 };
      }

      const fields = updateKeys.map(key => `${key} = ?`).join(', ');
      const values = Object.values(updates);
      
      const result = await turso.execute({
        sql: `UPDATE devices SET ${fields} WHERE id = ?`,
        args: [...values, id]
      });
      
      return result;
    } catch (error) {
      console.error('Error updating device:', error);
      throw error;
    }
  },

  // Delete device
  deleteDevice: async (id: string) => {
    try {
      const result = await turso.execute({
        sql: 'DELETE FROM devices WHERE id = ?',
        args: [id]
      });
      return result;
    } catch (error) {
      console.error('Error deleting device:', error);
      throw error;
    }
  }
};

// Initialize on import
initializeDatabase().catch(console.error);

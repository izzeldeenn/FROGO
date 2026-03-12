// Client-side SQLite operations using API calls instead of direct database access

interface DeviceData {
  id: string;
  name: string;
  avatar?: string;
  score: number;
  rank: number;
  study_time: number;
  created_at: string;
  last_active: string;
}

export const dbClientOperations = {
  // Get all devices from API
  getAllDevices: async (): Promise<DeviceData[]> => {
    try {
      const response = await fetch('/api/devices');
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error fetching devices:', error);
      return [];
    }
  },

  // Get device by ID from API
  getDeviceById: async (id: string): Promise<DeviceData | null> => {
    try {
      const response = await fetch('/api/devices');
      const result = await response.json();
      const devices = result.data || [];
      return devices.find((device: DeviceData) => device.id === id) || null;
    } catch (error) {
      console.error('Error fetching device:', error);
      return null;
    }
  },

  // Save device via API
  upsertDevice: async (device: {
    id: string;
    name: string;
    avatar?: string;
    score: number;
    rank: number;
    study_time: number;
    created_at: string;
    last_active: string;
  }): Promise<void> => {
    try {
      const response = await fetch('/api/devices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(device)
      });

      if (!response.ok) {
        const result = await response.json();
        console.error('Error saving device:', result.error);
      }
    } catch (error) {
      console.error('Error saving device:', error);
    }
  },

  // Update device via API
  updateDevice: async (id: string, updates: {
    name?: string;
    avatar?: string;
    score?: number;
    rank?: number;
    study_time?: number;
    last_active?: string;
  }): Promise<void> => {
    try {
      console.log('Updating device via API:', { id, updates });
      
      const response = await fetch('/api/devices', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          ...updates
        })
      });

      if (!response.ok) {
        const result = await response.json();
        console.error('Error updating device:', result.error);
        throw new Error(result.error || 'Failed to update device');
      } else {
        const result = await response.json();
        console.log('Device updated successfully:', result);
      }
    } catch (error) {
      console.error('Error updating device:', error);
      throw error;
    }
  }
};

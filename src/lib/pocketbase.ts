import PocketBase from 'pocketbase';

// Initialize PocketBase client
const pb = new PocketBase('http://localhost:8090');

// Disable auto cancellation for long-running requests
pb.autoCancellation(false);

// Check if PocketBase is available
export const isPocketBaseAvailable = async (): Promise<boolean> => {
  try {
    const response = await fetch('http://localhost:8090/api/health');
    return response.ok;
  } catch (error) {
    return false;
  }
};

// Export the PocketBase instance
export { pb };

// User account collection interface
export interface UserAccountRecord {
  id: string;
  accountId: string;
  username: string;
  email: string;
  hashKey: string;
  avatar?: string;
  score: number;
  rank: number;
  studyTime: number;
  createdAt: string;
  lastActive: string;
  collectionId: string;
  collectionName: string;
  updated: string;
}

// Database operations for user accounts
export class UserAccountDB {
  private static instance: UserAccountDB;
  private pb: PocketBase;

  constructor() {
    this.pb = pb;
  }

  static getInstance(): UserAccountDB {
    if (!UserAccountDB.instance) {
      UserAccountDB.instance = new UserAccountDB();
    }
    return UserAccountDB.instance;
  }

  // Get all users sorted by score (for leaderboard)
  async getAllUsers(): Promise<UserAccountRecord[]> {
    try {
      // Use public API instead of admin API
      const records = await this.pb.collection('users').getFullList<UserAccountRecord>({
        sort: '-score',
        requestKey: null
      });
      return records;
    } catch (error) {
      console.error('Error fetching all users:', error);
      return [];
    }
  }

  // Get user by accountId
  async getUserByAccountId(accountId: string): Promise<UserAccountRecord | null> {
    try {
      const records = await this.pb.collection('users').getFirstListItem<UserAccountRecord>(
        `accountId = "${accountId}"`,
        { requestKey: null }
      );
      return records;
    } catch (error) {
      console.error('Error fetching user by accountId:', error);
      return null;
    }
  }

  // Create or update user (upsert)
  async upsertUser(userData: Partial<UserAccountRecord>): Promise<UserAccountRecord | null> {
    try {
      const existingUser = await this.getUserByAccountId(userData.accountId!);
      
      if (existingUser) {
        // Update existing user
        const updated = await this.pb.collection('users').update<UserAccountRecord>(
          existingUser.id,
          userData,
          { requestKey: null }
        );
        return updated;
      } else {
        // Create new user
        const created = await this.pb.collection('users').create<UserAccountRecord>({
          ...userData,
          collectionId: 'users',
          collectionName: 'users'
        } as any, { requestKey: null });
        return created;
      }
    } catch (error) {
      console.error('Error upserting user:', error);
      return null;
    }
  }

  // Update user study time and score
  async updateUserStudyTime(accountId: string, studyTime: number, score: number): Promise<UserAccountRecord | null> {
    try {
      const user = await this.getUserByAccountId(accountId);
      if (user) {
        const updated = await this.pb.collection('users').update<UserAccountRecord>(
          user.id,
          {
            studyTime,
            score,
            lastActive: new Date().toISOString()
          },
          { requestKey: null }
        );
        return updated;
      }
      return null;
    } catch (error) {
      console.error('Error updating user study time:', error);
      return null;
    }
  }

  // Update user profile
  async updateUserProfile(accountId: string, username: string, avatar?: string): Promise<UserAccountRecord | null> {
    try {
      const user = await this.getUserByAccountId(accountId);
      if (user) {
        const updated = await this.pb.collection('users').update<UserAccountRecord>(
          user.id,
          {
            username,
            avatar,
            lastActive: new Date().toISOString()
          },
          { requestKey: null }
        );
        return updated;
      }
      return null;
    } catch (error) {
      console.error('Error updating user profile:', error);
      return null;
    }
  }

  // Subscribe to real-time changes
  subscribeToUsers(callback: (records: UserAccountRecord[]) => void) {
    try {
      console.log('🔄 Setting up real-time subscription...');
      
      // Subscribe to the users collection for real-time updates
      this.pb.collection('users').subscribe('*', (e: any) => {
        console.log('🔄 Real-time update received:', e);
        // Refetch all users when any change occurs
        this.getAllUsers().then(callback);
      });

      // Initial load
      this.getAllUsers().then(callback);
      console.log('✅ Real-time subscription established');
    } catch (error) {
      console.error('❌ Error subscribing to users:', error);
    }
  }

  // Unsubscribe from real-time changes
  unsubscribeFromUsers() {
    try {
      this.pb.collection('users').unsubscribe();
    } catch (error) {
      console.error('Error unsubscribing from users:', error);
    }
  }

  // Initialize PocketBase admin auth (for setup)
  async initializeAdmin(): Promise<boolean> {
    try {
      await this.pb.collection('users').getFirstListItem('', { requestKey: null });
      return true; // If successful, PocketBase is running
    } catch (error) {
      console.error('PocketBase not initialized or not running:', error);
      return false;
    }
  }
}

// Export singleton instance
export const userDB = UserAccountDB.getInstance();

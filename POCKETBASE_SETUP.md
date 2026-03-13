# PocketBase Integration Setup

This application now uses PocketBase as the database backend with real-time updates.

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup PocketBase
```bash
# Download and setup PocketBase
npm run pocketbase:setup

# Initialize database schema
npm run pocketbase:init

# Start PocketBase server
npm run pocketbase:start
```

### 3. Start the Application
```bash
# In a new terminal, start the Next.js app
npm run dev
```

## 📋 Setup Details

### PocketBase Features Used:
- **Real-time Updates**: Automatic live updates across all connected clients
- **User Management**: Account-based system with device fingerprinting
- **Leaderboard**: Real-time ranking system
- **Data Persistence**: All user data stored in local SQLite database

### Database Schema:
```javascript
// Users Collection
{
  accountId: string     // Unique account identifier
  username: string      // Friendly username (e.g., "SmartLearner1234")
  email: string         // Auto-generated email
  hashKey: string       // 32-character security hash
  avatar?: string       // User avatar emoji
  score: number         // User points/score
  rank: number          // Leaderboard rank
  studyTime: number     // Study time in seconds
  createdAt: datetime   // Account creation date
  lastActive: datetime  // Last activity timestamp
}
```

### Real-time Features:
- **Live Leaderboard**: Rankings update instantly across all devices
- **Study Time Sync**: Real-time study progress tracking
- **Profile Updates**: Username and avatar changes sync immediately
- **Score Updates**: Points and ranks update in real-time

## 🔧 Configuration

### PocketBase Server:
- **URL**: `http://localhost:8090`
- **Admin Panel**: `http://localhost:8090/_/`
- **Admin Credentials**: `admin@example.com` / `admin123`

### Environment Variables:
```bash
# Optional: Custom PocketBase URL
POCKETBASE_URL=http://localhost:8090
```

## 🎯 Account System

The application uses a device-based account system:

1. **Automatic Account Creation**: Each device gets a unique account
2. **Device Fingerprinting**: Uses browser characteristics for identification
3. **Friendly Usernames**: Auto-generated usernames like "SmartLearner1234"
4. **Hash Keys**: 32-character security keys for each account
5. **Persistent Sessions**: Same device = same account across sessions

## 🔄 Real-time Updates

The application subscribes to PocketBase real-time events:

```javascript
// Automatic subscription to user changes
userDB.subscribeToUsers((updatedUsers) => {
  // Update UI with latest data
  setUsers(updatedUsers);
});
```

### Real-time Events:
- User creation
- Profile updates (username, avatar)
- Study time updates
- Score and rank changes

## 📁 File Structure

```
src/
├── lib/
│   └── pocketbase.ts          # PocketBase client and database operations
├── contexts/
│   └── UserContext.tsx        # Updated with PocketBase integration
└── utils/
    └── deviceId.ts            # Account system with device fingerprinting

scripts/
├── setup-pocketbase.js        # Download and setup PocketBase
└── init-pocketbase.js         # Initialize database schema
```

## 🚨 Troubleshooting

### PocketBase Not Starting:
```bash
# Make sure pocketbase executable has correct permissions
chmod +x ./pocketbase

# Check if port 8090 is available
lsof -i :8090
```

### Database Issues:
```bash
# Reset PocketBase data
rm -rf pocketbase_data
npm run pocketbase:init
```

### Connection Issues:
- Ensure PocketBase is running on `http://localhost:8090`
- Check browser console for connection errors
- Verify network connectivity

## 🎉 Benefits

- **No External Dependencies**: Self-hosted database
- **Real-time Updates**: Live synchronization across devices
- **Simple Setup**: Minimal configuration required
- **Scalable**: Can handle multiple concurrent users
- **Secure**: Built-in authentication and permissions
- **Fast**: SQLite backend for optimal performance

## 📚 Additional Resources

- [PocketBase Documentation](https://pocketbase.io/docs/)
- [Real-time Updates](https://pocketbase.io/docs/js-realtime/)
- [JavaScript SDK](https://pocketbase.io/docs/js-overview/)

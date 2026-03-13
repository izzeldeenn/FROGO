# Manual PocketBase Collection Setup

Since the automatic collection creation is having formatting issues, please follow these steps:

## 🚀 Quick Setup (2 minutes)

### 1. Open Admin Panel
Visit: http://localhost:8090/_/

### 2. Login
- Email: `admin@example.com`
- Password: `Admin123456!`

### 3. Delete Existing Collection
- Find the "users" collection (if it exists)
- Click the trash icon to delete it
- Confirm deletion

### 4. Create New Collection
- Click "New Collection" button
- **Collection Name**: `users`
- **Collection Type**: `Base` (NOT "Auth")

### 5. Add Fields (in this exact order)

1. **accountId**
   - Type: `text`
   - Required: ✅
   - Unique: ✅

2. **username**
   - Type: `text`
   - Required: ✅
   - Unique: ❌

3. **email**
   - Type: `email`
   - Required: ✅
   - Unique: ✅

4. **hashKey**
   - Type: `text`
   - Required: ✅
   - Unique: ❌

5. **avatar**
   - Type: `text`
   - Required: ❌
   - Unique: ❌

6. **score**
   - Type: `number`
   - Required: ✅
   - Min: `0`

7. **rank**
   - Type: `number`
   - Required: ✅
   - Min: `1`

8. **studyTime**
   - Type: `number`
   - Required: ✅
   - Min: `0`

9. **createdAt**
   - Type: `datetime`
   - Required: ✅

10. **lastActive**
    - Type: `datetime`
    - Required: ✅

### 6. Save Collection
- Click "Create" button
- Wait for confirmation

### 7. Restart Your App
```bash
# Stop current dev server (Ctrl+C)
npm run dev
```

## ✅ Verification

After setup, you should see:
- 🗄️ Console: "Using PocketBase database"
- 🔄 Console: "Real-time updates enabled"
- 🎉 Full database functionality

## 🔧 Troubleshooting

If you still see errors:
1. Check PocketBase is running: `curl http://localhost:8090/api/health`
2. Verify collection name is exactly "users"
3. Make sure collection type is "Base"
4. Restart both PocketBase and Next.js

## 🎯 Benefits After Setup

✅ Real-time updates across devices
✅ Persistent data storage
✅ Live leaderboard synchronization
✅ Multi-device account sync
✅ Automatic backup capabilities

# Quick Fix for 404 Error

The 404 error is because the "users" collection doesn't exist in PocketBase. Here's the fastest solution:

## 🚀 2-Minute Manual Fix

### Step 1: Open Admin Panel
Visit: **http://localhost:8090/_/**

### Step 2: Login
- Email: `admin@example.com`
- Password: `Admin123456!`

### Step 3: Create Collection
1. Click **"New Collection"** button
2. **Name**: `users`
3. **Type**: `Base` (IMPORTANT: NOT "Auth")

### Step 4: Add Fields (Click "Add field" for each):

1. **accountId** → Text → Required ✅ → Unique ✅
2. **username** → Text → Required ✅
3. **email** → Email → Required ✅ → Unique ✅
4. **hashKey** → Text → Required ✅
5. **avatar** → Text → Required ❌
6. **score** → Number → Required ✅ → Min: 0
7. **rank** → Number → Required ✅ → Min: 1
8. **studyTime** → Number → Required ✅ → Min: 0
9. **createdAt** → DateTime → Required ✅
10. **lastActive** → DateTime → Required ✅

### Step 5: Save
Click **"Create"** button

### Step 6: Restart App
```bash
# Stop current dev server (Ctrl+C)
npm run dev
```

## ✅ Result

After this, you'll see:
- 🗄️ "Using PocketBase database" in console
- 🔄 "Real-time updates enabled" in console
- 🎉 No more 404 errors
- 💾 Full database functionality

## 🎯 Why This Works

The automatic collection creation has formatting issues, but the manual approach through the admin interface is reliable and gives you full control over the field settings.

This is actually the recommended approach by PocketBase - use the admin UI for collection setup!

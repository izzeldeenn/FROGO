# Supabase Setup Guide

## 🚀 Quick Setup (5 minutes)

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub
4. Create new project
5. Choose organization and project name
6. Set database password (save it!)
7. Choose region (closest to your users)
8. Click "Create new project"

### 2. Get Your Credentials
1. Go to Project Settings → API
2. Copy the Project URL
3. Copy the anon public key

### 3. Set Up Environment Variables
Create `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Create Database Table
Go to SQL Editor and run this:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id TEXT UNIQUE NOT NULL,
  username TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  hash_key TEXT NOT NULL,
  avatar TEXT,
  score INTEGER DEFAULT 0 NOT NULL,
  rank INTEGER DEFAULT 1 NOT NULL,
  study_time INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_account_id ON users(account_id);
CREATE INDEX IF NOT EXISTS idx_users_score_desc ON users(score DESC);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow public access
CREATE POLICY "Allow all operations on users" ON users
  FOR ALL USING (true) WITH CHECK (true);
```

### 5. Test the Connection
```bash
npm run dev
```

Check console for:
- ✅ "Using Supabase database"
- ✅ "Real-time subscription established"

## 🎯 Benefits of Supabase

✅ **Works on Vercel** - No server required
✅ **Real-time updates** - Live synchronization
✅ **Free tier** - Generous free plan
✅ **PostgreSQL** - Powerful database
✅ **Easy setup** - No configuration needed
✅ **Auto-scaling** - Handles traffic automatically

## 🚀 Deploy to Vercel

1. Push your code to GitHub
2. Connect your Vercel account
3. Import your project
4. Add environment variables in Vercel dashboard
5. Deploy!

Your app will work perfectly on Vercel with Supabase!

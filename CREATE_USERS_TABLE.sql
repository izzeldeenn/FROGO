-- Create users table for the application
-- Copy this code and run it in Supabase SQL Editor

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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_account_id ON users(account_id);
CREATE INDEX IF NOT EXISTS idx_users_score_desc ON users(score DESC);
CREATE INDEX IF NOT EXISTS idx_users_rank ON users(rank);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations on users table
CREATE POLICY "Allow all operations on users" ON users
  FOR ALL USING (true) WITH CHECK (true);

-- Create function to automatically update ranks based on score
CREATE OR REPLACE FUNCTION update_user_ranks()
RETURNS TRIGGER AS $$
BEGIN
  -- Update ranks for all users based on score (highest score gets rank 1)
  UPDATE users 
  SET rank = subquery.new_rank 
  FROM (
    SELECT 
      id,
      ROW_NUMBER() OVER (ORDER BY score DESC, created_at ASC) as new_rank
    FROM users
  ) AS subquery
  WHERE users.id = subquery.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update ranks when scores change
DROP TRIGGER IF EXISTS update_ranks_trigger ON users;
CREATE TRIGGER update_ranks_trigger
  AFTER INSERT OR UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_user_ranks();

-- Test the table by inserting a sample record (optional)
-- INSERT INTO users (account_id, username, email, hash_key, avatar, score, rank, study_time)
-- VALUES ('test_account_123', 'TestUser', 'test@example.com', 'test_hash_key_123', '👤', 100, 1, 3600);

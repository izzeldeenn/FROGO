-- Add referral_code column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS referral_code VARCHAR(8);

-- Create referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id VARCHAR(255) NOT NULL REFERENCES users(account_id),
  referred_user_id VARCHAR(255) NOT NULL REFERENCES users(account_id),
  referral_code VARCHAR(8) NOT NULL,
  points_rewarded INTEGER DEFAULT 40,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(referred_user_id),
  UNIQUE(referral_code)
);

-- Enable RLS on referrals table
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for referrals
-- Allow anyone to insert referrals (for the referral system to work)
CREATE POLICY "Allow anyone to insert referrals" ON referrals
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow anyone to read referrals (for referral stats)
CREATE POLICY "Allow anyone to read referrals" ON referrals
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_user_id ON referrals(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referral_code ON referrals(referral_code);

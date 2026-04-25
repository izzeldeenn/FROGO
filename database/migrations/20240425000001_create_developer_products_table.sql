-- Create developer_products table
CREATE TABLE IF NOT EXISTS developer_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id TEXT NOT NULL REFERENCES users(account_id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  description TEXT NOT NULL,
  description_ar TEXT NOT NULL,
  price INTEGER NOT NULL CHECK (price >= 0),
  category TEXT NOT NULL CHECK (category IN ('themes', 'avatars', 'backgrounds', 'badges', 'effects', 'services', 'developer')),
  icon TEXT NOT NULL,
  rarity TEXT NOT NULL CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  approval_status TEXT NOT NULL DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  downloads INTEGER DEFAULT 0 CHECK (downloads >= 0),
  rating DECIMAL(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  version TEXT NOT NULL DEFAULT '1.0.0',
  github_url TEXT,
  documentation_url TEXT,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES admins(id),
  rejection_reason TEXT
);

-- Create index on developer_id for faster queries
CREATE INDEX IF NOT EXISTS idx_developer_products_developer_id ON developer_products(developer_id);

-- Create index on approval_status for filtering
CREATE INDEX IF NOT EXISTS idx_developer_products_approval_status ON developer_products(approval_status);

-- Create index on category for filtering
CREATE INDEX IF NOT EXISTS idx_developer_products_category ON developer_products(category);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_developer_products_created_at ON developer_products(created_at DESC);

-- Enable RLS
ALTER TABLE developer_products ENABLE ROW LEVEL SECURITY;

-- Policy: Developers can view their own products
CREATE POLICY "developers_can_view_own_products"
  ON developer_products FOR SELECT
  USING (developer_id = auth.uid()::text);

-- Policy: Anyone can view approved products
CREATE POLICY "anyone_can_view_approved_products"
  ON developer_products FOR SELECT
  USING (approval_status = 'approved');

-- Policy: Developers can insert their own products
CREATE POLICY "developers_can_insert_own_products"
  ON developer_products FOR INSERT
  WITH CHECK (developer_id = auth.uid()::text);

-- Policy: Developers can update their own pending products
CREATE POLICY "developers_can_update_own_pending_products"
  ON developer_products FOR UPDATE
  USING (developer_id = auth.uid()::text AND approval_status = 'pending');

-- Policy: Admins can approve/reject products
CREATE POLICY "admins_can_approve_products"
  ON developer_products FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admins WHERE id = auth.uid()
    )
  );

-- Policy: Admins can view all products
CREATE POLICY "admins_can_view_all_products"
  ON developer_products FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admins WHERE id = auth.uid()
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_developer_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER trigger_update_developer_products_updated_at
  BEFORE UPDATE ON developer_products
  FOR EACH ROW
  EXECUTE FUNCTION update_developer_products_updated_at();

-- Create reset_tokens table for password reset functionality
CREATE TABLE IF NOT EXISTS reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  used_at TIMESTAMP WITH TIME ZONE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE
);

-- Create index for faster token lookup
CREATE INDEX IF NOT EXISTS idx_reset_tokens_token ON reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_reset_tokens_email ON reset_tokens(email);
CREATE INDEX IF NOT EXISTS idx_reset_tokens_expires_at ON reset_tokens(expires_at);

-- Add constraint to ensure token is not expired
ALTER TABLE reset_tokens ADD CONSTRAINT check_expires_at_future CHECK (expires_at > created_at);

-- Function to clean up expired tokens
CREATE OR REPLACE FUNCTION cleanup_expired_tokens()
RETURNS void AS $$
BEGIN
  DELETE FROM reset_tokens 
  WHERE expires_at < NOW() 
  OR (used_at IS NOT NULL AND used_at < NOW() - INTERVAL '1 hour');
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically clean up expired tokens (optional)
-- This trigger will run cleanup every hour
-- CREATE OR REPLACE FUNCTION trigger_cleanup_expired_tokens()
-- RETURNS trigger AS $$
-- BEGIN
--   PERFORM cleanup_expired_tokens();
--   RETURN NULL;
-- END;
-- $$ LANGUAGE plpgsql;

-- CREATE TRIGGER auto_cleanup_expired_tokens
-- AFTER INSERT ON reset_tokens
-- EXECUTE FUNCTION trigger_cleanup_expired_tokens();

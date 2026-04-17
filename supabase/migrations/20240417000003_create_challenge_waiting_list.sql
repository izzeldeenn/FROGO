-- Create challenge_waiting_list table for real-time user matching
CREATE TABLE IF NOT EXISTS public.challenge_waiting_list (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '5 minutes') NOT NULL,
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'matched', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  
  -- Ensure user can only have one active waiting entry
  CONSTRAINT unique_user_waiting UNIQUE (user_id, status)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_waiting_list_user_id ON public.challenge_waiting_list(user_id);
CREATE INDEX IF NOT EXISTS idx_waiting_list_status ON public.challenge_waiting_list(status);
CREATE INDEX IF NOT EXISTS idx_waiting_list_joined_at ON public.challenge_waiting_list(joined_at DESC);
CREATE INDEX IF NOT EXISTS idx_waiting_list_expires_at ON public.challenge_waiting_list(expires_at);

-- Enable Row Level Security (RLS)
ALTER TABLE public.challenge_waiting_list ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view waiting list
CREATE POLICY "Users can view waiting list" ON public.challenge_waiting_list
  FOR SELECT USING (
    true
  );

-- Create policy for users to insert into waiting list
CREATE POLICY "Users can join waiting list" ON public.challenge_waiting_list
  FOR INSERT WITH CHECK (
    true
  );

-- Create policy for users to update their own waiting entry
CREATE POLICY "Users can update their own waiting entry" ON public.challenge_waiting_list
  FOR UPDATE USING (
    true
  );

-- Create policy for users to delete their own waiting entry
CREATE POLICY "Users can delete their own waiting entry" ON public.challenge_waiting_list
  FOR DELETE USING (
    true
  );

-- Function to clean up expired waiting entries
CREATE OR REPLACE FUNCTION cleanup_expired_waiting_entries()
RETURNS void AS $$
BEGIN
  UPDATE public.challenge_waiting_list
  SET status = 'expired'
  WHERE status = 'waiting'
  AND expires_at < NOW();
END;
$$ language 'plpgsql';

-- Create trigger to automatically cleanup expired entries
-- This would be called by a scheduled job or periodically
-- For now, we'll clean up when checking for matches

-- Function to find a match in waiting list
CREATE OR REPLACE FUNCTION find_waiting_match(current_user_id UUID)
RETURNS TABLE (
  match_id UUID,
  match_user_id UUID
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    wl.id,
    wl.user_id
  FROM public.challenge_waiting_list wl
  WHERE wl.status = 'waiting'
  AND wl.user_id != current_user_id
  AND wl.expires_at > NOW()
  ORDER BY wl.joined_at ASC
  LIMIT 1;
END;
$$ language 'plpgsql';

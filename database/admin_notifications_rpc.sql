-- Drop existing check constraint on notifications type
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_type_check;

-- Add new check constraint for admin notification types
ALTER TABLE notifications 
ADD CONSTRAINT notifications_type_check 
CHECK (type IN ('like', 'comment', 'follow', 'mention', 'group_invite', 'post_approved', 'admin_announcement', 'system_update', 'maintenance', 'welcome'));

-- Create RPC function to send admin notifications (bypasses RLS)
CREATE OR REPLACE FUNCTION send_admin_notifications(
  p_message TEXT,
  p_type TEXT,
  p_target_user_ids TEXT[]
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result JSON;
  v_sent_count INTEGER := 0;
BEGIN
  -- Insert notifications for all target users with username from users table
  INSERT INTO notifications (user_id, username, type, message, read, created_at)
  SELECT 
    u.id as user_id,
    u.username as username,
    p_type as type,
    p_message as message,
    false as read,
    now() as created_at
  FROM users u
  WHERE u.id::text = ANY(p_target_user_ids);
  
  -- Get count of inserted rows
  GET DIAGNOSTICS v_sent_count = ROW_COUNT;
  
  -- Return success result
  v_result := json_build_object(
    'success', true,
    'sentCount', v_sent_count
  );
  
  RETURN v_result;
EXCEPTION
  WHEN OTHERS THEN
    -- Return error result
    v_result := json_build_object(
      'success', false,
      'error', SQLERRM
    );
    RETURN v_result;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION send_admin_notifications TO authenticated;
GRANT EXECUTE ON FUNCTION send_admin_notifications TO anon;

-- Create RPC function to get notification stats (bypasses RLS)
CREATE OR REPLACE FUNCTION get_notification_stats()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_total INTEGER;
  v_read INTEGER;
  v_unread INTEGER;
  v_result JSON;
BEGIN
  -- Get total count
  SELECT COUNT(*) INTO v_total FROM notifications;
  
  -- Get read count
  SELECT COUNT(*) INTO v_read FROM notifications WHERE read = true;
  
  -- Get unread count
  SELECT COUNT(*) INTO v_unread FROM notifications WHERE read = false;
  
  -- Return stats
  v_result := json_build_object(
    'total', v_total,
    'sent', v_total,
    'read', v_read,
    'unread', v_unread
  );
  
  RETURN v_result;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_notification_stats TO authenticated;
GRANT EXECUTE ON FUNCTION get_notification_stats TO anon;

-- Create RPC function to get notification templates (bypasses RLS)
CREATE OR REPLACE FUNCTION get_notification_templates()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result JSON;
BEGIN
  SELECT json_agg(row_to_json(t)) INTO v_result
  FROM notification_templates t
  ORDER BY t.created_at DESC;
  
  RETURN COALESCE(v_result, '[]'::json);
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_notification_templates TO authenticated;
GRANT EXECUTE ON FUNCTION get_notification_templates TO anon;

-- Create RPC function to create notification template (bypasses RLS)
CREATE OR REPLACE FUNCTION create_notification_template(
  p_name TEXT,
  p_message TEXT,
  p_type TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result JSON;
  v_template notification_templates;
BEGIN
  -- Insert new template
  INSERT INTO notification_templates (name, message, type, created_at, updated_at)
  VALUES (p_name, p_message, p_type, now(), now())
  RETURNING * INTO v_template;
  
  -- Return created template
  v_result := json_build_object(
    'success', true,
    'template', row_to_json(v_template)
  );
  
  RETURN v_result;
EXCEPTION
  WHEN OTHERS THEN
    v_result := json_build_object(
      'success', false,
      'error', SQLERRM
    );
    RETURN v_result;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION create_notification_template TO authenticated;
GRANT EXECUTE ON FUNCTION create_notification_template TO anon;

-- Create RPC function to get user notifications by account_id (bypasses RLS)
CREATE OR REPLACE FUNCTION get_user_notifications(p_account_id TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result JSON;
BEGIN
  -- Get notifications for user by account_id using subquery to avoid GROUP BY issue
  SELECT json_agg(row_to_json(n)) INTO v_result
  FROM (
    SELECT n.*
    FROM notifications n
    JOIN users u ON n.user_id = u.id
    WHERE u.account_id = p_account_id
    ORDER BY n.created_at DESC
  ) n;
  
  RETURN COALESCE(v_result, '[]'::json);
EXCEPTION
  WHEN OTHERS THEN
    v_result := json_build_object(
      'error', SQLERRM
    );
    RETURN v_result;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_user_notifications TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_notifications TO anon;

-- Create RPC function to mark notification as read (bypasses RLS)
CREATE OR REPLACE FUNCTION mark_notification_read(p_notification_id TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result JSON;
BEGIN
  -- Mark notification as read
  UPDATE notifications
  SET read = true
  WHERE id = p_notification_id::uuid;
  
  v_result := json_build_object('success', true);
  RETURN v_result;
EXCEPTION
  WHEN OTHERS THEN
    v_result := json_build_object(
      'success', false,
      'error', SQLERRM
    );
    RETURN v_result;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION mark_notification_read TO authenticated;
GRANT EXECUTE ON FUNCTION mark_notification_read TO anon;

-- Create RPC function to mark all notifications as read for user (bypasses RLS)
CREATE OR REPLACE FUNCTION mark_all_notifications_read(p_account_id TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result JSON;
BEGIN
  -- Mark all notifications as read for user
  UPDATE notifications n
  SET read = true
  FROM users u
  WHERE n.user_id = u.id
  AND u.account_id = p_account_id;
  
  v_result := json_build_object('success', true);
  RETURN v_result;
EXCEPTION
  WHEN OTHERS THEN
    v_result := json_build_object(
      'success', false,
      'error', SQLERRM
    );
    RETURN v_result;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION mark_all_notifications_read TO authenticated;
GRANT EXECUTE ON FUNCTION mark_all_notifications_read TO anon;

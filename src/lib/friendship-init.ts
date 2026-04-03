import { supabase } from './supabase';

// Check if tables exist and create them if they don't
export async function initializeFriendshipTables(): Promise<boolean> {
  try {
    // Check if friendships table exists
    const { data: friendshipsCheck, error: friendshipsError } = await supabase
      .from('friendships')
      .select('id')
      .limit(1);
    
    if (friendshipsError && friendshipsError.code === 'PGRST116') {
      return false;
    }
    
    // Check if friendship_requests table exists
    const { data: requestsCheck, error: requestsError } = await supabase
      .from('friendship_requests')
      .select('id')
      .limit(1);
    
    if (requestsError && requestsError.code === 'PGRST116') {
      return false;
    }
    
    // Check if messages table exists
    const { data: messagesCheck, error: messagesError } = await supabase
      .from('messages')
      .select('id')
      .limit(1);
    
    if (messagesError && messagesError.code === 'PGRST116') {
      return false;
    }
    
    return true;
  } catch (error) {
    return false;
  }
}

// Create a simple test function to verify table access
export async function testFriendshipTables(): Promise<{ success: boolean; message: string }> {
  try {
    // Test friendships table
    const { data: friendshipsData, error: friendshipsError } = await supabase
      .from('friendships')
      .select('count')
      .limit(1);
    
    if (friendshipsError) {
      return { success: false, message: `Friendships table error: ${friendshipsError.message}` };
    }
    
    // Test friendship_requests table
    const { data: requestsData, error: requestsError } = await supabase
      .from('friendship_requests')
      .select('count')
      .limit(1);
    
    if (requestsError) {
      return { success: false, message: `Friendship requests table error: ${requestsError.message}` };
    }
    
    // Test messages table
    const { data: messagesData, error: messagesError } = await supabase
      .from('messages')
      .select('count')
      .limit(1);
    
    if (messagesError) {
      return { success: false, message: `Messages table error: ${messagesError.message}` };
    }
    
    return { success: true, message: 'All friendship tables are accessible' };
  } catch (error: any) {
    return { success: false, message: `Test failed: ${error.message}` };
  }
}

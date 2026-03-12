import { NextRequest, NextResponse } from 'next/server';
import { wsManager } from '@/lib/websocket-server';

// Initialize WebSocket server when this route is accessed
export async function GET(request: NextRequest) {
  // The WebSocket server is already initialized in the websocket-server module
  // This route just ensures the module is loaded
  
  return NextResponse.json({ 
    message: 'WebSocket server initialized on port 8080',
    status: wsManager ? 'running' : 'stopped'
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Trigger leaderboard broadcast
    if (body.type === 'broadcast_update') {
      await wsManager.broadcastUpdate();
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ error: 'Invalid request type' }, { status: 400 });
  } catch (error) {
    console.error('WebSocket API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

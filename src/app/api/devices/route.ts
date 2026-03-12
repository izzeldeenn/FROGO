import { NextRequest, NextResponse } from 'next/server';
import { dbOperations } from '@/lib/sqlite';

export const runtime = 'nodejs'; // Back to SQLite for testing

export async function GET() {
  try {
    const devices = dbOperations.getAllDevices();
    return NextResponse.json({ data: devices });
  } catch (error) {
    console.error('Error fetching devices:', error);
    return NextResponse.json({ error: 'Failed to fetch devices' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const device = await request.json();
    
    const result = dbOperations.upsertDevice({
      id: device.id,
      name: device.name,
      avatar: device.avatar,
      score: device.score,
      rank: device.rank,
      study_time: device.study_time,
      created_at: device.created_at,
      last_active: device.last_active
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error creating device:', error);
    return NextResponse.json({ error: 'Failed to create device' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('PUT request received');
    
    const { id, lastActive, ...updates } = await request.json();
    
    console.log('PUT request - ID:', id, 'Updates:', updates, 'lastActive:', lastActive);
    
    // Convert lastActive to last_active for database
    if (lastActive) {
      updates.last_active = lastActive;
    }
    
    // Add last_active timestamp if not provided
    if (!updates.last_active) {
      updates.last_active = new Date().toISOString();
    }

    console.log('Final updates:', updates);

    const result = dbOperations.updateDevice(id, updates);
    console.log('Update result:', result);
    
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error updating device:', error);
    console.error('Error stack:', (error as Error).stack);
    return NextResponse.json({ error: 'Failed to update device', details: (error as Error).message }, { status: 500 });
  }
}

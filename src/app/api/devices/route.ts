import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

// In-memory storage for devices (for demonstration)
let devices: any[] = [];

export async function GET() {
  try {
    return NextResponse.json({ data: devices });
  } catch (error) {
    console.error('Error fetching devices:', error);
    return NextResponse.json({ error: 'Failed to fetch devices' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const device = await request.json();
    
    // Add device to in-memory storage
    devices.push(device);

    return NextResponse.json({ success: true, data: device });
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
    
    // Update device in in-memory storage
    const deviceIndex = devices.findIndex((d: any) => d.id === id);
    if (deviceIndex !== -1) {
      devices[deviceIndex] = { ...devices[deviceIndex], ...updates };
    }
    
    return NextResponse.json({ success: true, data: devices[deviceIndex] });
  } catch (error) {
    console.error('Error updating device:', error);
    console.error('Error stack:', (error as Error).stack);
    return NextResponse.json({ error: 'Failed to update device', details: (error as Error).message }, { status: 500 });
  }
}

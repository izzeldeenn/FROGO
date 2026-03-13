import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Redirect to PocketBase or return empty response
export async function GET() {
  try {
    // This route is no longer needed - we use PocketBase directly
    return NextResponse.json({ 
      message: "This API route is deprecated. Please use PocketBase directly.",
      pocketbase: "http://localhost:8090/api/collections/users/records"
    }, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST() {
  return NextResponse.json({ 
    message: "This API route is deprecated. Please use PocketBase directly.",
    pocketbase: "http://localhost:8090/api/collections/users/records"
  }, { status: 200 });
}

export async function PUT() {
  return NextResponse.json({ 
    message: "This API route is deprecated. Please use PocketBase directly.",
    pocketbase: "http://localhost:8090/api/collections/users/records"
  }, { status: 200 });
}

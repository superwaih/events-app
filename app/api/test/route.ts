import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(
    { message: 'API is working', timestamp: new Date().toISOString() },
    { status: 200 }
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Test POST received:', body);
    
    return NextResponse.json(
      { message: 'POST received successfully', received: body },
      { status: 200 }
    );
  } catch (error) {
    console.error('Test POST error:', error);
    return NextResponse.json(
      { error: 'Test POST failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

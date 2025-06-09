import { NextRequest, NextResponse } from 'next/server';
import { getMainCollection } from '@/lib/database';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('session');
    
    if (sessionCookie?.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const collection = await getMainCollection();
    
    // Count entries where notify is '0' or 0
    const notifyZeroCount = await collection.countDocuments({
      $or: [
        { notify: '0' },
        { notify: 0 }
      ]
    });

    return NextResponse.json({ 
      success: true, 
      notifyZeroCount: notifyZeroCount,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error checking notifications:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
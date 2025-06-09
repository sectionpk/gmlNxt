import { NextRequest, NextResponse } from 'next/server';
import { getMainCollection } from '@/lib/database';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('session');
    
    if (sessionCookie?.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action } = await request.json();
    const collection = await getMainCollection();

    switch (action) {
      case 'create':
        // Create indexes for the collection
        await collection.createIndex({ username: 1 });
        await collection.createIndex({ date: 1 });
        return NextResponse.json({ success: true, message: 'Collection Ready' });

      case 'delete':
        // Clear all documents in the collection
        const deleteResult = await collection.deleteMany({});
        return NextResponse.json({ 
          success: true, 
          message: `Collection Cleared - ${deleteResult.deletedCount} documents deleted` 
        });

      case 'getdata':
        // Get all documents sorted by date (newest first)
        const results = await collection.find({}).sort({ date: -1 }).toArray();
        if (results.length === 0) {
          return NextResponse.json({ 
            success: false, 
            message: 'No Entry In The Table' 
          });
        }
        return NextResponse.json({ success: true, data: results });

      case 'genurl':
        return NextResponse.json({ success: true, message: 'URL Generator Ready' });

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error performing action:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
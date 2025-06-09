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

    const { username, page, mobile, update, done } = await request.json();
    
    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const collection = await getMainCollection();

    // Find the user first
    const user = await collection.findOne({ username: username });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prepare update data
    const updateData: any = {};
    
    if (page !== undefined) {
      updateData.pagetype = page;
    }
    
    if (mobile !== undefined) {
      updateData.mobiletype = mobile;
    }

    // Set notify status based on action
    if (update) {
      updateData.notify = '1'; // Set to 1 for update action
    } else if (done) {
      updateData.notify = '1'; // Set to 2 for done action
    }

    // Update the document
    const result = await collection.updateOne(
      { username: username },
      { $set: updateData }
    );

    if (result.modifiedCount > 0) {
      const action = update ? 'updated' : done ? 'marked as done' : 'processed';
      return NextResponse.json({ 
        success: true, 
        message: `User ${username} ${action} successfully` 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'No changes were made' 
      });
    }

  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
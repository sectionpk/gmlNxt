import { NextRequest, NextResponse } from 'next/server';
import { getMainCollection } from '@/lib/database';
import { decodeBase64 } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    // Get the first query parameter value (regardless of key name)
    const userid = Array.from(searchParams.values())[0];
    
    if (!userid) {
      return NextResponse.json({ error: 'Missing userid parameter' }, { status: 400 });
    }

    const username = decodeBase64(userid);
    
    console.log(username);
    const collection = await getMainCollection();
    const result = await collection.findOne({ username: username });
    
    return NextResponse.json({ results: result ? [result] : [] });
  } catch (error) {
    console.error('Error executing MongoDB query:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
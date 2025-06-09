import { NextRequest, NextResponse } from 'next/server';
import { getMainCollection } from '@/lib/database';
import { getClientIP, getUserAgent, decodeBase64 } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { data } = await request.json();
    
    if (!data) {
      return NextResponse.json({ error: 'Missing data parameter' }, { status: 400 });
    }

    const userid = decodeBase64(data);
    const word = 'clicked';
    const ip = getClientIP(request);
    const useragent = getUserAgent(request);
    const date = new Date();
    const pagetype = 0;
    const mobiletype = 0;
    const notify = 2;

    const collection = await getMainCollection();
    const existingUser = await collection.findOne({ username: userid });

    if (existingUser) {
      // Update existing user
      await collection.updateOne(
        { username: userid },
        { 
          $set: { 
            password: word, 
            pagetype: pagetype, 
            mobiletype: mobiletype, 
            notify: notify 
          } 
        }
      );
      console.log('Record updated successfully');
    } else {
      // Insert new user
      await collection.insertOne({
        username: userid,
        password: word,
        ip: ip,
        useragent: useragent,
        date: date,
        notify: notify,
        pagetype: pagetype,
        mobiletype: mobiletype
      });
      console.log('Record inserted successfully');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error recording click:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
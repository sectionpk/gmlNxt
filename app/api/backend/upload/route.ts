import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { generateRandomParam } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('session');
    
    if (sessionCookie?.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('textFile') as File;
    const url = formData.get('url') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    if (!url) {
      return NextResponse.json({ error: 'Base URL is required.' }, { status: 400 });
    }

    // Generate a random key
    const key = generateRandomParam();

    // Accept only text files
    if (file.type !== 'text/plain') {
      return NextResponse.json({ error: 'Only text files are allowed.' }, { status: 400 });
    }

    // Read the content of the uploaded file
    const fileContent = await file.text();
    const lines = fileContent.split('\n').filter(line => line.trim() !== '');
    
    if (lines.length === 0) {
      return NextResponse.json({ error: 'File is empty or contains no valid data.' }, { status: 400 });
    }

    // Generate base64 encoded usernames and URLs as requested
    const b64users = lines.map(str => Buffer.from(str.trim()).toString('base64'));
    const links = b64users.map(str => `${url}${key}=${str}`);

    return NextResponse.json({ 
      success: true, 
      usernames: lines.map(line => line.trim()),
      links: links 
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
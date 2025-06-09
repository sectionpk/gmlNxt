import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('session');
    
    const loggedIn = sessionCookie?.value === 'authenticated';
    
    return NextResponse.json({ loggedIn });
  } catch (error) {
    console.error('Error checking auth status:', error);
    return NextResponse.json({ loggedIn: false });
  }
}
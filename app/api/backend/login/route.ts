import { NextRequest, NextResponse } from 'next/server';
import { getUserCollection } from '@/lib/database';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    
    if (!username || !password) {
      return NextResponse.json({ 
        success: false, 
        error: 'Please enter both username and password.' 
      }, { status: 400 });
    }

    const collection = await getUserCollection();
    const user = await collection.findOne({ username: username, password: password });
    
    if (user) {
      const response = NextResponse.json({ success: true });
      
      // Set session cookie
      response.cookies.set('session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 // 24 hours
      });
      
      return response;
    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'Incorrect username or password. Please try again.' 
      }, { status: 401 });
    }
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal Server Error. Please try again later.' 
    }, { status: 500 });
  }
}
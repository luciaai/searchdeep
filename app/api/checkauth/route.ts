import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ 
      authenticated: false,
      message: 'User is not authenticated'
    }, { status: 401 });
  }
  
  return NextResponse.json({ 
    authenticated: true,
    userId: userId,
    message: 'User is authenticated'
  });
}

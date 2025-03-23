import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { addCredits } from '@/lib/user-credits';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const clerkId = session?.userId;
    
    if (!clerkId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Force add 30 credits to the user's account
    const updatedUser = await addCredits(clerkId, 30);
    
    return NextResponse.json({
      success: true,
      message: 'Successfully added 30 credits to your account',
      credits: updatedUser.credits
    });
  } catch (error) {
    console.error('Error adding credits:', error);
    return NextResponse.json(
      { error: 'Failed to add credits' },
      { status: 500 }
    );
  }
}

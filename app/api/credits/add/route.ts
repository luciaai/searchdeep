import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { addCredits } from '@/lib/user-credits';

// Use a simple in-memory cache for rate limiting
// This will reset when the server restarts
const lastCreditAddition = new Map<string, number>();

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

    // Check if the user has already used this endpoint in the last 24 hours
    const now = Date.now();
    const lastAddition = lastCreditAddition.get(clerkId);
    
    if (lastAddition && (now - lastAddition < 24 * 60 * 60 * 1000)) {
      return NextResponse.json(
        { error: 'Rate limited: You can only add credits once per day' },
        { status: 429 }
      );
    }

    // Force add 30 credits to the user's account
    const updatedUser = await addCredits(clerkId, 30);
    
    // Update the last credit addition timestamp in memory
    lastCreditAddition.set(clerkId, now);
    
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

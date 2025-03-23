import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { addCredits } from '@/lib/user-credits';

// This endpoint should never be publicly accessible
// It requires an admin secret key to work
export async function GET(req: NextRequest) {
  try {
    // Check for admin secret key
    const url = new URL(req.url);
    const adminKey = url.searchParams.get('adminKey');
    const expectedAdminKey = process.env.ADMIN_SECRET_KEY;
    
    // If no admin key is set in env, disable this endpoint completely
    if (!expectedAdminKey) {
      console.error('ADMIN_SECRET_KEY not set in environment variables');
      return NextResponse.json(
        { error: 'This endpoint is disabled' },
        { status: 404 }
      );
    }
    
    // Verify the admin key
    if (adminKey !== expectedAdminKey) {
      console.error('Invalid admin key used to access credits/add endpoint');
      return NextResponse.json(
        { error: 'Not Found' },
        { status: 404 }
      );
    }
    
    // Get the user ID
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

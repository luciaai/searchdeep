import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

// Prevent static generation for this route
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // Get the authenticated user
    const session = await auth();
    const userId = session?.userId;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Find the user in our database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ subscription: null });
    }

    // Get the user's active subscription
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        status: 'active',
      },
      orderBy: {
        currentPeriodEnd: 'desc',
      },
    });
    
    // If no subscription found in the Subscription table, but user has stripeSubscriptionId and status
    // This is critical for showing subscription status on pricing page
    if (!subscription && user.stripeSubscriptionId && user.stripeSubscriptionStatus === 'active') {
      console.log(`✅ No subscription found in Subscription table, but user has active stripe subscription: ${user.stripeSubscriptionId}`);
      
      // Create a fallback subscription object from user data
      const fallbackSubscription = {
        id: 'fallback-' + user.id,
        userId: user.id,
        stripeSubscriptionId: user.stripeSubscriptionId,
        status: 'active',
        tierId: user.tierId || 'pro', // Default to 'pro' tier
        // Set a future date (1 month from now) for currentPeriodEnd 
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        cancelAtPeriodEnd: false
      };
      
      console.log(`✅ Created fallback subscription from user record`, fallbackSubscription);
      return NextResponse.json({ subscription: fallbackSubscription });
    }

    return NextResponse.json({ subscription });
  } catch (error: any) {
    console.error('Error fetching user subscription:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch user subscription' },
      { status: 500 }
    );
  }
}
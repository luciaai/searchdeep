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

    return NextResponse.json({ subscription });
  } catch (error: any) {
    console.error('Error fetching user subscription:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch user subscription' },
      { status: 500 }
    );
  }
}
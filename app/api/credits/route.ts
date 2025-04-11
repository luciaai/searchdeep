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
      select: { credits: true, id: true }
    });

    if (!user) {
      // Create a new user with starting credits only if they don't exist in the database
      // This should only happen for brand new users, not returning users
      const combinedUserId = `user_${userId}`;
      const newUser = await prisma.user.create({
        data: {
          id: combinedUserId,
          clerkId: userId,
          credits: Number(process.env.STARTING_CREDITS || 5),
        }
      });
      
      return NextResponse.json({ credits: newUser.credits });
    }

    // Simply return the user's current credits without modifying them
    return NextResponse.json({ credits: user.credits });
  } catch (error: any) {
    console.error('Error fetching user credits:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch user credits' },
      { status: 500 }
    );
  }
}
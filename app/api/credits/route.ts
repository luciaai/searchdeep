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
      select: { credits: true }
    });

    if (!user) {
      return NextResponse.json(
        { credits: Number(process.env.STARTING_CREDITS || 3) },
        { status: 200 }
      );
    }

    return NextResponse.json({ credits: user.credits });
  } catch (error: any) {
    console.error('Error fetching user credits:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch user credits' },
      { status: 500 }
    );
  }
}
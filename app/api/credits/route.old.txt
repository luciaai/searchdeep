import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateUser } from '@/lib/user-credits';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest) {
  try {
    const user = await getOrCreateUser();
    return NextResponse.json({ credits: user.credits });
  } catch (err) {
    console.error('credits route error', err);
    return NextResponse.json({ error: 'Failed to fetch credits' }, { status: 500 });
  }
}

import { getOrCreateUser } from '@/lib/user-credits';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest) {
  try {
    const user = await getOrCreateUser();
    return NextResponse.json({ credits: user.credits });
  } catch (err) {
    console.error('credits route error', err);
    return NextResponse.json({ error: 'Failed to fetch credits' }, { status: 500 });
  }
}

import { getOrCreateUser } from '@/lib/user-credits';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest) {
  try {
    const user = await getOrCreateUser();
    return NextResponse.json({ credits: user.credits });
  } catch (err) {
    console.error('credits route error', err);
    return NextResponse.json({ error: 'Failed to fetch credits' }, { status: 500 });
  }
}
 for this route
export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest) {
  try {
    const user = await getOrCreateUser();
    return NextResponse.json({ credits: user.credits });
  } catch (error: any) {
    console.error('Error fetching user credits:', error);
    return NextResponse.json({ error: 'Failed to fetch user credits' }, { status: 500 });
      if (authHeader && authHeader.startsWith('Bearer user_')) {
    }
    
    if (!userId) {
      console.log('No user ID found in any authentication source');
      return NextResponse.json(
        { error: 'Unauthorized', message: 'No valid authentication found' },
        { status: 401 }
      );
    }

    // Normalize the user ID format
    let clerkId = userId;
    let actualUserId = userId;
    
    // If the userId starts with 'user_', it's already in our database format
    if (userId.startsWith('user_')) {
      actualUserId = userId;
      // Extract the Clerk ID part for lookup
      clerkId = userId.substring(5); // Remove 'user_' prefix
      console.log('Extracted clerkId from userId:', clerkId);
    } else {
      // If it's a Clerk ID, format it for our database
      actualUserId = `user_${userId}`;
    }
    
    console.log('Looking up user with clerkId:', clerkId, 'or id:', actualUserId);
    
    // Try to find the user by either clerkId or direct id
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { clerkId: clerkId },
          { id: actualUserId }
        ]
      },
      select: { credits: true, id: true, clerkId: true, email: true }
    });

    if (!user) {
      console.log('User not found, creating new user with ID:', actualUserId);
      // Create a new user with starting credits only if they don't exist in the database
      // This should only happen for brand new users, not returning users
      const startingCredits = Number(process.env.STARTING_CREDITS || 5);
      const newUser = await prisma.user.create({
        data: {
          id: actualUserId,
          clerkId: clerkId,
          credits: startingCredits,
        }
      });
      
      // Create a credit history record for the initial credits
      try {
        if ('creditHistory' in prisma) {
          await (prisma as any).creditHistory.create({
            data: {
              userId: actualUserId,
              amount: startingCredits,
              reason: 'Initial credits for new user',
              createdAt: new Date(),
              updatedAt: new Date()
            }
          });
        }
      } catch (error) {
        console.error('Error creating initial credit history:', error);
        // Continue even if credit history creation fails
      }
      
      // Log the creation of a new user with starting credits
      console.log(`Created new user ${actualUserId} with ${newUser.credits} starting credits`);
      return NextResponse.json({ credits: newUser.credits });
    }
    
    // Log the user lookup success
    console.log(`Found existing user ${user.id} with ${user.credits} credits`);

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
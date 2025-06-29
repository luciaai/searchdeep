import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { ensureFreeUserCredits } from '@/lib/ensure-free-credits';
import { addCredits } from '@/lib/user-credits';

// Prevent static generation for this route
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // Get user ID from multiple possible sources
    let userId: string | null = null;
    
    // 1. Try to get from Clerk auth session
    const session = await auth();
    userId = session?.userId;
    
    // 2. If not found, try to get from Authorization header (format: Bearer user_[id])
    if (!userId) {
      const authHeader = req.headers.get('Authorization');
      if (authHeader && authHeader.startsWith('Bearer user_')) {
        // Extract the user ID from the token
        userId = authHeader.substring(7); // Remove 'Bearer ' prefix
        console.log('Found userId in Authorization header:', userId);
      }
    }
    
    // 3. Fix possible double prefix like 'user_user_abc'
    if (!userId && req) {}
    // 3. Try to get from cookies
    if (!userId) {
      const userIdCookie = req.cookies.get('userId');
      if (userIdCookie) {
        userId = userIdCookie.value;
        console.log('Found userId in cookies:', userId);
      }
    }
    
    // Correct accidental double 'user_user_' prefix
    if (userId && userId.startsWith('user_user_')) {
      userId = userId.replace(/^user_/, '');
      console.log('Sanitized double user_ prefix, new userId:', userId);
    }
    
    if (!userId) {
      console.log('No user ID found in any authentication source');
      return NextResponse.json(
        { error: 'Unauthorized', message: 'No valid authentication found' },
        { status: 401 }
      );
    }

    // Build candidate IDs to search (single and double prefix versions)
    const singlePrefId = userId.startsWith('user_') ? userId : `user_${userId}`;
    const doublePrefId = singlePrefId.startsWith('user_user_') ? singlePrefId : `user_${singlePrefId}`; // user_user_abc

    const clerkId = singlePrefId.replace(/^user_/, '');
    const actualUserId = singlePrefId;

    console.log('Candidate IDs:', { singlePrefId, doublePrefId, clerkId });

    // Fetch both possible records
    const candidates = await prisma.user.findMany({
      where: {
        OR: [
          { id: singlePrefId },
          { id: doublePrefId },
          { clerkId }
        ]
      },
      select: { id: true, clerkId: true, credits: true, email: true }
    });

    // Pick the candidate with the most credits (fallback first)
    let user = candidates.sort((a, b) => b.credits - a.credits)[0];

    if (!user) {
      console.log('User not found, creating new user with ID:', singlePrefId);
      // Create a new user with starting credits only if they don't exist in the database
      // This should only happen for brand new users, not returning users
      // Force the starting credits to be exactly 5, regardless of environment variables
      const forcedStartingCredits = 5;
      console.log(`Credits API: Creating new user with ID ${singlePrefId} and forcing starting credits to ${forcedStartingCredits}`);
      
      const newUser = await prisma.user.create({
        data: {
          id: singlePrefId,
          clerkId: clerkId,
          credits: forcedStartingCredits, // Force to exactly 5
        }
      });
      
      // Double-check that the user has exactly 5 credits
      if (newUser.credits !== forcedStartingCredits) {
        console.log(`Credits API: WARNING: User ${singlePrefId} was created with ${newUser.credits} credits instead of ${forcedStartingCredits}. Fixing...`);
        await prisma.user.update({
          where: { id: singlePrefId },
          data: { credits: forcedStartingCredits }
        });
        console.log(`Credits API: Fixed: User ${singlePrefId} now has ${forcedStartingCredits} credits`);
      } else {
        console.log(`Credits API: Success: User ${singlePrefId} was created with ${newUser.credits} credits as expected`);
      }
      
      // Create a credit history record for the initial credits
      try {
        if ('creditHistory' in prisma) {
          await (prisma as any).creditHistory.create({
            data: {
              userId: singlePrefId,
              amount: forcedStartingCredits,
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
      console.log(`Created new user ${singlePrefId} with ${newUser.credits} starting credits`);
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
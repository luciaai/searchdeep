import { auth } from '@clerk/nextjs/server';
import prisma from './prisma';
import { getUserId } from './utils';
import { SearchGroupId } from './utils';

// Environment variable for starting credits
const STARTING_CREDITS = Number(process.env.STARTING_CREDITS || 3);

/**
 * Get or create a user in the database
 */
export async function getOrCreateUser() {
  try {
    const session = await auth();
    const clerkId = session?.userId;
    
    if (!clerkId) {
      throw new Error('User not authenticated');
    }

    // Get the combined user ID from the utils function
    const combinedUserId = `user_${clerkId}`;
    
    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { clerkId },
    });

    // If user doesn't exist, create a new one
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: combinedUserId,
          clerkId,
          credits: STARTING_CREDITS,
        },
      });
    }

    return user;
  } catch (error) {
    console.error('Error in getOrCreateUser:', error);
    throw new Error('Failed to get or create user');
  }
}

/**
 * Check if a user has enough credits for a search
 */
export async function hasEnoughCredits() {
  try {
    const user = await getOrCreateUser();
    return { hasCredits: user.credits > 0 };
  } catch (error) {
    console.error('Error checking credits:', error);
    return { hasCredits: false, error: 'Failed to check credits' };
  }
}

/**
 * Decrement a user's credits
 */
export async function useCredit() {
  try {
    const user = await getOrCreateUser();
    
    // Update the user's credits
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        credits: {
          decrement: 1
        }
      }
    });
    
    return updatedUser;
  } catch (error) {
    console.error('Error using credit:', error);
    throw new Error('Failed to use credit');
  }
}

/**
 * Log a search in the database
 */
export async function logSearch(query: string, groupId: SearchGroupId) {
  try {
    const user = await getOrCreateUser();
    
    // Create the search entry
    const search = await prisma.search.create({
      data: {
        query,
        groupId,
        userId: user.id,
      },
    });
    
    // Use a credit for the search
    await useCredit();
    
    return search;
  } catch (error) {
    console.error('Error logging search:', error);
    throw new Error('Failed to log search');
  }
}

/**
 * Get a user's search history
 */
export async function getUserSearchHistory() {
  const session = await auth();
  const clerkId = session.userId;
  
  if (!clerkId) {
    throw new Error('User not authenticated');
  }

  const user = await getOrCreateUser();

  const searches = await prisma.search.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return searches;
}

/**
 * Get a user's remaining credits
 */
export async function getUserCredits() {
  try {
    const user = await getOrCreateUser();
    return user.credits;
  } catch (error) {
    console.error('Error getting user credits:', error);
    return 0; // Return 0 credits as a fallback
  }
}

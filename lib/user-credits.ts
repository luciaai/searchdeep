import { auth } from '@clerk/nextjs/server';
import prisma from './prisma';
import { getUserId } from './utils';
import { SearchGroupId } from './utils';

// Environment variable for starting credits
const STARTING_CREDITS = Number(process.env.STARTING_CREDITS || 5);

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
    
    // Get user details from Clerk
    const clerkUser = await fetch(`https://api.clerk.dev/v1/users/${clerkId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());
    
    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { clerkId },
      include: {
        subscriptions: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      }
    });

    // If user doesn't exist, create a new one
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: combinedUserId,
          clerkId,
          firstName: clerkUser.first_name || null,
          lastName: clerkUser.last_name || null,
          email: clerkUser.email_addresses?.[0]?.email_address || null,
          credits: STARTING_CREDITS,
          subscriptions: {
            create: []
          }
        },
        include: {
          subscriptions: true
        }
      });
    } else if (!user.firstName || !user.lastName || !user.email) {
      // Update existing user with missing information
      user = await prisma.user.update({
        where: { clerkId },
        data: {
          firstName: clerkUser.first_name || user.firstName,
          lastName: clerkUser.last_name || user.lastName,
          email: clerkUser.email_addresses?.[0]?.email_address || user.email,
        },
        include: {
          subscriptions: true
        }
      });
    }

    if (!user) {
      throw new Error('Failed to create or find user');
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
    return { hasCredits: user.credits >= 1 };
  } catch (error) {
    console.error('Error checking credits:', error);
    return { hasCredits: false, error: 'Failed to check credits' };
  }
}

/**
 * Decrement a user's credits
 */
export async function decrementCredit() {
  try {
    const user = await getOrCreateUser();
    
    // Check if user has enough credits
    if (user.credits < 1) {
      throw new Error('Not enough credits');
    }
    
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
    await decrementCredit();
    
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

/**
 * Get a user's active subscription if any
 */
export async function getUserSubscription() {
  try {
    const user = await getOrCreateUser();
    
    if (!user.subscriptions || user.subscriptions.length === 0) {
      return null;
    }
    
    const subscription = user.subscriptions[0];
    
    // Check if subscription is active
    if (subscription.status !== 'active') {
      return null;
    }
    
    return subscription;
  } catch (error) {
    console.error('Error getting user subscription:', error);
    return null;
  }
}

/**
 * Add credits to a user's account
 */
export async function addCredits(clerkId: string, credits: number) {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId },
    });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        credits: {
          increment: credits
        }
      }
    });
    
    return updatedUser;
  } catch (error) {
    console.error('Error adding credits:', error);
    throw new Error('Failed to add credits');
  }
}

/**
 * Set a user's credits to a specific amount
 */
export async function setCredits(clerkId: string, credits: number) {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId },
    });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        credits: credits
      }
    });
    
    return updatedUser;
  } catch (error) {
    console.error('Error setting credits:', error);
    throw new Error('Failed to set credits');
  }
}

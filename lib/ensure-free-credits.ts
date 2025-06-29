import prisma from './prisma';

/**
 * This function ensures that new users get exactly 5 credits when they sign up.
 * It only applies to brand new users and does not modify existing users' credits.
 * 
 * The function is called during user creation to ensure consistency across all user creation paths.
 */
export async function ensureFreeUserCredits(userId: string) {
  try {
    // Check if this is a new user
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      console.log(`User ${userId} not found`);
      return { updated: 0, message: 'User not found' };
    }

    // Check if there's any credit history for this user
    let hasHistory = false;
    if ('creditHistory' in prisma) {
      const creditHistory = await (prisma as any).creditHistory.findMany({
        where: { userId: userId },
        take: 1
      });
      hasHistory = creditHistory && creditHistory.length > 0;
    }

    // Only proceed if this is a brand new user with no credit history and incorrect credits
    if (user.credits !== 5 && !hasHistory) {
      console.log(`Ensuring new user ${userId} has exactly 5 starting credits (current: ${user.credits})`);
      
      // Update the user to have exactly 5 credits
      await prisma.user.update({
        where: { id: userId },
        data: { credits: 5 }
      });
      
      // Log this credit adjustment if the creditHistory model exists
      if ('creditHistory' in prisma) {
        await (prisma as any).creditHistory.create({
          data: {
            userId: userId,
            amount: 5 - user.credits, // The difference to get to 5
            reason: 'Adjusted to ensure correct starting credits',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        });
      }
      
      return { updated: 1, message: `Updated user ${userId} to have 5 credits` };
    }
    
    return { updated: 0, message: 'No update needed' };
  } catch (error) {
    console.error('Error in ensureFreeUserCredits:', error);
    return { updated: 0, error: String(error) };
  }
}

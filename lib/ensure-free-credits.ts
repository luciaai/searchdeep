import prisma from './prisma';

/**
 * Ensures all free users have at least 5 credits
 * This function can be called during application startup
 */
export async function ensureFreeUserCredits() {
  try {
    // Find all free users with less than 5 credits
    const freeUsers = await prisma.user.findMany({
      where: {
        credits: { lt: 5 },
        // Only update users who don't have an active paid subscription
        OR: [
          { stripeSubscriptionStatus: null },
          { stripeSubscriptionStatus: { not: 'active' } },
          { tierId: 'free' },
          { tierId: null }
        ]
      }
    });

    if (freeUsers.length > 0) {
      console.log(`Found ${freeUsers.length} free users with less than 5 credits`);

      // Update all these users to have 5 credits
      const updatePromises = freeUsers.map(user => 
        prisma.user.update({
          where: { id: user.id },
          data: { credits: 5 }
        })
      );

      await Promise.all(updatePromises);
      console.log(`Successfully updated ${freeUsers.length} users to have 5 credits`);
    }

    return { updated: freeUsers.length };
  } catch (error) {
    console.error('Error ensuring free user credits:', error);
    return { error: 'Failed to update user credits', updated: 0 };
  }
}

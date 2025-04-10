// CommonJS script to update free user credits
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateFreeUserCredits() {
  try {
    // Find all users who have exactly 3 credits (likely free plan users)
    const freeUsers = await prisma.user.findMany({
      where: {
        credits: 3,
        // Only update users who don't have an active subscription
        stripeSubscriptionStatus: {
          not: 'active'
        }
      }
    });

    console.log(`Found ${freeUsers.length} free users with 3 credits`);

    // Update all these users to have 5 credits
    const updatePromises = freeUsers.map(user => 
      prisma.user.update({
        where: { id: user.id },
        data: { credits: 5 }
      })
    );

    const results = await Promise.all(updatePromises);
    console.log(`Successfully updated ${results.length} users to have 5 credits`);

    // Also find users with less than 3 credits and update them to 5
    const lowCreditUsers = await prisma.user.findMany({
      where: {
        credits: { lt: 3 },
        stripeSubscriptionStatus: {
          not: 'active'
        }
      }
    });

    console.log(`Found ${lowCreditUsers.length} free users with less than 3 credits`);

    const lowCreditUpdatePromises = lowCreditUsers.map(user => 
      prisma.user.update({
        where: { id: user.id },
        data: { credits: 5 }
      })
    );

    const lowCreditResults = await Promise.all(lowCreditUpdatePromises);
    console.log(`Successfully updated ${lowCreditResults.length} low-credit users to have 5 credits`);

  } catch (error) {
    console.error('Error updating free user credits:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
updateFreeUserCredits()
  .then(() => console.log('Credit update completed'))
  .catch(error => console.error('Script failed:', error));

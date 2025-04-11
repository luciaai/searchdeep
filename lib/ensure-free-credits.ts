import prisma from './prisma';

/**
 * DISABLED: This function has been disabled to prevent credits from resetting to 5 after each search
 * 
 * This function was originally intended to update existing free users who still had the old default of 3 credits
 * to the new default of 5 credits, but it's causing issues with the credit system.
 */
export async function ensureFreeUserCredits() {
  // Function is completely disabled to prevent any credit resets
  console.log('ensureFreeUserCredits has been disabled to prevent credit resets');
  return { updated: 0 };
}


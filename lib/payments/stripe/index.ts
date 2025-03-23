import { Stripe } from 'stripe';
import { tiers } from '@/lib/tiers';
import prisma from '@/lib/prisma';
import { addCredits } from '@/lib/user-credits';

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-02-24.acacia',
});

/**
 * Create a checkout session for a subscription
 */
export async function createCheckoutSession(tierId: string, clerkId: string) {
  try {
    // Find the tier
    const tier = tiers.find((t) => t.id === tierId);
    if (!tier) {
      throw new Error(`Tier ${tierId} not found`);
    }

    // Check if the tier has a Stripe price ID
    if (!tier.stripePriceId) {
      throw new Error(`Invalid tier or missing Stripe price ID for tier: ${tierId}`);
    }

    // Find or create the user in our database
    let user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      // Create the user if they don't exist
      user = await prisma.user.create({
        data: {
          id: clerkId, // Use clerkId as id to ensure uniqueness
          clerkId,
          credits: Number(process.env.STARTING_CREDITS || 3),
        },
      });
    }

    // Create a customer in Stripe if the user doesn't have one
    if (!user.stripeCustomerId) {
      const customer = await stripe.customers.create({
        metadata: {
          clerkId,
          userId: user.id,
        },
      });

      // Update the user with the Stripe customer ID
      await prisma.user.update({
        where: { id: user.id },
        data: {
          stripeCustomerId: customer.id,
        },
      });

      user.stripeCustomerId = customer.id;
    }

    // Create the checkout session using the tier's Stripe price ID
    const session = await stripe.checkout.sessions.create({
      customer: user.stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: tier.stripePriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      metadata: {
        userId: user.id,
        clerkId,
        tierId,
      },
    });

    return { url: session.url };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw new Error('Failed to create checkout session');
  }
}

/**
 * Create a customer portal session
 */
export async function createCustomerPortalSession(clerkId: string) {
  try {
    console.log(`🔍 Looking up user with clerkId: ${clerkId} for customer portal`);
    
    // Find the user
    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      console.error(`❌ User not found with clerkId: ${clerkId}`);
      throw new Error('User not found');
    }
    
    console.log(`✅ Found user: ${user.id}, stripeCustomerId: ${user.stripeCustomerId}, subId: ${user.stripeSubscriptionId}, status: ${user.stripeSubscriptionStatus}`);

    if (!user.stripeCustomerId) {
      console.error(`❌ User does not have a Stripe customer ID: ${user.id}`);
      throw new Error('User has no Stripe customer ID');
    }

    // Create a session
    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    });

    console.log(`✅ Created portal session for customer: ${user.stripeCustomerId}`);
    return { url: session.url };
  } catch (error) {
    console.error('Error creating portal session:', error);
    throw new Error('Failed to create portal session');
  }
}

/**
 * Handle subscription changes from Stripe webhooks
 */
export async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  try {
    // Get the customer ID from the subscription
    const customerId = subscription.customer as string;

    // Find the user associated with this customer
    const user = await prisma.user.findFirst({
      where: { stripeCustomerId: customerId },
    });

    if (!user) {
      console.error(`No user found for Stripe customer: ${customerId}`);
      return false;
    }

    // Get the subscription item (should only be one for our use case)
    const subscriptionItem = subscription.items.data[0];
    const priceId = subscriptionItem.price.id;

    // Find the tier based on the subscription metadata
    const tierId = subscription.metadata.tierId;
    const tier = tiers.find((t) => t.id === tierId);

    if (!tier) {
      console.warn(`No tier found for ID: ${tierId}, using default values`);
    }

    // Create a unique key for this subscription period to prevent duplicate credit additions
    const currentPeriodStart = new Date(subscription.current_period_start * 1000);
    
    console.log(`✅ Processing subscription: ${subscription.id}`);
    console.log(`✅ Current period start: ${currentPeriodStart.toISOString()}`);
    console.log(`✅ Status: ${subscription.status}`);
    console.log(`✅ User: ${user.clerkId}`);

    // Update or create the subscription in our database
    const existingSubscription = await prisma.subscription.findFirst({
      where: { stripeSubscriptionId: subscription.id },
      include: {
        // Include any fields needed for checking
      }
    });

    // CRITICAL: Check if we've already processed this exact billing period
    // Use the webhook event type to determine if we should add credits
    const isCheckoutCompletion = subscription.metadata.processedViaCheckout === 'true';
    const isNewSubscription = !existingSubscription;
    const isRenewal = subscription.current_period_start > subscription.created;
    
    console.log(`✅ Is checkout completion: ${isCheckoutCompletion}`);
    console.log(`✅ Is new subscription: ${isNewSubscription}`);
    console.log(`✅ Is renewal: ${isRenewal}`);

    // ULTRA SIMPLE APPROACH: Use a single flag in the database to track if credits were added
    let shouldAddCredits = false;
    
    if (existingSubscription) {
      // Update existing subscription
      await prisma.subscription.update({
        where: { id: existingSubscription.id },
        data: {
          status: subscription.status,
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          priceId,
          tierId,
        },
      });
      
      // For existing subscriptions, only add credits on renewal
      if (subscription.status === 'active' && isRenewal) {
        // Check if we already processed this period
        const lastPeriodStart = (existingSubscription as any).lastPeriodStart;
        
        if (lastPeriodStart) {
          const lastPeriodDate = new Date(lastPeriodStart);
          if (lastPeriodDate.getTime() === currentPeriodStart.getTime()) {
            console.log(`⚠️ DUPLICATE PREVENTION: Already added credits for this period`);
            shouldAddCredits = false;
          } else {
            console.log(`✅ New billing period detected, will add credits`);
            shouldAddCredits = true;
          }
        } else {
          console.log(`✅ No lastPeriodStart found, will add credits`);
          shouldAddCredits = true;
        }
      }
    } else {
      // Create new subscription
      await prisma.subscription.create({
        data: {
          stripeSubscriptionId: subscription.id,
          userId: user.id,
          status: subscription.status,
          priceId,
          tierId,
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        },
      });
      
      // For new subscriptions, add credits if this is the first time processing
      // but only if it's not already processed via checkout
      if (subscription.status === 'active') {
        // ALWAYS add credits for new active subscriptions
        console.log(`✅ New subscription, will add credits`);
        shouldAddCredits = true;
      }
    }

    // ONLY add credits if our flag says we should
    if (subscription.status === 'active' && shouldAddCredits) {
      // ALWAYS add exactly 30 credits for active subscriptions - NEVER MORE, NEVER LESS
      const creditsToAdd = 30;
      
      console.log(`🔴 CRITICAL: Adding EXACTLY ${creditsToAdd} credits to user ${user.clerkId} - NOT 60!`);
      
      try {
        // Add the credits
        const updatedUser = await addCredits(user.clerkId, creditsToAdd);
        console.log(`✅ Credits added successfully. New balance: ${updatedUser.credits}`);
        
        // CRITICAL: Update the user's subscription status in the user table
        await prisma.user.update({
          where: { id: user.id },
          data: {
            stripeSubscriptionId: subscription.id,
            stripeSubscriptionStatus: subscription.status
          }
        });
        console.log(`✅ Updated user record with subscription ID and status: ${subscription.status}`);
        
        // Mark this period as processed
        const subscriptionToUpdate = existingSubscription || 
          await prisma.subscription.findFirst({
            where: { stripeSubscriptionId: subscription.id },
          });
        
        if (subscriptionToUpdate) {
          await prisma.subscription.update({
            where: { id: subscriptionToUpdate.id },
            data: {
              ...(({
                lastCreditAddedAt: new Date(),
                lastPeriodStart: currentPeriodStart.toISOString(),
              } as any))
            },
          });
          console.log(`✅ Updated subscription record to prevent duplicate credits`);
        }
        
        return true;
      } catch (error) {
        console.error('❌ Error adding credits:', error);
        throw new Error('Failed to add credits');
      }
    } else {
      console.log(`⚠️ Not adding credits. Status: ${subscription.status}`);
    }

    return true;
  } catch (error) {
    console.error('❌ Error handling subscription change:', error);
    throw new Error('Failed to handle subscription change');
  }
}

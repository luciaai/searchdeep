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
    // Find the user
    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user || !user.stripeCustomerId) {
      throw new Error('User not found or no Stripe customer ID');
    }

    // Create the portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    });

    return { url: session.url };
  } catch (error) {
    console.error('Error creating portal session:', error);
    throw new Error('Failed to create portal session');
  }
}

// Track processed subscription periods to prevent duplicate credit additions
// This will reset on server restart, but combined with the webhook deduplication, it should work
const processedSubscriptionPeriods = new Set<string>();

/**
 * Handle subscription changes from Stripe webhooks
 */
export async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  try {
    const customerId = subscription.customer as string;

    // Find the user with this Stripe customer ID
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

    // Determine the credits to add based on the subscription status
    let creditsToAdd = 0;
    if (subscription.status === 'active') {
      creditsToAdd = 30; // Always add 30 credits for active subscriptions
    }

    // Update or create the subscription in our database
    const existingSubscription = await prisma.subscription.findFirst({
      where: { stripeSubscriptionId: subscription.id },
    });

    // Create a unique key for this subscription period to prevent duplicate credit additions
    const currentPeriodStart = new Date(subscription.current_period_start * 1000);
    const subscriptionPeriodKey = `${subscription.id}_${currentPeriodStart.getTime()}`;

    // Check if we've already processed this subscription period
    const alreadyProcessed = processedSubscriptionPeriods.has(subscriptionPeriodKey);

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
    }

    // Add credits if the subscription is active and we haven't already processed this period
    if (subscription.status === 'active' && creditsToAdd > 0 && !alreadyProcessed) {
      // Mark this subscription period as processed
      processedSubscriptionPeriods.add(subscriptionPeriodKey);

      console.log(`Adding ${creditsToAdd} credits to user ${user.clerkId}`);
      console.log(`Subscription status: ${subscription.status}`);
      console.log(`Tier ID: ${tierId}`);
      console.log(`Current period start: ${currentPeriodStart.toISOString()}`);

      try {
        const updatedUser = await addCredits(user.clerkId, creditsToAdd);
        console.log(`Credits added successfully. New balance: ${updatedUser.credits}`);
        return true;
      } catch (error) {
        console.error('Error adding credits:', error);
        throw new Error('Failed to add credits');
      }
    } else if (alreadyProcessed) {
      console.log(`Credits already added for subscription period ${subscriptionPeriodKey}, skipping`);
    } else {
      console.log(`Not adding credits. Status: ${subscription.status}, Credits to add: ${creditsToAdd}`);
    }

    return true;
  } catch (error) {
    console.error('Error handling subscription change:', error);
    throw new Error('Failed to handle subscription change');
  }
}

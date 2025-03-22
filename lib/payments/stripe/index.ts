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
      line_items: [
        {
          price: tier.stripePriceId,
          quantity: 1,
        },
      ],
      metadata: {
        tierId,
        clerkId,
        userId: user.id,
      },
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://searchdeep.vercel.app'}/pricing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://searchdeep.vercel.app'}/pricing?canceled=true`,
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
      return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://searchdeep.vercel.app'}/pricing`,
    });

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
    const customerId = subscription.customer as string;
    
    // Find the user with this Stripe customer ID
    const user = await prisma.user.findFirst({
      where: { stripeCustomerId: customerId },
    });

    if (!user) {
      throw new Error(`No user found with Stripe customer ID: ${customerId}`);
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
      creditsToAdd = tier?.credits || 0;
    }

    // Update or create the subscription in our database
    const existingSubscription = await prisma.subscription.findFirst({
      where: { stripeSubscriptionId: subscription.id },
    });

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

    // Add credits if the subscription is active and has just been created or renewed
    if (subscription.status === 'active' && creditsToAdd > 0) {
      // Check if this is a renewal by looking at the billing cycle
      const isRenewal = subscription.current_period_start > subscription.created;
      
      // Always add credits for new subscriptions or renewals
      console.log(`Adding ${creditsToAdd} credits to user ${user.clerkId}`);
      await addCredits(user.clerkId, creditsToAdd);
    }

    return true;
  } catch (error) {
    console.error('Error handling subscription change:', error);
    throw new Error('Failed to handle subscription change');
  }
}

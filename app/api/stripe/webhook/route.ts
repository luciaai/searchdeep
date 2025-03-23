import { NextRequest, NextResponse } from 'next/server';
import { Stripe } from 'stripe';
import { handleSubscriptionChange } from '@/lib/payments/stripe';
import prisma from '@/lib/prisma'; // Import prisma instance

// Prevent static generation for this route
export const dynamic = 'force-dynamic';

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-02-24.acacia',
});

// Track processed events to prevent duplicates (in-memory solution)
// This will reset on server restart, but it's better than nothing
const processedEvents = new Set<string>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature') as string;

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    // Verify the webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET as string
      );
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return NextResponse.json(
        { error: `Webhook signature verification failed: ${err.message}` },
        { status: 400 }
      );
    }

    // Generate a unique ID for this event to prevent duplicate processing
    const eventUniqueId = `${event.type}_${event.id}`;
    
    // Check if we've already processed this event
    if (processedEvents.has(eventUniqueId)) {
      console.log(`Event ${eventUniqueId} already processed, skipping`);
      return NextResponse.json({ received: true, status: 'already_processed' });
    }
    
    // Mark this event as processed
    processedEvents.add(eventUniqueId);
    
    // Process the event based on its type
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Checkout session completed:', session.id);
        
        // If this is a subscription checkout, retrieve the subscription
        if (session.mode === 'subscription' && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );
          
          // Generate a unique ID for this checkout session
          const checkoutUniqueId = `checkout_${session.id}`;
          
          // Check if we've already processed this checkout session
          if (processedEvents.has(checkoutUniqueId)) {
            console.log(`Checkout session ${session.id} already processed, skipping`);
            return NextResponse.json({ received: true, status: 'already_processed' });
          }
          
          // Mark this checkout session as processed
          processedEvents.add(checkoutUniqueId);
          
          // Transfer metadata from checkout session to subscription if needed
          if (session.metadata && session.metadata.tierId && !subscription.metadata.tierId) {
            await stripe.subscriptions.update(
              subscription.id,
              {
                metadata: {
                  ...subscription.metadata,
                  tierId: session.metadata.tierId,
                  // Add a flag to indicate this subscription was processed via checkout
                  processedViaCheckout: 'true'
                }
              }
            );
            
            // Retrieve the updated subscription
            const updatedSubscription = await stripe.subscriptions.retrieve(
              subscription.id
            );
            
            // Handle the subscription
            await handleSubscriptionChange(updatedSubscription);
          } else {
            // Handle the subscription
            await handleSubscriptionChange(subscription);
          }
        }
        break;

      case 'customer.subscription.created':
        // Only process if not already processed via checkout
        const newSubscription = event.data.object as Stripe.Subscription;
        
        // Generate a unique ID for this subscription creation
        const subCreatedUniqueId = `subscription_created_${newSubscription.id}`;
        
        // Check if we've already processed this subscription creation
        if (processedEvents.has(subCreatedUniqueId)) {
          console.log(`Subscription creation ${newSubscription.id} already processed, skipping`);
          return NextResponse.json({ received: true, status: 'already_processed' });
        }
        
        // Mark this subscription creation as processed
        processedEvents.add(subCreatedUniqueId);
        
        // Only process if not already processed via checkout
        if (newSubscription.metadata.processedViaCheckout !== 'true') {
          console.log(`New subscription created:`, newSubscription.id);
          await handleSubscriptionChange(newSubscription);
        } else {
          console.log(`Subscription ${newSubscription.id} already processed via checkout, skipping`);
        }
        break;
        
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`Subscription ${event.type}:`, subscription.id);
        
        // Handle the subscription change
        await handleSubscriptionChange(subscription);
        break;
        
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Error processing webhook' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { handleSubscriptionChange } from '@/lib/payments/stripe';
import prisma from '@/lib/prisma'; // Import prisma instance

// Prevent static generation for this route
export const dynamic = 'force-dynamic';

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-02-24.acacia',
});

// Track processed events to prevent duplicates (in-memory solution)
// This will reset on server restart, but we also check the database
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
      console.error(`❌ Webhook signature verification failed: ${err.message}`);
      return NextResponse.json(
        { error: `Webhook signature verification failed: ${err.message}` },
        { status: 400 }
      );
    }

    // Generate a unique ID for this event to prevent duplicate processing
    const eventUniqueId = `${event.type}_${event.id}`;
    
    // Check if we've already processed this event in memory
    if (processedEvents.has(eventUniqueId)) {
      console.log(`⚠️ Event ${eventUniqueId} already processed in memory, skipping`);
      return NextResponse.json({ received: true, status: 'already_processed' });
    }
    
    // Check if we've already processed this event in the database
    const existingEvent = await (prisma as any).stripeEvent.findUnique({
      where: { eventId: event.id }
    });
    
    if (existingEvent) {
      console.log(`⚠️ Event ${event.id} already exists in database, skipping to prevent duplicate processing`);
      // Still add to in-memory cache for faster checks
      processedEvents.add(eventUniqueId);
      return NextResponse.json({ received: true, status: 'already_processed_db' });
    }
    
    // Mark this event as processed in memory
    processedEvents.add(eventUniqueId);
    console.log(`✅ Processing event: ${event.type}, ID: ${event.id}, Total in-memory events: ${processedEvents.size}`);
    
    // CRITICAL: Record this event in the database BEFORE processing it
    // This ensures that even if processing fails, we won't try to process it again
    await (prisma as any).stripeEvent.create({
      data: {
        eventId: event.id,
        type: event.type,
        processedAt: new Date()
      }
    });
    console.log(`✅ Recorded event ${event.id} in database to prevent duplicate processing`);
    
    // Process the event based on its type
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Only process if this is a subscription checkout
        if (session.mode === 'subscription') {
          console.log(`✅ Processing checkout session: ${session.id}`);
          
          // Get the subscription ID from the session
          const subscriptionId = session.subscription as string;
          
          // Retrieve the subscription details
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          
          // CRITICAL: Check if this subscription has already been processed
          // This is our first line of defense against duplicate credits
          if (subscription.metadata.processedViaCheckout === 'true') {
            console.log(`⚠️ DUPLICATE PREVENTION: Subscription ${subscriptionId} already processed via checkout, skipping`);
            return NextResponse.json({ received: true, status: 'already_processed_subscription' });
          }
          
          // Add metadata to mark this subscription as processed via checkout
          await stripe.subscriptions.update(subscriptionId, {
            metadata: {
              ...subscription.metadata,
              processedViaCheckout: 'true',
              processedAt: new Date().toISOString()
            }
          });
          console.log(`✅ Added processedViaCheckout flag to subscription ${subscriptionId}`);
          
          // Process the subscription - THIS WILL ADD EXACTLY 30 CREDITS
          console.log(`🔴 CRITICAL: ADDING EXACTLY 30 CREDITS (NOT 60) FOR SUBSCRIPTION ${subscriptionId}`);
          
          // ENSURE CREDITS ARE ADDED - Force add 30 credits directly here
          try {
            const user = await prisma.user.findFirst({
              where: { stripeCustomerId: subscription.customer as string },
            });
            
            if (user) {
              // CRITICAL: Hard-code exactly 30 credits - NEVER MORE, NEVER LESS
              const EXACT_CREDITS_TO_ADD = 30;
              
              // DIRECT DATABASE UPDATE - Do not rely on addCredits function
              await prisma.user.update({
                where: { id: user.id },
                data: {
                  credits: {
                    increment: EXACT_CREDITS_TO_ADD
                  }
                }
              });
              
              console.log(`✅ FORCE ADDED ${EXACT_CREDITS_TO_ADD} credits to user ${user.clerkId} via DIRECT DATABASE UPDATE`);
              
              // Verify the credits were added
              const verifiedUser = await prisma.user.findUnique({
                where: { id: user.id }
              });
              
              console.log(`✅ VERIFICATION: User now has ${verifiedUser?.credits} credits`);
              
              // CRITICAL: Make sure the tierId is set correctly in the subscription
              // Get the tierId from the checkout session metadata
              const tierId = session.metadata?.tierId || 'pro'; // Default to 'pro' if not found
              
              // Also mark this in the database
              await prisma.subscription.updateMany({
                where: { stripeSubscriptionId: subscription.id },
                data: {
                  ...(({
                    lastCreditAddedAt: new Date(),
                    lastPeriodStart: new Date(subscription.current_period_start * 1000).toISOString(),
                    tierId: tierId, // CRITICAL: Set the tierId correctly
                    status: 'active' // Ensure status is set to active
                  } as any))
                }
              });
              
              console.log(`✅ Updated subscription with tierId: ${tierId}`);
            } else {
              console.error(`❌ ERROR: Could not find user with Stripe customer ID: ${subscription.customer}`);
            }
          } catch (error) {
            console.error('❌ Error directly adding credits:', error);
          }
          
          // STILL call the handler for database updates, but DON'T rely on it for credits
          try {
            await handleSubscriptionChange(subscription);
          } catch (error) {
            console.error('❌ Error in handleSubscriptionChange:', error);
            // Don't fail completely if this errors
          }
          
          console.log(`✅ Successfully processed checkout session: ${session.id}`);
        }
        break;
        
      case 'customer.subscription.created':
        const createdSubscription = event.data.object as Stripe.Subscription;
        
        // Check if this subscription was already processed via checkout
        if (createdSubscription.metadata.processedViaCheckout === 'true') {
          console.log(`⚠️ DUPLICATE PREVENTION: Subscription ${createdSubscription.id} already processed via checkout, skipping`);
          return NextResponse.json({ received: true, status: 'already_processed_subscription' });
        } else {
          console.log(`✅ Processing new subscription: ${createdSubscription.id}`);
          
          // Mark as processed before handling to prevent double processing
          await stripe.subscriptions.update(createdSubscription.id, {
            metadata: {
              ...createdSubscription.metadata,
              processedViaCheckout: 'true',
              processedAt: new Date().toISOString()
            }
          });
          
          await handleSubscriptionChange(createdSubscription);
        }
        break;
        
      case 'customer.subscription.updated':
        const updatedSubscription = event.data.object as Stripe.Subscription;
        console.log(`✅ Processing subscription update: ${updatedSubscription.id}`);
        
        // For subscription updates, we only care about renewals
        // Check if this is a renewal by comparing current_period_start with previous value
        const isRenewal = updatedSubscription.current_period_start > updatedSubscription.created;
        
        if (isRenewal) {
          console.log(`✅ This appears to be a renewal for subscription ${updatedSubscription.id}`);
          
          // Check if we've already processed this period
          const lastPeriodStart = updatedSubscription.metadata.lastProcessedPeriodStart;
          const currentPeriodStart = new Date(updatedSubscription.current_period_start * 1000).toISOString();
          
          if (lastPeriodStart === currentPeriodStart) {
            console.log(`⚠️ DUPLICATE PREVENTION: Already processed this renewal period, skipping`);
            return NextResponse.json({ received: true, status: 'already_processed_period' });
          }
          
          // Mark this period as processed
          await stripe.subscriptions.update(updatedSubscription.id, {
            metadata: {
              ...updatedSubscription.metadata,
              lastProcessedPeriodStart: currentPeriodStart,
              lastProcessedAt: new Date().toISOString()
            }
          });
        }
        
        await handleSubscriptionChange(updatedSubscription);
        break;
        
      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object as Stripe.Subscription;
        console.log(`✅ Processing subscription deletion: ${deletedSubscription.id}`);
        await handleSubscriptionChange(deletedSubscription);
        break;
        
      default:
        console.log(`⚠️ Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error(`❌ Error processing webhook: ${error.message}`);
    return NextResponse.json(
      { error: `Webhook error: ${error.message}` },
      { status: 500 }
    );
  }
}

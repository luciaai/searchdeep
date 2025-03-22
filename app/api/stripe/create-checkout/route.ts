import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createCheckoutSession } from '@/lib/payments/stripe';

// Prevent static generation for this route
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // Get the authenticated user
    const session = await auth();
    const userId = session?.userId;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse the request body
    const body = await req.json();
    const { tierId } = body;
    
    if (!tierId) {
      return NextResponse.json(
        { error: 'Missing tierId in request body' },
        { status: 400 }
      );
    }

    // Create a checkout session
    const { url } = await createCheckoutSession(tierId, userId);
    
    return NextResponse.json({ url });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

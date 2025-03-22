import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createCustomerPortalSession } from '@/lib/payments/stripe';

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

    // Create a customer portal session
    const { url } = await createCustomerPortalSession(userId);
    
    return NextResponse.json({ url });
  } catch (error: any) {
    console.error('Error creating customer portal session:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create customer portal session' },
      { status: 500 }
    );
  }
}

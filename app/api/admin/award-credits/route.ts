import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin';
import prisma from '@/lib/prisma';

// Prevent static generation for this route
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    // Check if user is admin
    const adminCheck = await isAdmin();
    if (!adminCheck) {
      return new NextResponse(JSON.stringify({ error: 'Forbidden' }), { 
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Parse the request body
    const body = await request.json();
    const { userId, amount, reason, feedbackId } = body;

    console.log('Admin Award Credits API: Processing request', { userId, amount, reason, feedbackId });

    if (!userId) {
      return new NextResponse(JSON.stringify({ error: 'User ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (typeof amount !== 'number' || amount === 0) {
      return new NextResponse(JSON.stringify({ error: 'Valid amount is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!reason) {
      return new NextResponse(JSON.stringify({ error: 'Reason is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return new NextResponse(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Update user credits
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        credits: {
          increment: amount
        },
        lastManualCreditAddition: new Date()
      }
    });

    console.log(`Admin Award Credits API: Updated user ${userId} credits to ${updatedUser.credits}`);

    // Create credit history record
    try {
      // Check if the CreditHistory model exists by checking if it's accessible on the prisma client
      if ('creditHistory' in prisma) {
        try {
          const creditHistory = await (prisma as any).creditHistory.create({
            data: {
              userId,
              amount,
              reason,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          });
          
          console.log('Admin Award Credits API: Created credit history record', creditHistory.id);
        } catch (createError) {
          console.error('Error creating credit history record:', createError);
          // Continue even if credit history creation fails
        }
      } else {
        console.log('Admin Award Credits API: CreditHistory model not found in Prisma client, skipping history creation');
      }
    } catch (historyError) {
      console.error('Error accessing credit history functionality:', historyError);
      // Continue even if credit history creation fails
      // This will happen until the schema is updated and deployed
    }

    // If this is for feedback, mark the feedback as rewarded
    if (feedbackId) {
      try {
        await prisma.feedback.update({
          where: { id: feedbackId },
          data: {
            isReward: true,
            status: 'resolved'
          }
        });
        
        console.log(`Admin Award Credits API: Marked feedback ${feedbackId} as rewarded`);
      } catch (feedbackError) {
        console.error('Error updating feedback:', feedbackError);
        // Continue even if feedback update fails
      }
    }

    return new NextResponse(JSON.stringify({ 
      success: true,
      user: {
        id: updatedUser.id,
        credits: updatedUser.credits
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in admin award credits API:', error);
    
    return new NextResponse(JSON.stringify({ 
      error: 'Failed to award credits'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

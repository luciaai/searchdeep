import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin';
import prisma from '@/lib/prisma';

// Prevent static generation for this route
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Check if user is admin
    const adminCheck = await isAdmin();
    if (!adminCheck) {
      return new NextResponse(JSON.stringify({ error: 'Forbidden' }), { 
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Fetch all users from the database
    console.log('Admin Users API: Fetching users from database');
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        clerkId: true,
        email: true,
        firstName: true,
        lastName: true,
        credits: true,
        createdAt: true,
        updatedAt: true,
        stripeCustomerId: true,
        stripeSubscriptionId: true,
        stripeSubscriptionStatus: true,
        tierId: true,
        lastManualCreditAddition: true
      }
    });
    
    console.log(`Admin Users API: Found ${users.length} users in database`);
    
    // Return the users
    return new NextResponse(JSON.stringify({ 
      users: users 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in admin users API:', error);
    
    return new NextResponse(JSON.stringify({ 
      error: 'Failed to fetch users',
      users: []
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin';

// Prevent static generation for this route
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Check if the current user is an admin
    const adminStatus = await isAdmin();
    
    // Return the admin status
    return new NextResponse(JSON.stringify({ 
      isAdmin: adminStatus 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in admin check API:', error);
    
    return new NextResponse(JSON.stringify({ 
      error: 'Failed to check admin status',
      isAdmin: false
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

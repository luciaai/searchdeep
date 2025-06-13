import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { isAdmin } from '@/lib/admin';

// Prevent static generation for this route
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.userId;
    
    if (!userId) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Check if user is admin
    const adminCheck = await isAdmin();
    if (!adminCheck) {
      return new NextResponse(JSON.stringify({ error: 'Forbidden' }), { 
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Get all users with admin role
    // For now, we'll read from the hardcoded list in the admin.ts file
    // In a real application, you might want to store this in the database
    
    // Import the admin emails list from the module
    const adminModule = await import('@/lib/admin');
    const adminEmails = (adminModule as any).ADMIN_EMAILS || [];
    
    console.log('Admin List API: Found', adminEmails.length, 'admin emails');
    
    return new NextResponse(JSON.stringify({ admins: adminEmails }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0'
      }
    });
  } catch (error) {
    console.error('Error in admin list API:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

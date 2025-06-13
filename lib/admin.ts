import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

// List of admin emails - add your email here
const ADMIN_EMAILS = [
  'admin@searchdeep.ai',
  'lucia@searchdeep.ai',
  'lucia.walker@searchdeep.ai',
  'luciawalker@gmail.com',
  'esawalk@gmail.com'
];

/**
 * Server-side function to check if the current user is an admin
 * This is used by API routes that require admin privileges
 */
export async function isAdmin(): Promise<boolean> {
  try {
    // Get the current user from Clerk
    const session = await auth();
    const userId = session?.userId;
    
    // If no user is logged in, they're not an admin
    if (!userId) {
      console.log('Admin check: No user logged in');
      return false;
    }
    
    // Find the user in our database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { email: true }
    });
    
    if (!user || !user.email) {
      console.log(`Admin check: User ${userId} not found or has no email`);
      return false;
    }
    
    // Check if the user's email is in the admin list
    const isUserAdmin = ADMIN_EMAILS.includes(user.email);
    console.log(`Admin check: User ${userId} with email ${user.email} is admin: ${isUserAdmin}`);
    
    return isUserAdmin;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

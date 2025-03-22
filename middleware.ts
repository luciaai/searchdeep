import { clerkMiddleware } from '@clerk/nextjs/server';

// This example protects all routes including api/trpc routes
// Make sure to include the clerkMiddleware() call without options
// to ensure Clerk's auth() function works properly
export default clerkMiddleware();

export const config = {
  // Protects all routes except Next.js internals and static files
  matcher: ['/((?!_next|.*\\..*).*)'],
};
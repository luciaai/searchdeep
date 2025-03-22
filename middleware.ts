import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This example protects all routes including api/trpc routes
export default clerkMiddleware();

export const config = {
  // Protects all routes except Next.js internals and static files
  matcher: ['/((?!_next|.*\\..*).*)'],
};
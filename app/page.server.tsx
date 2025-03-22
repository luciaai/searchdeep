import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

// This is a server component that handles authentication
export async function checkAuth() {
  const { userId } = await auth();
  
  // If not authenticated, redirect to sign-in
  if (!userId) {
    redirect('/sign-in');
  }
  
  return { userId };
}

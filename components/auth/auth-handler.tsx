'use client';

import { useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';

/**
 * AuthHandler component
 * 
 * This component handles authentication state changes and syncs the Clerk user ID
 * with localStorage to ensure consistent authentication across the application.
 */
export function AuthHandler() {
  const { userId, isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;

    // When auth state changes, update localStorage
    if (isSignedIn && userId) {
      // Store the Clerk user ID in localStorage
      localStorage.setItem('clerk_user_id', userId);
    } else {
      // If user is signed out, clear the stored ID
      localStorage.removeItem('clerk_user_id');
    }
  }, [isLoaded, isSignedIn, userId]);

  // This component doesn't render anything
  return null;
}

export default AuthHandler;

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

/**
 * Temporary feedback page replacement
 * 
 * This component simply redirects users to the home page with a message
 * explaining that the feedback system is temporarily unavailable.
 * 
 * This is a temporary solution until we can fix the feedback system's
 * file system access issues in the production environment.
 */
export default function FeedbackPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Show a message explaining that feedback is temporarily unavailable and beta program info
    toast.info(
      <div>
        Feedback system is temporarily unavailable. To provide feedback or join the beta program, please email{' '}
        <a href="mailto:ziqsearch@gmail.com" className="underline font-medium">
          ziqsearch@gmail.com
        </a>
      </div>
    );
    
    // Redirect to home page after a short delay
    const redirectTimer = setTimeout(() => {
      router.push('/');
    }, 1500);
    
    return () => clearTimeout(redirectTimer);
  }, [router]);
  
  // Return an empty div as we're redirecting anyway
  return <div className="min-h-screen" />;
}

'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

/**
 * EmailVerificationPrompt component
 * 
 * This component checks if a user has an email address and prompts them to add one if they don't.
 * It's designed to be included in layout components to gently encourage users to verify their email
 * without disrupting their experience.
 */
export function EmailVerificationPrompt() {
  const { user, isLoaded } = useUser();
  const [showPrompt, setShowPrompt] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    // Only check once the user data is loaded and we haven't checked yet
    if (isLoaded && user && !hasChecked) {
      const primaryEmail = user.primaryEmailAddress;
      
      // If the user doesn't have a primary email address, show the prompt
      if (!primaryEmail) {
        setShowPrompt(true);
      }
      
      setHasChecked(true);
    }
  }, [isLoaded, user, hasChecked]);

  const handleAddEmail = () => {
    // Redirect to the Clerk user profile page for email management
    window.location.href = '/user/profile';
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Store in localStorage that the user has dismissed the prompt
    // This prevents showing it on every page load
    localStorage.setItem('email_prompt_dismissed', 'true');
    
    // But we'll show it again after 7 days
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);
    localStorage.setItem('email_prompt_dismissed_until', expiryDate.toISOString());
  };

  // Don't render anything if not needed
  if (!showPrompt || !isLoaded || !user) {
    return null;
  }

  // Check if the user has dismissed the prompt recently
  const dismissedUntil = localStorage.getItem('email_prompt_dismissed_until');
  if (dismissedUntil && new Date(dismissedUntil) > new Date()) {
    return null;
  }

  return (
    <Dialog open={showPrompt} onOpenChange={setShowPrompt}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Verify your email address</DialogTitle>
          <DialogDescription>
            Adding an email address to your account helps with account recovery and keeps you updated on important information.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Your email address will only be used for account-related communications and will never be shared with third parties.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleDismiss}>
            Remind me later
          </Button>
          <Button onClick={handleAddEmail}>
            Add email address
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EmailVerificationPrompt;

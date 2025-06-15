'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function FeedbackPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Show toast message and redirect to home page
    toast.info('Feedback is temporarily unavailable. Please email feedback to ziqsearch@gmail.com');
    router.push('/');
  }, [router]);
  
  // Return null to prevent any flash of content
  return null;
}

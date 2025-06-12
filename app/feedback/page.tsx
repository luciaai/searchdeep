'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import StarRating from '@/components/star-rating';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function FeedbackPage() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const router = useRouter();
  
  // Always proceed with the form regardless of auth state
  // This allows both authenticated and anonymous feedback
  useEffect(() => {
    if (isLoaded && isSignedIn && userId) {
      // If user is signed in, ensure their ID is stored in localStorage
      localStorage.setItem('clerk_user_id', userId);
    }
  }, [isLoaded, isSignedIn, userId]);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [feedbackType, setFeedbackType] = useState('general');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [activeTab, setActiveTab] = useState('feedback');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate based on active tab
    if (activeTab === 'feedback') {
      if (!message.trim()) {
        toast.error('Please enter your feedback message');
        return;
      }
      if (!feedbackType) {
        toast.error('Please select a feedback type');
        return;
      }
    }
    
    if (activeTab === 'review') {
      if (rating === 0) {
        toast.error('Please select a rating');
        return;
      }
      if (!review.trim()) {
        toast.error('Please enter your review');
        return;
      }
      if (!feedbackType) {
        toast.error('Please select a feedback type');
        return;
      }
    }
    
    try {
      setIsSubmitting(true);
      
      // Ensure we have authentication if the user is signed in
      if (isSignedIn && userId) {
        localStorage.setItem('clerk_user_id', userId);
      }
      
      console.log('Submitting form with data:', {
        activeTab,
        feedbackType,
        hasMessage: !!message,
        hasSubject: !!subject,
        rating,
        hasReview: !!review,
        isAuthenticated: isSignedIn
      });
      
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          type: feedbackType,
          message: activeTab === 'feedback' ? message : '',
          subject: activeTab === 'feedback' ? subject : 'App Review',
          rating: activeTab === 'review' ? rating : null,
          review: activeTab === 'review' ? review : '',
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Feedback submission failed:', data);
        throw new Error(data.error || data.details || 'Failed to submit feedback');
      }
      
      console.log('Feedback submitted successfully:', data);
      
      toast.success(activeTab === 'review' ? 'Thank you for your review!' : 'Thank you for your feedback!');
      setMessage('');
      setReview('');
      setRating(0);
      setFeedbackType('general');
      
      // Optionally redirect after successful submission
      // router.push('/');
      
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit feedback. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Show loading state only while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl flex justify-center items-center">
        <div className="animate-pulse text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500 dark:from-blue-400 dark:to-teal-300 pt-2">
          We Value Your Feedback
        </h1>
        <p className="text-muted-foreground mt-2 text-center max-w-2xl">
          Your feedback helps us improve Ziq. Let us know what you think about the app, features you'd like to see, or any issues you've encountered.
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="feedback">Send Feedback</TabsTrigger>
            <TabsTrigger value="review">Rate & Review</TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {!isSignedIn && (
            <>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Name (optional)
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email (optional)
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                />
              </div>
            </>
          )}
          
          {activeTab === 'feedback' && (
            <>
              <div className="mb-4">
                <label htmlFor="subject" className="block text-sm font-medium mb-1">
                  Subject
                </label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subject of your feedback"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="feedback-type" className="block text-sm font-medium mb-1">
                  Feedback Type
                </label>
                <Select value={feedbackType} onValueChange={setFeedbackType}>
                  <SelectTrigger id="feedback-type" className="w-full">
                    <SelectValue placeholder="Select feedback type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Feedback</SelectItem>
                    <SelectItem value="bug">Bug Report</SelectItem>
                    <SelectItem value="feature">Feature Request</SelectItem>
                    <SelectItem value="question">Question</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Your Feedback
                </label>
                <Textarea
                  id="message"
                  placeholder="Please share your thoughts, suggestions, or report any issues..."
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required={activeTab === 'feedback'}
                  className="resize-none"
                />
              </div>
            </>
          )}

          {activeTab === 'review' && (
            <>
              <div className="mb-6">
                <label htmlFor="rating" className="block text-sm font-medium mb-3">
                  Rate Ziq (1-5 stars)
                </label>
                <StarRating rating={rating} setRating={setRating} />
                {rating === 0 && (
                  <p className="text-sm text-red-500 mt-2">Please select a rating</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="review" className="text-sm font-medium">
                  Your Review
                </label>
                <Textarea
                  id="review"
                  placeholder="Tell us what you like about Ziq or how we could improve..."
                  rows={6}
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  required={activeTab === 'review'}
                  className="resize-none"
                />
              </div>
            </>
          )}
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting || (activeTab === 'review' && rating === 0)}
          >
            {isSubmitting ? 'Submitting...' : activeTab === 'review' ? 'Submit Review' : 'Submit Feedback'}
          </Button>
        </form>
        </Tabs>
      </div>
    </div>
  );
}

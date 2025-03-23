"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SignedIn, SignedOut, SignInButton, useAuth } from '@clerk/nextjs';
import { tiers } from '@/lib/tiers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Coins, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getUserCredits, getUserSubscription } from '@/lib/user-credits';

// Component that uses searchParams
function PricingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoaded, isSignedIn } = useAuth();
  const [userCredits, setUserCredits] = useState<number | null>(null);
  const [userSubscription, setUserSubscription] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Check for success or canceled query parameters
  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      toast.success('Subscription successful!', {
        description: 'Your subscription has been processed successfully.',
      });
    } else if (searchParams.get('canceled') === 'true') {
      toast.error('Subscription canceled', {
        description: 'Your subscription process was canceled.',
      });
    }
  }, [searchParams]);

  // Fetch user credits and subscription
  useEffect(() => {
    async function fetchUserData() {
      if (isSignedIn) {
        try {
          setIsLoading(true);
          // Fetch user credits
          const creditsResponse = await fetch('/api/credits');
          const creditsData = await creditsResponse.json();
          setUserCredits(creditsData.credits);

          // Fetch user subscription
          const subscriptionResponse = await fetch('/api/subscription');
          const subscriptionData = await subscriptionResponse.json();
          setUserSubscription(subscriptionData.subscription);
        } catch (error) {
          console.error('Error fetching user data:', error);
          toast.error('Failed to load user data');
        } finally {
          setIsLoading(false);
        }
      } else if (isLoaded) {
        setIsLoading(false);
      }
    }

    fetchUserData();
  }, [isSignedIn, isLoaded]);

  // Handle subscription checkout
  const handleSubscribe = async (tierId: string) => {
    if (!isSignedIn) {
      toast.error('Please sign in to subscribe');
      return;
    }

    try {
      setIsProcessing(true);
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tierId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe checkout
      window.location.href = data.url;
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      toast.error('Failed to start subscription process', {
        description: error.message,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle customer portal for managing subscription
  const handleManageSubscription = async () => {
    try {
      setIsProcessing(true);
      const response = await fetch('/api/stripe/create-portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create customer portal session');
      }

      // Redirect to Stripe customer portal
      window.location.href = data.url;
    } catch (error: any) {
      console.error('Error creating customer portal session:', error);
      toast.error('Failed to open subscription management', {
        description: error.message,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Check if user has an active subscription for a specific tier
  const hasActiveTier = (tierId: string) => {
    return userSubscription && 
           userSubscription.status === 'active' && 
           userSubscription.tierId === tierId;
  };

  return (
    <div className="container max-w-6xl py-12 mt-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Pricing Plans</h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
          Choose the perfect plan for your research needs. All plans include access to our powerful AI search engine.
        </p>
        
        {isSignedIn && !isLoading && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <Coins className="h-5 w-5 text-yellow-500" />
            <span className="font-medium">
              You have {userCredits !== null ? userCredits : '...'} credits remaining
            </span>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading pricing information...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <Card 
              key={tier.id}
              className={`flex flex-col ${
                tier.id === 'pro' ? 'border-primary/50 shadow-lg' : ''
              }`}
            >
              <CardHeader>
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <CardDescription>
                  {tier.description || `${tier.credits} credits per month`}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="mb-4">
                  <span className="text-3xl font-bold">${tier.price}</span>
                  <span className="text-neutral-600 dark:text-neutral-400">/month</span>
                </div>
                <ul className="space-y-2">
                  {tier.features?.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <SignedIn>
                  {hasActiveTier(tier.id) ? (
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={handleManageSubscription}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Manage Subscription'
                      )}
                    </Button>
                  ) : (
                    <Button 
                      className="w-full" 
                      onClick={() => handleSubscribe(tier.id)}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Subscribe'
                      )}
                    </Button>
                  )}
                </SignedIn>
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button className="w-full">
                      Sign in to Subscribe
                    </Button>
                  </SignInButton>
                </SignedOut>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// Main page component with Suspense boundary
export default function PricingPage() {
  return (
    <Suspense fallback={
      <div className="container max-w-6xl py-12">
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading pricing information...</span>
        </div>
      </div>
    }>
      <PricingContent />
    </Suspense>
  );
}

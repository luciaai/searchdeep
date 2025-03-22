"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getUserCredits } from '@/lib/user-credits';
import { useEffect, useState } from 'react';
import { Coins } from 'lucide-react';

export function NavBar() {
  const pathname = usePathname();
  const [credits, setCredits] = useState<number | null>(null);
  
  useEffect(() => {
    async function fetchCredits() {
      try {
        const response = await fetch('/api/credits');
        const data = await response.json();
        setCredits(data.credits);
      } catch (error) {
        console.error('Error fetching credits:', error);
      }
    }

    // Only fetch credits if user is signed in
    const hasClerkSession = document.cookie.includes('__clerk_session');
    if (hasClerkSession) {
      fetchCredits();
    }
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-sm">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">Ziq</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-4">
            <Link
              href="/"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/" ? "text-primary" : "text-neutral-600 dark:text-neutral-400"
              )}
            >
              Home
            </Link>
            <Link
              href="/pricing"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/pricing" ? "text-primary" : "text-neutral-600 dark:text-neutral-400"
              )}
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/about" ? "text-primary" : "text-neutral-600 dark:text-neutral-400"
              )}
            >
              About
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <SignedIn>
              {credits !== null && (
                <div className="flex items-center text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  <Coins className="h-4 w-4 mr-1" />
                  <span>{credits} credits</span>
                </div>
              )}
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="sm">
                  Sign Up
                </Button>
              </SignUpButton>
            </SignedOut>
          </div>
        </div>
      </div>
    </header>
  );
}

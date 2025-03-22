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

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'History', href: '/history' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'About', href: '/about' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">Ziq</span>
          </Link>
        </div>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === item.href ? "text-foreground" : "text-foreground/60"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="flex-1" />
        <div className="flex items-center space-x-4">
          <SignedIn>
            {credits !== null && (
              <div className="flex items-center mr-2">
                <Coins className="h-4 w-4 mr-1 text-yellow-500" />
                <span className="text-sm font-medium">{credits}</span>
              </div>
            )}
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm">
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
    </header>
  );
}

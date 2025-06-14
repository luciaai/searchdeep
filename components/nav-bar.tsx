"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getUserCredits } from '@/lib/user-credits';
import { useEffect, useState } from 'react';
import { Coins, CreditCard, HelpCircle, History, Info, Menu, MessageSquare, Plus, Settings, Shield, ShieldAlert } from 'lucide-react';
// Temporarily removing feedback modal import to fix build issues
// import { FeedbackModal } from './feedback-modal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from '@/components/theme-toggle';
import { toast } from 'sonner';

export function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userCredits, setUserCredits] = useState<number | null>(null);
  const [isLoadingCredits, setIsLoadingCredits] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  // Temporarily removed feedback modal state
  // const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  
  // Function to get the user ID from localStorage or cookies
  const getUserId = () => {
    if (typeof window === 'undefined') return null;
    
    // Try to get from localStorage first
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      console.log('Found userId in localStorage:', storedUserId);
      return storedUserId;
    }
    
    // Try to get from cookies
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'userId') {
        console.log('Found userId in cookies:', value);
        return value;
      }
    }
    
    return null;
  };
  
  useEffect(() => {
    async function fetchCredits() {
      try {
        setIsLoadingCredits(true);
        console.log("Fetching credits...");
        
        // Get the user ID
        const userId = getUserId();
        
        // Prepare headers with authentication if we have a user ID
        const headers: HeadersInit = {};
        if (userId) {
          headers['Authorization'] = `Bearer ${userId}`;
        }
        
        const response = await fetch('/api/credits', { headers });
        const data = await response.json();
        console.log("Credits API response:", data);
        
        // Set credits directly
        setUserCredits(data.credits);
        console.log("Set userCredits to:", data.credits);
        
        // Check if user is admin
        if (data.isAdmin) {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error('Error fetching credits:', error);
      } finally {
        setIsLoadingCredits(false);
      }
    }

    fetchCredits();
    const interval = setInterval(fetchCredits, 5000);
    return () => clearInterval(interval);
  }, []);

  const AboutButton = () => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full w-8 h-8 bg-background dark:bg-muted border-border dark:border-muted hover:bg-muted/50 dark:hover:bg-muted/80 transition-all"
          >
            <Menu className="h-5 w-5 text-foreground/70 dark:text-foreground/70" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[180px] mt-1" sideOffset={8}>
          <DropdownMenuItem asChild>
            <Link href="/history" className="flex items-center cursor-pointer">
              <History className="mr-2 h-4 w-4" />
              <span>Search History</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/pricing" className="flex items-center cursor-pointer">
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Pricing</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/faq" className="flex items-center cursor-pointer">
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>FAQ</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/about" className="flex items-center cursor-pointer">
              <Info className="mr-2 h-4 w-4" />
              <span>About</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-[60] flex justify-between items-center px-6 py-4 h-[72px]",
        "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40",
        "animate-gradient-background"
      )}
    >
      {/* Left section - no logo, only buttons */}
      <div className="flex items-center">
        <div className="flex space-x-2 relative z-[70]">
          <Button
            type="button"
            variant={"default"}
            className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground backdrop-blur-sm group transition-all hover:scale-105 pointer-events-auto flex items-center transition-all duration-300 shadow-sm"
            onClick={() => {
              // Clear any localStorage state that might be persisting search data
              localStorage.removeItem('lastQuery');
              localStorage.removeItem('lastMessages');
              localStorage.removeItem('searchState');
              
              // Use a client-side approach to reset the application state
              if (pathname === '/') {
                // Create a custom event to notify the page to reset its state
                const resetEvent = new CustomEvent('resetSearch', { detail: { timestamp: Date.now() } });
                window.dispatchEvent(resetEvent);
                
                // Use router.refresh() to update the page without a full reload
                router.refresh();
              } else {
                // If we're on another page, navigate to home
                router.push('/');
              }
            }}
          >
            <Plus size={18} className="group-hover:rotate-90 transition-all" />
            <span className="text-sm ml-2 md:opacity-0 md:w-0 md:group-hover:opacity-100 md:group-hover:w-auto overflow-hidden transition-all duration-300 font-medium">
              New
            </span>
          </Button>
          
          <Button
            type="button"
            variant={"outline"}
            className="rounded-full bg-background hover:bg-muted/50 text-foreground backdrop-blur-sm group transition-all hover:scale-105 pointer-events-auto flex items-center transition-all duration-300 shadow-sm"
            onClick={() => router.push('/faq')}
          >
            <HelpCircle size={18} className="transition-all" />
            <span className="text-sm ml-2 opacity-0 group-hover:opacity-100 w-0 group-hover:w-auto overflow-hidden transition-all duration-300 font-medium">
              FAQ
            </span>
          </Button>
          
          <Button
            type="button"
            variant={"outline"}
            className="rounded-full bg-background hover:bg-muted/50 text-foreground backdrop-blur-sm group transition-all hover:scale-105 pointer-events-auto flex items-center transition-all duration-300 shadow-sm"
            onClick={() => {
              toast.info('Feedback is temporarily unavailable. Please email feedback to ziqsearch@gmail.com');
            }}
          >
            <MessageSquare size={18} className="transition-all" />
            <span className="text-sm ml-2 opacity-0 group-hover:opacity-100 w-0 group-hover:w-auto overflow-hidden transition-all duration-300 font-medium">
              Feedback
            </span>
          </Button>
        </div>
      </div>

      {/* Empty div to maintain layout balance */}
      <div className="absolute left-1/2 transform -translate-x-1/2 font-semibold text-lg items-center z-50 hidden">
      </div>

      <div className="flex items-center space-x-4">
        <SignedIn>
          {/* Credits display */}
          <div className="px-3 py-1.5 bg-primary/10 dark:bg-primary/20 rounded-full text-sm flex items-center mr-2 border border-primary/20 dark:border-primary/30 transition-all hover:bg-primary/15 dark:hover:bg-primary/25">
            <Coins className="h-3.5 w-3.5 mr-1.5 text-primary" />
            <span className="font-medium text-primary">
              {isLoadingCredits ? '...' : userCredits !== null ? userCredits : '0'}
            </span>
          </div>
          
          {/* User menu dropdown */}
          
          {/* Admin dashboard access - conditionally rendered */}
          {isAdmin && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full mr-2"
              onClick={() => router.push('/admin')}
            >
              <Shield className="mr-2 h-4 w-4" />
            </Button>
          )}
          
          
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="rounded-md hover:bg-primary/10 text-primary font-medium transition-all"
            >
              Sign In
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button
              type="button"
              variant="default"
              size="sm"
              className="rounded-md bg-primary hover:bg-primary/90 text-primary-foreground ml-2 font-medium transition-all"
            >
              Sign Up
            </Button>
          </SignUpButton>
        </SignedOut>
        <AboutButton />
        <ThemeToggle />
      </div>

      {/* Feedback Modal temporarily removed to fix build issues */}

      <style jsx global>{`
        @keyframes gradient-animation {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        .animate-gradient-background {
          background: linear-gradient(-45deg, hsl(var(--background)), hsl(var(--background)), hsl(var(--muted)), hsl(var(--background)));
          background-size: 400% 400%;
          animation: gradient-animation 15s ease infinite;
          animation-delay: 0.2s; /* slight delay to ensure initial render */
        }
        
        .dark .animate-gradient-background {
          background: linear-gradient(-45deg, #2a1a3a, #1a2a3a, #2a2a1a, #1a2a1a);
          background-size: 400% 400%;
          animation: gradient-animation 15s ease infinite;
          animation-delay: 0.2s;
        }
      `}</style>
    </div>
  );
}

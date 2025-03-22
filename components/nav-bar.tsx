"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getUserCredits } from '@/lib/user-credits';
import { useEffect, useState } from 'react';
import { Coins, CreditCard, History, Info, Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from '@/components/theme-toggle';

export function NavBar() {
  const pathname = usePathname();
  const [userCredits, setUserCredits] = useState<number | null>(null);
  const [isLoadingCredits, setIsLoadingCredits] = useState(true);
  
  useEffect(() => {
    async function fetchCredits() {
      try {
        setIsLoadingCredits(true);
        console.log("Fetching credits...");
        const response = await fetch('/api/credits');
        const data = await response.json();
        console.log("Credits API response:", data);
        
        // Set credits directly
        setUserCredits(data.credits);
        console.log("Set userCredits to:", data.credits);
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
            className="rounded-full w-8 h-8 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
          >
            <Info className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[180px] mt-1" sideOffset={8}>
          <DropdownMenuItem asChild>
            <Link href="/history" className="flex items-center cursor-pointer">
              <History className="mr-2 h-4 w-4" />
              <span>History</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/pricing" className="flex items-center cursor-pointer">
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Pricing</span>
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
        "fixed top-0 left-0 right-0 z-[60] flex justify-between items-center p-4 h-[72px]",
        "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "animate-gradient-background"
      )}
    >
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button
            type="button"
            variant={"secondary"}
            className="rounded-full bg-accent hover:bg-accent/80 backdrop-blur-sm group transition-all hover:scale-105 pointer-events-auto"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-all" />
            <span className="text-sm ml-2 group-hover:block hidden animate-in fade-in duration-300">
              New
            </span>
          </Button>
        </Link>
      </div>

      {/* Logo positioned further to the right on mobile; centered on larger screens */}
      <div className="absolute left-1/2 transform -translate-x-1/2 font-semibold text-lg flex items-center z-50">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Logo"
            width={80}
            height={80}
            className="mr-1 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16"
          />
        </Link>
      </div>

      <div className="flex items-center space-x-6">
        <SignedIn>
          {/* Credits display */}
          <div className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-full text-sm flex items-center mr-2">
            <Coins className="h-3.5 w-3.5 mr-1.5 text-yellow-500" />
            <span className="font-medium">
             {userCredits !== null ? userCredits : '...'} 
            </span>
          </div>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-md bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 border-blue-500/20"
            >
              Sign In
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-md bg-green-500/10 hover:bg-green-500/20 text-green-500 border-green-500/20 ml-2"
            >
              Sign Up
            </Button>
          </SignUpButton>
        </SignedOut>
        <AboutButton />
        <ThemeToggle />
      </div>

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
          background: linear-gradient(-45deg, #f3e7ff, #e7f5ff, #fff5e7, #e7ffef);
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

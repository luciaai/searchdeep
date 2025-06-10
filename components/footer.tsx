"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();
  
  // Determine if we're on a legal page (privacy or terms)
  const isLegalPage = pathname === '/privacy' || pathname === '/terms';
  
  return (
    <footer className="w-full py-4 px-4 border-t border-slate-200 dark:border-slate-700 mt-auto">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <div className="text-sm text-slate-500 dark:text-slate-400 mb-2 sm:mb-0">
          © {currentYear} Ziq Search. All rights reserved.
        </div>
        <div className="flex space-x-6">
          {/* Show different links based on current page */}
          {!isLegalPage || pathname !== '/privacy' ? (
            <Link 
              href="/privacy" 
              className="text-sm text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
              prefetch={false}
            >
              Privacy Policy
            </Link>
          ) : null}
          
          {!isLegalPage || pathname !== '/terms' ? (
            <Link 
              href="/terms" 
              className="text-sm text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
              prefetch={false}
            >
              Terms of Service
            </Link>
          ) : null}
          
          <Link 
            href="/faq" 
            className="text-sm text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
            prefetch={false}
          >
            FAQ
          </Link>
        </div>
      </div>
    </footer>
  );
}

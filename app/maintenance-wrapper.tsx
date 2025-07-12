"use client";

import { useEffect, useState, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import MaintenancePage from './maintenance/page';

interface MaintenanceWrapperProps {
  children: React.ReactNode;
}

// Inner component that uses searchParams
function MaintenanceContent({ children }: { children: React.ReactNode }) {
  const [showMaintenance, setShowMaintenance] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Skip maintenance mode check if we're already on the maintenance page
    if (pathname === '/maintenance') {
      setShowMaintenance(false);
      setIsLoading(false);
      return;
    }
    
    // TESTING: Force maintenance mode to be active
    // const isDevelopment = process.env.NODE_ENV === 'development';
    const isDevelopment = false; // Force maintenance mode even in development
    
    // Check for bypass in URL parameters
    const bypassParam = searchParams.get('bypass');
    
    // Check for bypass in localStorage
    const bypassStorage = typeof window !== 'undefined' ? localStorage.getItem('maintenance_bypass') : null;
    
    // Show the actual app if:
    // 1. We're in development mode, OR
    // 2. The URL has a bypass parameter, OR
    // 3. There's a bypass token in localStorage
    if (isDevelopment || bypassParam === 'true' || bypassStorage === 'true') {
      setShowMaintenance(false);
    } else {
      setShowMaintenance(true);
    }
    
    setIsLoading(false);
  }, [pathname, searchParams]);
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Show maintenance page or actual content
  return showMaintenance ? <MaintenancePage /> : <>{children}</>;
}

// Wrapper component with Suspense boundary
export default function MaintenanceWrapper({ children }: MaintenanceWrapperProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    }>
      <MaintenanceContent>
        {children}
      </MaintenanceContent>
    </Suspense>
  );
}

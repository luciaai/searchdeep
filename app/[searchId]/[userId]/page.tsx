"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { InstallPrompt } from '@/components/InstallPrompt';

export default function SearchPage({
  params
}: {
  params: { searchId: string; userId: string }
}) {
  const router = useRouter();
  
  // Check for Clerk session
  useEffect(() => {
    // Check if the user is authenticated using Clerk's session cookie
    const hasClerkSession = document.cookie.includes('__clerk_session');
    
    // If no session, redirect to sign-in
    if (!hasClerkSession) {
      router.push('/sign-in');
    }
  }, [router]);
  
  return (
    <>
      <Suspense fallback={<div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>}>
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
          <h1 className="text-2xl font-bold mb-4">Search ID: {params.searchId}</h1>
          <p className="mb-6">User ID: {params.userId}</p>
          <div className="w-full max-w-2xl">
            {/* Main search content will go here */}
            <div className="border rounded-lg p-6 shadow-sm">
              <input 
                type="text" 
                placeholder="What do you want to search for?" 
                className="w-full p-3 border rounded-md mb-4"
              />
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                Search
              </button>
            </div>
          </div>
        </div>
        <InstallPrompt />
      </Suspense>
    </>
  );
}

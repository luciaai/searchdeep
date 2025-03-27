'use client';

import { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { format } from 'date-fns';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface Search {
  id: string;
  query: string;
  groupId: string;
  createdAt: string;
}

export default function HistoryPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [searches, setSearches] = useState<Search[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Redirect to sign-in if not authenticated
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
      return;
    }

    // Fetch search history if authenticated
    if (isLoaded && isSignedIn) {
      fetchSearchHistory();
    }
  }, [isLoaded, isSignedIn, router]);

  const fetchSearchHistory = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/history');
      
      if (!response.ok) {
        throw new Error('Failed to fetch search history');
      }
      
      const data = await response.json();
      setSearches(data.searches);
    } catch (error) {
      console.error('Error fetching search history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get the search group name from the groupId
  const getGroupName = (groupId: string) => {
    const groups: Record<string, string> = {
      'web': 'Web Search',
      'buddy': 'AI Buddy',
      'x': 'X Search',
      // Add other groups as needed
    };
    
    return groups[groupId] || groupId;
  };

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500 dark:from-blue-400 dark:to-teal-300">Your Search History</h1>
        <Button 
          className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white shadow-md hover:shadow-lg transition-all duration-300" 
          onClick={() => router.push('/')}
        >
          Back to Search
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border rounded-lg p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/4 mb-1" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          ))}
        </div>
      ) : searches.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">You haven&apos;t made any searches yet.</p>
          <Button 
            className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white shadow-md hover:shadow-lg transition-all duration-300"
            onClick={() => router.push('/')}
          >
            Start Searching
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="text-left p-4 border-b">Query</th>
                <th className="text-left p-4 border-b">Type</th>
                <th className="text-left p-4 border-b">Date</th>
                <th className="text-left p-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {searches.map((search) => (
                <tr key={search.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-900">
                  <td className="p-4 truncate max-w-xs">{search.query}</td>
                  <td className="p-4">{getGroupName(search.groupId)}</td>
                  <td className="p-4">{format(new Date(search.createdAt), 'MMM d, yyyy h:mm a')}</td>
                  <td className="p-4">
                    <Button 
                      className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white shadow-sm hover:shadow-md transition-all duration-300"
                      size="sm"
                      onClick={() => router.push(`/?q=${encodeURIComponent(search.query)}&groupId=${search.groupId}`)}
                    >
                      Repeat Search
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

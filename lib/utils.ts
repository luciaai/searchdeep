// /lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Globe, Book, YoutubeIcon, Mountain, Brain } from 'lucide-react'
import { ChatsCircle, Code, Memory, XLogo } from '@phosphor-icons/react'
import React from 'react'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 15)}`;
}

export function getUserId(): string {
  if (typeof window === 'undefined') return '';
  
  // First check if we have a Clerk user ID in localStorage
  // This would be set by the AuthHandler component when a user is authenticated
  const clerkUserId = localStorage.getItem('clerk_user_id');
  if (clerkUserId) {
    return `user_${clerkUserId}`;
  }
  
  // Check for Clerk session cookie as a backup
  const hasClerkSession = document.cookie.includes('__clerk_session');
  if (hasClerkSession) {
    // We'll use a combination of the Clerk session ID and our local ID
    const clerkSessionId = document.cookie
      .split('; ')
      .find(row => row.startsWith('__clerk_session'))
      ?.split('=')[1];
      
    if (clerkSessionId) {
      // We'll still maintain our own user ID for backward compatibility
      let localUserId = localStorage.getItem('mem0_user_id');
      if (!localUserId) {
        localUserId = generateId('user');
        localStorage.setItem('mem0_user_id', localUserId);
      }
      
      // Return a combination of both IDs to ensure uniqueness
      return `${localUserId}_clerk_${clerkSessionId.substring(0, 8)}`;
    }
  }
  
  // Fall back to the original implementation if no Clerk session
  let userId = localStorage.getItem('mem0_user_id');
  if (!userId) {
    userId = generateId('user');
    localStorage.setItem('mem0_user_id', userId);
  }
  return userId;
}

export const searchGroups = [
  {
    id: 'web' as const,
    name: 'Web',
    description: 'Search across the entire internet',
    icon: Globe,
    show: true,
  },
  {
    id: 'buddy' as const,
    name: 'Buddy',
    description: 'Your personal memory companion',
    icon: Memory,
    show: true,
  },
  {
    id: 'x' as const,
    name: 'X',
    description: 'Search X posts and content powered by Exa',
    icon: XLogo,
    show: true,
  },
  {
    id: 'analysis' as const,
    name: 'Analysis',
    description: 'Code, stock and currency stuff',
    icon: Code,
    show: true,
  },
  {
    id: 'chat' as const,
    name: 'Chat',
    description: 'Talk to the model directly.',
    icon: ChatsCircle,
    show: true,
  },
  {
    id: 'academic' as const,
    name: 'Academic',
    description: 'Search academic papers powered by Exa',
    icon: Book,
    show: true,
  },
  {
    id: 'youtube' as const,
    name: 'YouTube',
    description: 'Search YouTube videos in real-time powered by Exa',
    icon: YoutubeIcon,
    show: true,
  },
  {
    id: 'extreme' as const,
    name: 'Extreme',
    description: 'Deep research with multiple sources and analysis',
    icon: Mountain,
    show: false,
  },
] as const;

export type SearchGroup = typeof searchGroups[number];
export type SearchGroupId = SearchGroup['id'] | 'all';

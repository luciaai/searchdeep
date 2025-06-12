/**
 * Client-side admin utilities
 */

// Cache for admin status to prevent repeated API calls
let adminStatusCache: { isAdmin: boolean; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Check if the current user is an admin (client-side)
 * Uses caching to prevent repeated API calls
 */
export async function checkAdminStatus(): Promise<boolean> {
  // Return cached result if available and not expired
  if (adminStatusCache && Date.now() - adminStatusCache.timestamp < CACHE_DURATION) {
    console.log('Using cached admin status:', adminStatusCache.isAdmin);
    return adminStatusCache.isAdmin;
  }

  try {
    // Add cache-busting parameter to prevent browser caching
    const timestamp = new Date().getTime();
    const response = await fetch(`/api/admin/check?t=${timestamp}`);
    
    if (!response.ok) {
      throw new Error('Failed to check admin status');
    }
    
    const data = await response.json();
    
    // Cache the result
    adminStatusCache = {
      isAdmin: data.isAdmin,
      timestamp: Date.now()
    };
    
    return data.isAdmin;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

/**
 * Clear the admin status cache
 * Useful when logging out or when admin status might have changed
 */
export function clearAdminCache(): void {
  adminStatusCache = null;
}

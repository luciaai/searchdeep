/**
 * Client-side utility for checking admin status
 * This is used by client components that need to verify admin privileges
 */
export async function checkAdminStatus(): Promise<boolean> {
  try {
    // Add cache-busting query parameter to prevent caching
    const timestamp = new Date().getTime();
    const queryParam = `?t=${timestamp}`;
    
    // Call the admin check API
    const response = await fetch(`/api/admin/check${queryParam}`, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      },
      credentials: 'include'
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.isAdmin === true;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

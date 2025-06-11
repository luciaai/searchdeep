'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import AdminManagement from '@/components/admin-management';
import { checkAdminStatus } from '@/lib/admin-client';

export default function AdminPage() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const router = useRouter();
  
  // State management
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [betaTesters, setBetaTesters] = useState<any[]>([]);
  const [betaTasks, setBetaTasks] = useState<any[]>([]);
  const [creditHistory, setCreditHistory] = useState<any[]>([]);
  const [creditAmount, setCreditAmount] = useState<number>(5);
  const [creditReason, setCreditReason] = useState<string>('Admin award');
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedUserEmail, setSelectedUserEmail] = useState<string>('');
  const [creditAction, setCreditAction] = useState<'add' | 'remove'>('add');
  const [feedbackCreditAmount, setFeedbackCreditAmount] = useState<number>(5);
  const [feedbackFilter, setFeedbackFilter] = useState<string>('all');

  // Define loadTabData with useCallback to prevent recreation on each render
  const loadTabData = useCallback(async () => {
    if (!activeTab || !isAdmin) return;
    
    setIsLoading(true);
    
    try {
      // Add cache-busting query parameter to prevent caching
      const timestamp = new Date().getTime();
      const queryParam = `?t=${timestamp}`;
      
      if (activeTab === 'users') {
        const response = await fetch(`/api/admin/users${queryParam}`);
        
        if (response.ok) {
          const data = await response.json();
          setUsers(data.users || []);
        } else if (response.status === 401 || response.status === 403) {
          setIsAdmin(false);
          toast.error('Admin session expired');
          router.push('/');
          return;
        }
      } else if (activeTab === 'feedback') {
        // Try the public feedback API first - much faster than the admin API
        const response = await fetch(`/api/public/feedback${queryParam}`, {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setFeedback(data.feedback || []);
        } else {
          console.error('Failed to fetch feedback from public API, trying admin API');
          
          // Fall back to the admin API
          try {
            const adminResponse = await fetch(`/api/admin/feedback${queryParam}`, {
              headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-store, must-revalidate'
              },
              credentials: 'include'
            });
            
            if (adminResponse.ok) {
              const adminData = await adminResponse.json();
              setFeedback(adminData.feedback || []);
            } else if (adminResponse.status === 401 || adminResponse.status === 403) {
              setIsAdmin(false);
              toast.error('Admin session expired');
              router.push('/');
              return;
            } else {
              toast.error('Failed to load feedback data');
            }
          } catch (adminError) {
            console.error('Error fetching feedback from admin API:', adminError);
            toast.error('Error loading feedback data');
          }
        }
      } else if (activeTab === 'beta') {
        // Fetch beta testers with optimized caching strategy
        const testersResponse = await fetch(`/api/admin/beta-testers${queryParam}`);
        const tasksResponse = await fetch(`/api/admin/beta-tasks${queryParam}`);
        
        if (testersResponse.ok) {
          const data = await testersResponse.json();
          setBetaTesters(data.betaTesters || []);
        } else if (testersResponse.status === 401 || testersResponse.status === 403) {
          setIsAdmin(false);
          toast.error('Admin session expired');
          router.push('/');
          return;
        }
        
        if (tasksResponse.ok) {
          const data = await tasksResponse.json();
          setBetaTasks(data.betaTasks || []);
        }
      } else if (activeTab === 'credits') {
        // Fetch credit history with optimized caching strategy
        const response = await fetch(`/api/admin/credit-history${queryParam}`);
        
        if (response.ok) {
          const data = await response.json();
          setCreditHistory(data.history || []);
        } else if (response.status === 401 || response.status === 403) {
          setIsAdmin(false);
          toast.error('Admin session expired');
          router.push('/');
          return;
        }
      }
    } catch (error) {
      console.error(`Error loading ${activeTab} data:`, error);
      toast.error(`Failed to load ${activeTab} data`);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, isAdmin, router]);

  // Verify admin status
  const verifyAdminStatus = useCallback(async () => {
    if (!isLoaded || !isSignedIn) return;
    
    try {
      setIsLoading(true);
      
      // Use our optimized client utility with caching
      const adminStatus = await checkAdminStatus();
      
      if (adminStatus) {
        setIsAdmin(true);
        // Load initial data for the active tab
        await loadTabData();
      } else {
        toast.error('You do not have admin privileges');
        router.push('/');
      }
    } catch (error) {
      console.error('Error verifying admin status:', error);
      toast.error('Failed to verify admin status');
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  }, [isLoaded, isSignedIn, router, loadTabData]);
  
  // Check if user is authenticated and admin
  useEffect(() => {
    if (!isLoaded) return;
    
    if (!isSignedIn) {
      router.push('/sign-in');
      return;
    }
    
    // Only verify admin status if not already verified
    if (!isAdmin) {
      verifyAdminStatus();
    }
  }, [isLoaded, isSignedIn, verifyAdminStatus, isAdmin, router]);

  // Load data when tab changes
  useEffect(() => {
    if (isAdmin && activeTab) {
      loadTabData();
    }
  }, [activeTab, isAdmin, loadTabData]);

  // Award or remove credits from a user
  const handleUserCredits = async (userId: string, email: string, action: 'add' | 'remove' = 'add') => {
    try {
      if (!creditAmount || creditAmount <= 0) {
        toast.error('Please enter a valid credit amount');
        return;
      }

      if (!creditReason.trim()) {
        toast.error('Please enter a reason for this credit change');
        return;
      }

      // Set the selected user for the modal
      setSelectedUserId(userId);
      setSelectedUserEmail(email);
      setCreditAction(action);
      
      // Calculate the actual amount to send to the API (negative for removal)
      const finalAmount = action === 'add' ? creditAmount : -creditAmount;
      
      setIsLoading(true);
      const response = await fetch('/api/admin/award-credits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          amount: finalAmount,
          reason: creditReason || (action === 'add' ? 'Admin award' : 'Admin deduction'),
        }),
      });

      if (response.ok) {
        toast.success(`${creditAmount} credits ${action === 'add' ? 'awarded to' : 'removed from'} ${email}`);
        // Refresh users data and credit history
        loadTabData();
        
        // Reset reason field after successful operation
        setCreditReason('');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || `Failed to ${action} credits`);
      }
    } catch (error) {
      console.error(`Error ${creditAction} credits:`, error);
      toast.error(`Error ${creditAction} credits`);
    } finally {
      setIsLoading(false);
    }
  };

  // Update feedback status
  const updateFeedbackStatus = async (id: string, status: string) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/feedback/update-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          status,
        }),
      });

      if (response.ok) {
        toast.success(`Feedback status updated to ${status}`);
        // Refresh feedback data
        loadTabData();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to update feedback status');
      }
    } catch (error) {
      console.error('Error updating feedback status:', error);
      toast.error('Error updating feedback status');
    } finally {
      setIsLoading(false);
    }
  };

  // Award credits for feedback
  const awardCreditsForFeedback = async (feedbackId: string, userId: string) => {
    try {
      if (!feedbackCreditAmount || feedbackCreditAmount <= 0) {
        toast.error('Please enter a valid credit amount');
        return;
      }
      
      setIsLoading(true);
      const response = await fetch('/api/admin/award-credits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          feedbackId,
          userId,
          amount: feedbackCreditAmount,
          reason: 'Feedback reward',
        }),
      });

      if (response.ok) {
        toast.success(`${feedbackCreditAmount} credits awarded successfully`);
        // Refresh feedback data
        loadTabData();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to award credits');
      }
    } catch (error) {
      console.error('Error awarding credits:', error);
      toast.error('Error awarding credits');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 mt-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500 dark:from-blue-400 dark:to-teal-300 pt-2">
          Admin Dashboard
        </h1>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeTab === 'users' ? 'default' : 'outline'}
            onClick={() => setActiveTab('users')}
            size="sm"
          >
            Users
          </Button>
          <Button
            variant={activeTab === 'feedback' ? 'default' : 'outline'}
            onClick={() => setActiveTab('feedback')}
            size="sm"
          >
            Feedback
          </Button>
          <Button
            variant={activeTab === 'beta' ? 'default' : 'outline'}
            onClick={() => setActiveTab('beta')}
            size="sm"
          >
            Beta Program
          </Button>
          <Button
            variant={activeTab === 'credits' ? 'default' : 'outline'}
            onClick={() => setActiveTab('credits')}
            size="sm"
          >
            Credit History
          </Button>
          <Button
            variant={activeTab === 'admins' ? 'default' : 'outline'}
            onClick={() => setActiveTab('admins')}
            size="sm"
          >
            Admin Management
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">All Users ({users.length})</h2>
              
              <div className="mb-6 p-4 border dark:border-gray-700 rounded-lg">
                <h3 className="text-lg font-medium mb-3">Manage Credits</h3>
                <div className="flex flex-wrap gap-4 items-end">
                  <div>
                    <label className="block text-sm font-medium mb-1">Amount</label>
                    <Input
                      type="number"
                      min="1"
                      value={creditAmount}
                      onChange={(e) => setCreditAmount(parseInt(e.target.value) || 0)}
                      className="w-24"
                    />
                  </div>
                  <div className="flex-grow">
                    <label className="block text-sm font-medium mb-1">Reason <span className="text-red-500">*</span></label>
                    <Input
                      type="text"
                      value={creditReason}
                      onChange={(e) => setCreditReason(e.target.value)}
                      placeholder="Reason for credit change (required)"
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">Reason will be recorded in the credit history and visible to administrators.</p>
              </div>
              
              {users.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Credits</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Created At</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{user.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{user.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                            {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 font-medium">{user.credits || 0}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                            {new Date(user.createdAt).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex space-x-2">
                              <Button 
                                size="sm"
                                variant="default"
                                onClick={() => handleUserCredits(user.id, user.email, 'add')}
                              >
                                Add Credits
                              </Button>
                              <Button 
                                size="sm"
                                variant="destructive"
                                onClick={() => handleUserCredits(user.id, user.email, 'remove')}
                              >
                                Remove Credits
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No users found</p>
              )}
            </div>
          )}

          {/* Feedback Tab */}
          {activeTab === 'feedback' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">User Feedback ({feedback.length})</h2>
              
              <div className="mb-6 flex flex-wrap gap-2">
                <Button 
                  size="sm" 
                  variant={feedbackFilter === 'all' ? 'default' : 'outline'}
                  onClick={() => setFeedbackFilter('all')}
                >
                  All Feedback
                </Button>
                <Button 
                  size="sm" 
                  variant={feedbackFilter === 'pending' ? 'default' : 'outline'}
                  onClick={() => setFeedbackFilter('pending')}
                >
                  Pending
                </Button>
                <Button 
                  size="sm" 
                  variant={feedbackFilter === 'reviewed' ? 'default' : 'outline'}
                  onClick={() => setFeedbackFilter('reviewed')}
                >
                  Reviewed
                </Button>
                <Button 
                  size="sm" 
                  variant={feedbackFilter === 'resolved' ? 'default' : 'outline'}
                  onClick={() => setFeedbackFilter('resolved')}
                >
                  Implemented
                </Button>
              </div>
              
              {feedback.length > 0 ? (
                <div className="space-y-6">
                  {[...feedback].reverse().filter((item) => {
                    if (feedbackFilter === 'all') return true;
                    // Handle both 'resolved' and 'implemented' as the same for UI consistency
                    if (feedbackFilter === 'resolved' && (item.status === 'resolved' || item.status === 'implemented')) {
                      return true;
                    }
                    // Handle 'pending' which might be stored as 'new' or 'pending'
                    if (feedbackFilter === 'pending' && (item.status === 'pending' || item.status === 'new')) {
                      return true;
                    }
                    return item.status === feedbackFilter;
                  }).map((item) => (
                    <div key={item.id} className="border dark:border-gray-700 rounded-lg p-4 transition-shadow hover:shadow-md">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                        <div className="flex-grow">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`inline-block w-2 h-2 rounded-full ${
                              item.status === 'resolved' ? 'bg-green-500' : 
                              item.status === 'reviewed' ? 'bg-blue-500' : 
                              'bg-yellow-500'
                            }`}></span>
                            <p className="text-sm font-medium capitalize">{item.status || 'Pending'}</p>
                          </div>
                          <h3 className="text-lg font-medium">{item.subject || 'No Subject'}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            From: {item.email || 'Anonymous'} • {new Date(item.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2 md:min-w-[200px] justify-end">
                          <div className="flex flex-col gap-2 w-full">
                            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-1">Update Status:</p>
                            <div className="flex gap-1 justify-center">
                              <Button
                                size="sm"
                                variant={item.status === 'pending' ? 'default' : 'outline'}
                                className="px-2 py-1 h-auto text-xs"
                                onClick={() => updateFeedbackStatus(item.id, 'pending')}
                              >
                                Pending
                              </Button>
                              <Button
                                size="sm"
                                variant={item.status === 'reviewed' ? 'default' : 'outline'}
                                className="px-2 py-1 h-auto text-xs"
                                onClick={() => updateFeedbackStatus(item.id, 'reviewed')}
                              >
                                Reviewed
                              </Button>
                              <Button
                                size="sm"
                                variant={item.status === 'resolved' ? 'default' : 'outline'}
                                className="px-2 py-1 h-auto text-xs"
                                onClick={() => updateFeedbackStatus(item.id, 'resolved')}
                              >
                                Implemented
                              </Button>
                            </div>
                          </div>
                          {item.userId && (
                            <div className="w-full mt-2">
                              <div className="flex items-center gap-2 mb-2">
                                <Input
                                  type="number"
                                  min="1"
                                  value={feedbackCreditAmount}
                                  onChange={(e) => setFeedbackCreditAmount(parseInt(e.target.value) || 0)}
                                  className="w-16 h-8 text-xs"
                                  placeholder="5"
                                />
                                <span className="text-xs text-gray-500">credits</span>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                className="w-full"
                                onClick={() => awardCreditsForFeedback(item.id, item.userId)}
                              >
                                <span className="mr-1">🎁</span> Award Credits
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 rounded p-4 mt-2">
                        <p className="whitespace-pre-wrap">{item.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">No feedback found</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Feedback submitted by users will appear here</p>
                </div>
              )}
            </div>
          )}

          {/* Beta Program Tab */}
          {activeTab === 'beta' && (
            <>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Beta Testers</h2>
                {betaTesters.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Joined</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {betaTesters.map((tester) => (
                          <tr key={tester.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{tester.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{tester.status}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                              {new Date(tester.createdAt).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No beta testers found</p>
                )}
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Beta Tasks</h2>
                {betaTasks.length > 0 ? (
                  <div className="space-y-4">
                    {betaTasks.map((task) => (
                      <div key={task.id} className="border dark:border-gray-700 rounded-lg p-4">
                        <h3 className="font-medium">{task.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Status: {task.status}</p>
                        <p className="mt-2">{task.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No beta tasks found</p>
                )}
              </div>
            </>
          )}

          {/* Credit History Tab */}
          {activeTab === 'credits' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Credit History</h2>
              {creditHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Reason</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Admin</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {creditHistory.map((record) => (
                        <tr key={record.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                            {record.userName || record.userId || 'Unknown'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                            {record.userEmail || record.email || 'Unknown'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                            <span className={`font-medium ${record.amount > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                              {record.amount > 0 ? '+' : ''}{record.amount}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              record.type === 'ADMIN_REMOVAL' 
                                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                                : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            }`}>
                              {record.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                            <div className="max-w-xs break-words">
                              {record.reason || 'No reason provided'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{record.adminId || 'System'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                            {new Date(record.createdAt || record.timestamp).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No credit history found</p>
              )}
            </div>
          )}

          {/* Admin Management Tab */}
          {activeTab === 'admins' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Admin Management</h2>
              <AdminManagement />
            </div>
          )}
        </>
      )}
    </div>
  );
}

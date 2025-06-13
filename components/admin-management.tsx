'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AdminManagementProps {
  // Add any props you might need here
}

export default function AdminManagement({}: AdminManagementProps) {
  const [adminEmail, setAdminEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [adminAction, setAdminAction] = useState<'add' | 'remove'>('add');
  const [adminList, setAdminList] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load admin list
  const loadAdminList = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/list', {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAdminList(data.admins || []);
      } else {
        toast.error('Failed to load admin list');
      }
    } catch (error) {
      console.error('Error loading admin list:', error);
      toast.error('Error loading admin list');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle admin action (add/remove)
  const handleAdminAction = async () => {
    try {
      if (!adminEmail || !adminEmail.includes('@')) {
        toast.error('Please enter a valid email address');
        return;
      }

      setIsSubmitting(true);
      const response = await fetch('/api/admin/manage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: adminEmail,
          action: adminAction
        })
      });

      if (response.ok) {
        toast.success(`Admin ${adminAction === 'add' ? 'added' : 'removed'} successfully`);
        setAdminEmail('');
        // Refresh admin list
        loadAdminList();
      } else {
        const data = await response.json();
        toast.error(data.error || `Failed to ${adminAction} admin`);
      }
    } catch (error) {
      console.error(`Error ${adminAction}ing admin:`, error);
      toast.error(`Error ${adminAction}ing admin`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Load admin list on component mount
  useState(() => {
    loadAdminList();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Admin Management</h2>
      
      <div className="mb-6 p-4 border dark:border-gray-700 rounded-lg">
        <h3 className="text-lg font-medium mb-3">Manage Administrators</h3>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="w-full md:w-auto">
            <label className="block text-sm font-medium mb-1">Email Address</label>
            <Input
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              placeholder="admin@example.com"
              className="md:min-w-[300px]"
            />
          </div>
          <div className="w-full md:w-auto">
            <label className="block text-sm font-medium mb-1">Action</label>
            <Select
              value={adminAction}
              onValueChange={(value) => setAdminAction(value as 'add' | 'remove')}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="add">Add Admin</SelectItem>
                <SelectItem value="remove">Remove Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-auto">
            <Button 
              onClick={handleAdminAction}
              disabled={isSubmitting || !adminEmail}
              className="w-full md:w-auto"
            >
              {isSubmitting ? 'Processing...' : adminAction === 'add' ? 'Add Admin' : 'Remove Admin'}
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-3">Current Administrators</h3>
        {isLoading ? (
          <div className="flex justify-center items-center h-24">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : adminList.length > 0 ? (
          <div className="border dark:border-gray-700 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {adminList.map((email) => (
                  <tr key={email}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        onClick={() => {
                          setAdminEmail(email);
                          setAdminAction('remove');
                        }}
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No administrators found</p>
        )}
      </div>
    </div>
  );
}

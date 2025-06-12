'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function AdminManagement() {
  const [adminEmails, setAdminEmails] = useState<string[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAdminEmails();
  }, []);

  const fetchAdminEmails = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/manage-admins');
      
      if (response.ok) {
        const data = await response.json();
        setAdminEmails(data.admins || []);
      } else {
        console.error('Failed to fetch admin emails');
        toast.error('Failed to load admin emails');
      }
    } catch (error) {
      console.error('Error fetching admin emails:', error);
      toast.error('Error loading admin emails');
    } finally {
      setIsLoading(false);
    }
  };

  const addAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newAdminEmail || !adminPassword) {
      toast.error('Please enter both email and password');
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/manage-admins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: newAdminEmail,
          password: adminPassword,
        }),
      });
      
      if (response.ok) {
        toast.success(`Added ${newAdminEmail} as admin`);
        setNewAdminEmail('');
        setAdminPassword('');
        fetchAdminEmails();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to add admin');
      }
    } catch (error) {
      console.error('Error adding admin:', error);
      toast.error('Error adding admin');
    } finally {
      setIsLoading(false);
    }
  };

  const removeAdmin = async (email: string) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/manage-admins', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (response.ok) {
        toast.success(`Removed ${email} from admins`);
        fetchAdminEmails();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to remove admin');
      }
    } catch (error) {
      console.error('Error removing admin:', error);
      toast.error('Error removing admin');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Manage Admins</h2>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Current Admins</h3>
            {adminEmails.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No admins found</p>
            ) : (
              <ul className="space-y-2">
                {adminEmails.map((email) => (
                  <li key={email} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <span>{email}</span>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => removeAdmin(email)}
                      disabled={adminEmails.length <= 1}
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Add New Admin</h3>
            <form onSubmit={addAdmin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  Admin Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white"
              >
                Add Admin
              </Button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

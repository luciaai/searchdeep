"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function MaintenancePage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [bypassKey, setBypassKey] = useState('');
  const router = useRouter();
  
  // Check if we already have a bypass in localStorage
  useEffect(() => {
    const bypass = localStorage.getItem('maintenance_bypass');
    if (bypass === 'true') {
      router.push('/?bypass=true');
    }
    
    // Get the bypass key from the URL if it exists
    const urlParams = new URLSearchParams(window.location.search);
    const key = urlParams.get('key');
    if (key) {
      setBypassKey(key);
    }
  }, [router]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple bypass mechanism - you can change this to any password you prefer
    if (password === 'ziqadmin123') {
      // Store bypass token in localStorage
      localStorage.setItem('maintenance_bypass', 'true');
      // Redirect to home page with bypass flag
      router.push('/?bypass=true');
    } else {
      setError('Invalid password');
      setTimeout(() => setError(''), 3000);
    }
  };
  
  // If a valid bypass key is provided in the URL, automatically bypass
  useEffect(() => {
    if (bypassKey === 'ziqadmin123') {
      localStorage.setItem('maintenance_bypass', 'true');
      router.push('/?bypass=true');
    }
  }, [bypassKey, router]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-900 to-black text-white p-4">
      <div className="max-w-2xl w-full bg-black/30 backdrop-blur-sm rounded-xl p-8 shadow-xl border border-blue-500/20">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="relative w-24 h-24">
            <Image 
              src="/logo.png" 
              alt="Ziq Logo" 
              fill 
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
          Under Construction
        </h1>
        
        <p className="text-center text-lg mb-6 text-gray-300">
          We're making Ziq even better! The site is currently undergoing maintenance and will be back soon.
        </p>
        
        <div className="border-t border-blue-500/20 my-6"></div>
        
        <p className="text-center text-sm mb-6 text-gray-400">
          For questions or to join our beta program, please contact us at <a href="mailto:ziqsearch@gmail.com" className="text-blue-400 hover:text-blue-300">ziqsearch@gmail.com</a>
        </p>
        
        {/* Admin bypass form */}
        <div className="mt-8">
          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            <div className="w-full max-w-xs">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin password"
                className="w-full px-4 py-2 rounded bg-black/50 border border-blue-500/30 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            </div>
            <button
              type="submit"
              className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-medium transition-colors"
            >
              Access Site
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

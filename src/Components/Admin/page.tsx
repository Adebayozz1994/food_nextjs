'use client';
import { useEffect, useState } from 'react';
import { useUser } from '../../app/Usercontext/UserProvider';
import Link from 'next/link';

const Navbar = () => {
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false); 
  }, [setUser]);

  if (loading) return <div>Loading...</div>; 

  return (
    <nav className="bg-gray-800 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Navbar Logo or Brand */}
        <div className="text-white text-2xl font-bold">
          FOOD DELIVERY
        </div>

        {/* Navbar Links */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="text-white">Home</Link>
          <Link href="/about" className="text-white">About</Link>
          <Link href="/contact" className="text-white">Contact</Link>

          {/* Display user info if logged in AND is an admin */}
          {user && user.role === 'admin' ? (
            <div className="text-white">
              <span>Welcome, {user.firstName} (Admin)!</span>
            </div>
          ) : (
            <Link href="/food/login" className="text-white">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

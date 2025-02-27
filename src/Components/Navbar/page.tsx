'use client';
import { useEffect, useState } from 'react';
import { useUser } from '../../components/Usercontext/page';
import Link from 'next/link';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState<boolean>(true);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    // Check localStorage for stored user details
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, [setUser]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <nav className="bg-gray-800 p-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo or Brand */}
          <div className="text-white text-2xl font-bold">FOOD DELIVERY</div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-white hover:text-gray-300 focus:outline-none"
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-white hover:text-gray-300 transition duration-300">
              Home
            </Link>
            <Link href="/food/about" className="text-white hover:text-gray-300 transition duration-300">
              About
            </Link>
            <Link href="/food/contact" className="text-white hover:text-gray-300 transition duration-300">
              Contact
            </Link>
            <Link href="/food/profile" className="text-white hover:text-gray-300 transition duration-300">
              Profile
            </Link>
            {user ? (
              <div className="text-white">
                <span>Welcome, {user.firstName}!</span>
              </div>
            ) : (
              <Link 
                href="/food/login" 
                className="text-white hover:text-gray-300 transition duration-300 bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`${
          isMenuOpen ? 'block' : 'hidden'
        } md:hidden absolute top-full left-0 right-0 bg-gray-800 shadow-lg z-50`}>
          <div className="flex flex-col space-y-4 px-4 py-6">
            <Link 
              href="/" 
              className="text-white hover:text-gray-300 transition duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/food/about" 
              className="text-white hover:text-gray-300 transition duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              href="/food/contact" 
              className="text-white hover:text-gray-300 transition duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <Link 
              href="/food/profile" 
              className="text-white hover:text-gray-300 transition duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Profile
            </Link>
            {user ? (
              <div className="text-white py-2 border-t border-gray-700">
                <span>Welcome, {user.firstName}!</span>
              </div>
            ) : (
              <Link 
                href="/food/login" 
                className="text-white hover:text-gray-300 transition duration-300 bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 inline-block"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

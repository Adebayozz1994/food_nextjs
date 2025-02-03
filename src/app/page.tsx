'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

const Page = () => {
  const router = useRouter();

  const navigateToLogin = () => {
    router.push('/login');
  };

  const navigateToSignup = () => {
    router.push('/signup');
  };

  return (
    <div className="bg-white text-gray-900 font-sans">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-400 to-blue-500 text-white py-32">
        <div className="absolute inset-0 bg-cover bg-center opacity-50" style={{ backgroundImage: 'url("/images/food-hero.jpg")' }}></div>
        <div className="container mx-auto text-center relative z-10 px-4 md:px-8">
          <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl text-white mb-4 leading-tight">
            Welcome to Our Food Delivery Service!
          </h1>
          <p className="text-lg sm:text-xl mb-8 text-white opacity-90">
            Get started by logging in or signing up to enjoy delicious meals delivered to you at your doorstep!
          </p>
          <div className="space-x-4">
            <button
              className="bg-yellow-500 text-white text-lg py-3 px-8 rounded-full hover:bg-yellow-600 transition duration-300 ease-in-out transform hover:scale-105"
              onClick={navigateToLogin}
            >
              Login
            </button>
            <button
              className="bg-blue-500 text-white text-lg py-3 px-8 rounded-full hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105"
              onClick={navigateToSignup}
            >
              Sign Up
            </button>
          </div>
        </div>
      </section>

      {/* Footer Section (optional) */}
      <footer className="bg-gray-900 text-white text-center py-6">
        <p className="text-sm">&copy; 2025 Food Delivery Service. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Page;

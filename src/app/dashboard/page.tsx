'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

// Define the user interface
interface User {
  firstName: string;
  lastName: string;
  // Add any other properties that your user object may have
}

// Sidebar component
const Sidebar = () => {
  return (
    <div className="w-64 h-full bg-gray-800 text-white">
      <h2 className="text-2xl p-4">Dashboard</h2>
      <ul>
        <li className="p-4 hover:bg-gray-700 cursor-pointer">Home</li>
        <li className="p-4 hover:bg-gray-700 cursor-pointer">Profile</li>
        <li className="p-4 hover:bg-gray-700 cursor-pointer">Settings</li>
        <li className="p-4 hover:bg-gray-700 cursor-pointer">Logout</li>
      </ul>
    </div>
  );
};

interface DashboardContentProps {
  user: User;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ user }) => {
  return (
    <div className="flex-1 p-8 bg-gray-100">
      <h1 className="text-3xl font-bold">Welcome, {user.firstName} {user.lastName}</h1>
      <p className="mt-4">Here is where your important information will be displayed.</p>
    </div>
  );
};

const Page: React.FC = () => {
  const [user, setUser] = useState<User | null>(null); // Define state type as User or null
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token'); // Get token from localStorage

      if (!token) {
        router.push('/login'); // Redirect to login if no token
        return;
      }

      try {
        // Make a request to your backend to fetch the user data
        const response = await axios.get('http://localhost:5000/api/user', {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token for authentication
          },
        });

        setUser(response.data); // Set the user data received from the API
      } catch (error) {
        console.error('Error fetching user info:', error);
        router.push('/login'); // Redirect to login in case of error (e.g., token expired)
      }
    };

    fetchUser(); // Fetch user info when component mounts
  }, [router]);

  // If user data is still loading
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <DashboardContent user={user} /> {/* Pass user data to the DashboardContent */}
    </div>
  );
};

export default Page;

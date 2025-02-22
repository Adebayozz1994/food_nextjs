'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface Order {
  _id: string;
  items: {
    product: {
      name: string;
      price: number;
      image: string;
    };
    quantity: number;
  }[];
  total: number;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  trackingId: string;
  createdAt: string;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState('profile');

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    fetchUserProfile();
    fetchUserOrders();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setUser(response.data.data.user);
        setFirstName(response.data.data.user.firstName);
        setLastName(response.data.data.user.lastName);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to fetch profile');
      setLoading(false);
    }
  };

  const fetchUserOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get('http://localhost:5000/api/user/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setOrders(response.data.data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.put(
        'http://localhost:5000/api/user/update-profile',
        { firstName, lastName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success('Profile updated successfully');
        fetchUserProfile();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await axios.put(
        'http://localhost:5000/api/user/update-password',
        {
          currentPassword,
          newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success('Password updated successfully');
        // Clear password fields
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        
        // Optional: Log out user after password change
        // handleLogout();
      }
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast.error(error.response?.data?.message || 'Failed to update password');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/food/login');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex mb-6 border-b">
              <button
                className={`mr-4 pb-2 ${activeTab === 'profile' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                onClick={() => setActiveTab('profile')}
              >
                Profile
              </button>
              <button
                className={`mr-4 pb-2 ${activeTab === 'orders' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                onClick={() => setActiveTab('orders')}
              >
                Orders
              </button>
              <button
                className={`mr-4 pb-2 ${activeTab === 'security' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                onClick={() => setActiveTab('security')}
              >
                Security
              </button>
            </div>

            {activeTab === 'profile' && (
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={user?.email}
                    disabled
                    className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Update Profile
                </button>
              </form>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold">Order ID: {order._id}</p>
                        <p className="text-sm text-gray-600">
                          Date: {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">Total: ${order.total.toFixed(2)}</p>
                        <p className="text-sm">Tracking ID: {order.trackingId}</p>
                      </div>
                    </div>
                    <div className="mt-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.product.name} x {item.quantity}</span>
                          <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex justify-between">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' :
                        order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {order.orderStatus}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <h3 className="text-lg font-medium">Update Password</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Current Password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Update Password
                  </button>
                </form>

                <div className="border-t pt-6">
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
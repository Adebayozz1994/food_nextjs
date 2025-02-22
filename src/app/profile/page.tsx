'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-hot-toast';

interface OrderProduct {
  name: string;
  price: number;
  image: string;
}

interface OrderItem {
  product: OrderProduct;
  quantity: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
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
  role: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface UserResponse {
  user: User;
}

interface OrdersResponse {
  orders: Order[];
}

type ApiError = AxiosError<{ success: boolean; message: string }>;

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'security'>('profile');

  // Form states
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  useEffect(() => {
    fetchUserProfile();
    fetchUserOrders();
  }, []);

  const fetchUserProfile = async (): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response: AxiosResponse<ApiResponse<UserResponse>> = await axios.get(
        'http://localhost:5000/api/user/profile',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setUser(response.data.data.user);
        setFirstName(response.data.data.user.firstName);
        setLastName(response.data.data.user.lastName);
      }
      setLoading(false);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const err = error as ApiError;
        toast.error(err.response?.data?.message || 'Failed to fetch profile');
      } else {
        toast.error('An unexpected error occurred');
      }
      setLoading(false);
    }
  };

  const fetchUserOrders = async (): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response: AxiosResponse<ApiResponse<OrdersResponse>> = await axios.get(
        'http://localhost:5000/api/user/orders',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setOrders(response.data.data.orders);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const err = error as ApiError;
        toast.error(err.response?.data?.message || 'Failed to fetch orders');
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response: AxiosResponse<ApiResponse<UserResponse>> = await axios.put(
        'http://localhost:5000/api/user/update-profile',
        { firstName, lastName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success('Profile updated successfully');
        fetchUserProfile();
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const err = error as ApiError;
        toast.error(err.response?.data?.message || 'Failed to update profile');
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
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

      const response: AxiosResponse<ApiResponse<null>> = await axios.put(
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
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const err = error as ApiError;
        toast.error(err.response?.data?.message || 'Failed to update password');
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  };

  const handleLogout = (): void => {
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
                {orders.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No orders found
                  </div>
                ) : (
                  orders.map((order) => (
                    <div key={order._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="font-semibold text-gray-800">Order ID: {order._id}</p>
                          <p className="text-sm text-gray-600">
                            Date: {new Date(order.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          <p className="text-sm text-gray-600">Tracking ID: {order.trackingId}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-gray-800">
                            Total: ${order.total.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-600">
                            Payment Method: {order.paymentMethod}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center justify-between py-2 border-t">
                            <div className="flex items-center space-x-4">
                              {item.product.image && (
                                <img
                                  src={item.product.image}
                                  alt={item.product.name}
                                  className="w-16 h-16 object-cover rounded"
                                />
                              )}
                              <div>
                                <p className="font-medium text-gray-800">{item.product.name}</p>
                                <p className="text-sm text-gray-600">
                                  Quantity: {item.quantity} × ${item.product.price.toFixed(2)}
                                </p>
                              </div>
                            </div>
                            <p className="font-medium text-gray-800">
                              ${(item.quantity * item.product.price).toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 flex justify-between items-center pt-4 border-t">
                        <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                          order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' :
                          order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          Order Status: {order.orderStatus}
                        </span>
                        <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                          order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          Payment Status: {order.paymentStatus}
                        </span>
                      </div>
                    </div>
                  ))
                )}
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
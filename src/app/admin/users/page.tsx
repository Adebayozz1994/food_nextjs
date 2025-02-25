'use client';

import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import Image from 'next/image';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
}

interface OrderItem {
  product: {
    name: string;
    price: number;
    image?: string;
    description?: string;
  };
  quantity: number;
}

interface Order {
  _id: string;
  trackingId: string;
  items: OrderItem[];
  total: number;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingId, setTrackingId] = useState<string>('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    status: ''
  });

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }
      await fetchUsers();
      setLoading(false);
    };

    checkAuth();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://food-delivery-node-h1lq.onrender.com/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.data && Array.isArray(response.data)) {
        setUsers(response.data);
      } else if (response.data && Array.isArray(response.data.users)) {
        setUsers(response.data.users);
      } else {
        toast.error('Invalid data format received');
        setUsers([]);
      }
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      console.error('Error fetching users:', error);
      toast.error(error.response?.data?.message || 'Failed to load users');
      setUsers([]);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://food-delivery-node-h1lq.onrender.com/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchUsers();
      toast.success('User deleted successfully');
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      status: user.status
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    if (!editingUser) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `https://food-delivery-node-h1lq.onrender.com/api/admin/users/${editingUser._id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchUsers();
      setEditingUser(null);
      toast.success('User updated successfully');
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.response?.data?.message || 'Failed to update user');
    }
  };

  const handleTrackOrder = async () => {
    if (!trackingId.trim()) {
      toast.error('Please enter a tracking ID');
      return;
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get<{ order: Order }>(
        `https://food-delivery-node-h1lq.onrender.com/api/admin/orders/${trackingId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedOrder(res.data.order);
      toast.success('Order found');
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      console.error(error);
      setSelectedOrder(null);
      toast.error(error.response?.data?.message || 'Order not found');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (newStatus: string) => {
    if (!selectedOrder) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `https://food-delivery-node-h1lq.onrender.com/api/admin/orders/${selectedOrder.trackingId}/status`,
        { orderStatus: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Refresh order details
      const res = await axios.get<{ order: Order }>(
        `https://food-delivery-node-h1lq.onrender.com/api/admin/orders/${selectedOrder.trackingId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedOrder(res.data.order);
      toast.success('Order status updated successfully');
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.response?.data?.message || 'Failed to update order status');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Toaster position="top-right" />
      
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Order Tracking Section */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Track Order</h2>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            placeholder="Enter Tracking ID"
            className="flex-1 border p-2 rounded"
          />
          <button
            onClick={handleTrackOrder}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Track
          </button>
        </div>

        {selectedOrder && (
          <div className="mt-4 border p-4 rounded">
            <h3 className="font-semibold mb-2">Order Details</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p><span className="font-medium">Tracking ID:</span> {selectedOrder.trackingId}</p>
                <p><span className="font-medium">Customer:</span> {selectedOrder.user.firstName} {selectedOrder.user.lastName}</p>
                <p><span className="font-medium">Email:</span> {selectedOrder.user.email}</p>
                <p><span className="font-medium">Order Date:</span> {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p><span className="font-medium">Total:</span> ${selectedOrder.total.toFixed(2)}</p>
                <p><span className="font-medium">Payment Status:</span> {selectedOrder.paymentStatus}</p>
                <p>
                  <span className="font-medium">Order Status:</span>
                  <select
                    value={selectedOrder.orderStatus}
                    onChange={(e) => handleUpdateOrderStatus(e.target.value)}
                    className="ml-2 border rounded p-1"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </p>
              </div>
            </div>
            
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Order Items:</h4>
              <div className="space-y-2">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center border-b pb-2">
                    <div className="flex gap-4 items-center">
                      {item.product.image && (
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-gray-600">
                          ${item.product.price.toFixed(2)} x {item.quantity}
                        </p>
                        {item.product.description && (
                          <p className="text-sm text-gray-500">{item.product.description}</p>
                        )}
                      </div>
                    </div>
                    <p className="font-medium">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Manage Users</h2>
        <div className="overflow-x-auto">
          {users.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No users found</p>
          ) : (
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-2 px-4 border">Name</th>
                  <th className="py-2 px-4 border">Email</th>
                  <th className="py-2 px-4 border">Role</th>
                  <th className="py-2 px-4 border">Status</th>
                  <th className="py-2 px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="py-2 px-4 border">{user.firstName} {user.lastName}</td>
                    <td className="py-2 px-4 border">{user.email}</td>
                    <td className="py-2 px-4 border">{user.role}</td>
                    <td className="py-2 px-4 border">
                      <span className={`px-2 py-1 rounded text-sm ${
                        user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-2 px-4 border">
                      <button
                        onClick={() => handleEdit(user)}
                        className="bg-yellow-500 text-white py-1 px-3 rounded mr-2 hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-md shadow-sm p-2"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-md shadow-sm p-2"
                >
                  <option value="active">Active</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setEditingUser(null)}
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
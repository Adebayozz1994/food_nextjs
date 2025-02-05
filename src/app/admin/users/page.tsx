'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Define User interface
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string>('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', role: '' });
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (!token) return;
    axios
      .get<User[]>('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data))
      .catch((err) => {
        console.error(err);
        setError('Failed to load users');
      });
  }, [token]);

  const handleDelete = async (userId: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
    } catch (err) {
      console.error(err);
      setError('Failed to delete user');
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({ firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    if (!editingUser) return;
    try {
      const res = await axios.put(
        `http://localhost:5000/api/admin/users/${editingUser._id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers((prevUsers) => prevUsers.map((user) => (user._id === editingUser._id ? res.data : user)));
      setEditingUser(null);
    } catch (err) {
      console.error(err);
      setError('Failed to update user');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>
      {error && <p className="text-red-500">{error}</p>}
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Name</th>
            <th className="py-2 px-4 border">Email</th>
            <th className="py-2 px-4 border">Role</th>
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
                <button
                  onClick={() => handleEdit(user)}
                  className="bg-yellow-500 text-white py-1 px-3 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user._id)}
                  className="bg-red-500 text-white py-1 px-3 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editingUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="border p-2 w-full mb-2"
              placeholder="First Name"
            />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="border p-2 w-full mb-2"
              placeholder="Last Name"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border p-2 w-full mb-2"
              placeholder="Email"
            />
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="border p-2 w-full mb-4"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <div className="flex justify-end">
              <button
                onClick={() => setEditingUser(null)}
                className="bg-gray-500 text-white py-1 px-3 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-blue-500 text-white py-1 px-3 rounded"
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

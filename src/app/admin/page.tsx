// pages/admin/dashboard.js
'use client';
import React from 'react';
// import AdminNavbar from '../../components/AdminNavbar';
import Link from 'next/link';

export default function Dashboard() {
  return (
    <div>
      {/* <AdminNavbar /> */}
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <div className="flex space-x-4">
          <Link href="/admin/products" className="bg-blue-500 text-white py-2 px-4 rounded">Manage Products</Link>
          <Link href="/admin/users" className="bg-green-500 text-white py-2 px-4 rounded">Manage Users</Link>
        </div>
      </div>
    </div>
  );
}

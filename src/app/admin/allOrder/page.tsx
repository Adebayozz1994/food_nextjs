'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
}

interface OrderItem {
  product: Product;
  quantity: number;
}

interface Order {
  _id: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  items: OrderItem[];
  total: number;
  orderStatus: string;
  paymentMethod: string;
  paymentStatus: string;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    phoneNumber: string;
  };
  createdAt: string;
  trackingId: string;
}

interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  ordersByStatus: { [key: string]: number };
  ordersByPaymentMethod: { [key: string]: number };
}

export default function AllOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/admin/orders', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Orders response:', response.data); // Debug log

      if (response.data.success && response.data.data.orders) {
        setOrders(response.data.data.orders);
      }

      if (response.data.success && response.data.data.stats) {
        setStats(response.data.data.stats);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        router.push('/login');
        return;
      }
      setError('Failed to fetch orders');
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, orderStatus: string, paymentStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      await axios.patch(
        `http://localhost:5000/api/admin/orders/${orderId}`,
        { orderStatus, paymentStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Refresh orders after update
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      setError('Failed to update order');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">All Orders</h1>
      
      {/* Stats Section */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Total Orders</h3>
            <p className="text-2xl">{stats.totalOrders}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Total Revenue</h3>
            <p className="text-2xl">${stats.totalRevenue.toFixed(2)}</p>
          </div>
        </div>
      )}

      {/* Orders List */}
      <div className="grid gap-6">
        {orders && orders.length > 0 ? (
          orders.map((order) => (
            <div key={order._id} className="bg-white shadow-md rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-600">Order ID: {order._id}</p>
                  <p className="text-sm text-gray-600">Tracking ID: {order.trackingId}</p>
                  <p className="text-sm text-gray-600">
                    Date: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p className="font-semibold">Total: ${order.total.toFixed(2)}</p>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold mb-2">Customer Details:</h3>
                <p>{order.user.firstName} {order.user.lastName}</p>
                <p>{order.user.email}</p>
                {order.deliveryAddress && (
                  <div className="mt-2">
                    <p className="font-semibold">Delivery Address:</p>
                    <p>{order.deliveryAddress.street}</p>
                    <p>{order.deliveryAddress.city}, {order.deliveryAddress.state}</p>
                    <p>Phone: {order.deliveryAddress.phoneNumber}</p>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <h3 className="font-semibold mb-2">Items:</h3>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{item.product.name} x {item.quantity}</span>
                      <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="flex items-center space-x-4">
                  <div>
                    <span className="font-semibold mr-2">Order Status:</span>
                    <select
                      value={order.orderStatus}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value, order.paymentStatus)}
                      className="border rounded p-2"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                  
                  <div>
                    <span className="font-semibold mr-2">Payment Status:</span>
                    <select
                      value={order.paymentStatus}
                      onChange={(e) => updateOrderStatus(order._id, order.orderStatus, e.target.value)}
                      className="border rounded p-2"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                      <option value="Failed">Failed</option>
                      <option value="Refunded">Refunded</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' :
                  order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-800' :
                  order.orderStatus === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                  order.orderStatus === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  Order: {order.orderStatus}
                </span>

                <span className={`px-3 py-1 rounded-full text-sm ${
                  order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' :
                  order.paymentStatus === 'Failed' ? 'bg-red-100 text-red-800' :
                  order.paymentStatus === 'Refunded' ? 'bg-purple-100 text-purple-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  Payment: {order.paymentStatus}
                </span>
              </div>

              <div className="mt-4 text-sm text-gray-600">
                <p>Payment Method: {order.paymentMethod}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">
            No orders found
          </div>
        )}
      </div>
    </div>
  );
}
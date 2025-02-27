// src/app/food/order-success/OrderSuccessContent.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { FaCheckCircle, FaTruck, FaMapMarkerAlt, FaReceipt, FaShoppingBag } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

interface OrderProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
}

interface OrderItem {
  product: OrderProduct;
  quantity: number;
}

type PaymentMethod = 'cod' | 'card' | 'whatsapp';

interface OrderDetails {
  _id: string;
  trackingId: string;
  items: OrderItem[];
  total: number;
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  orderStatus: string;
  paymentMethod: PaymentMethod;
  deliveryAddress?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  createdAt: string;
}

export default function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const orderId = searchParams.get('orderId');

    if (orderId) {
      const fetchOrderDetails = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get<{ order: OrderDetails }>(
            `https://food-delivery-node-h1lq.onrender.com/api/order/${orderId}`,
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );

          setOrder(response.data.order);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching order details:', error);
          setError('Failed to load order details');
          setLoading(false);
        }
      };

      fetchOrderDetails();
    }
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 p-6">{error}</div>;
  }

  if (!order) {
    return <div className="text-center p-6">No order found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 relative pb-24">
      {/* Continue Shopping Button for Medium and Larger Screens */}
      <Link 
        href="/food/products" 
        className="hidden md:block md:fixed md:top-4 md:right-4 z-50 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
      >
        <FaShoppingBag className="text-lg" />
        <span>Continue Shopping</span>
      </Link>

      <div className="text-center mb-8">
        <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-800">Order Successful!</h1>
        <p className="text-gray-600 mt-2">Thank you for your order</p>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4 space-x-3">
            <div>
              <p className="text-sm text-gray-600">Order ID</p>
              <p className="font-semibold">{order._id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Date</p>
              <p className="font-semibold">
                {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center">
              <FaReceipt className="text-blue-500 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Payment Method</p>
                <p className={`font-semibold ${
                  order.paymentMethod === 'cod' ? 'text-orange-600' : 'text-green-600'
                }`}>
                  {order.paymentMethod.toUpperCase()}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <FaTruck className="text-blue-500 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Order Status</p>
                <p className="font-semibold">{order.orderStatus}</p>
              </div>
            </div>
            <div className="flex items-center">
              <FaMapMarkerAlt className="text-blue-500 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Tracking ID</p>
                <p className="font-semibold">{order.trackingId}</p>
              </div>
            </div>
          </div>

          {order.paymentMethod === 'cod' && order.deliveryAddress && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start">
                <FaMapMarkerAlt className="text-blue-500 mt-1 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Delivery Address</p>
                  <p className="font-semibold mt-1">
                    {[
                      order.deliveryAddress.street,
                      order.deliveryAddress.city,
                      order.deliveryAddress.state,
                      order.deliveryAddress.zipCode
                    ].filter(Boolean).join(', ')}
                  </p>
                  <p className="text-sm text-orange-600 mt-2">
                    * Please keep the exact amount ready for Cash on Delivery
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Order Items</h2>
          
          <div className="space-y-6">
            {order.items.map((item, index) => (
              <div key={`${item.product._id}-${index}`} 
                className="flex flex-col md:flex-row md:items-center justify-between border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-4 relative w-full h-[100px]">
                  {item.product.image && (
                    <Image 
                      src={item.product.image} 
                      alt={item.product.name} 
                      width={96}
                      height={96}
                      className="object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-800">
                      {item.product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {item.product.description}
                    </p>
                    <div className="mt-2 flex items-center space-x-4">
                      <span className="text-gray-600">
                        Quantity: {item.quantity}
                      </span>
                      <span className="text-gray-600">
                        ${item.product.price.toFixed(2)} each
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 md:ml-4 text-right">
                  <p className="font-bold text-lg text-gray-800">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-4 border-t">
            <div className="flex justify-between items-center mb-2">
              <p className="text-gray-600">Payment Status</p>
              <p className={`font-medium ${
                order.paymentStatus === 'Paid' ? 'text-green-600' : 'text-orange-600'
              }`}>
                {order.paymentStatus}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <p className="font-bold text-xl">Total Amount</p>
              <p className="font-bold text-xl text-blue-600">
                ${order.total.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Continue Shopping Button for Small Screens as a Fixed Footer */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white shadow-inner">
        <Link 
          href="/food/products" 
          className="flex justify-center items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
          <FaShoppingBag className="text-lg" />
          <span>Continue Shopping</span>
        </Link>
      </div>
    </div>
  );
}

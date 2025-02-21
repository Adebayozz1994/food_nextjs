'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';

interface OrderDetails {
  _id: string;
  trackingId: string;
  items: Array<{
    product: {
      name: string;
      price: number;
      image?: string;
    };
    quantity: number;
  }>;
  total: number;
  paymentStatus: string;
  orderStatus: string;
}

export default function OrderSuccessPage() {
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
          const response = await axios.get(`http://localhost:5000/api/order/${orderId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!order) {
    return <div>No order found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Order Success</h1>
      
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
        <p>Your order has been placed successfully!</p>
        <p>Tracking ID: {order.trackingId}</p>
      </div>

      <div className="bg-white shadow-md rounded p-6">
        <h2 className="text-xl font-semibold mb-4">Order Details</h2>
        
        <div className="space-y-4">
          {order.items.map((item, index) => (
            <div key={index} className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center space-x-4">
                {item.product.image && (
                  <img 
                    src={item.product.image} 
                    alt={item.product.name} 
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div>
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-gray-600">Quantity: {item.quantity}</p>
                </div>
              </div>
              <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
          
          <div className="flex justify-between pt-4">
            <p className="font-bold">Total:</p>
            <p className="font-bold">${order.total.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
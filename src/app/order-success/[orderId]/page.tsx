'use client';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Product {
  name: string;
  price: number;
}

interface OrderItem {
  product: Product;
  quantity: number;
}

interface Order {
  _id: string;
  total: number;
  paymentStatus: string;
  items: OrderItem[];
}

const OrderSuccessPage = () => {
  const [order, setOrder] = useState<Order | null>(null);
  const searchParams = useSearchParams();  
  const orderId = searchParams.get('orderId'); 

 
  console.log("orderId from URL:", orderId);

  useEffect(() => {
    console.log("useEffect triggered for orderId:", orderId);

    if (orderId) {
      const fetchOrder = async () => {
        try {
          const { data } = await axios.get(`http://localhost:5000/api/order/${orderId}`);
          console.log("Fetched order data:", data); 
          setOrder(data.order);
        } catch (error) {
          console.error('Failed to fetch order details', error);
        }
      };

      fetchOrder();
    }
  }, [orderId]);  

  if (!orderId) {
    return <div>Loading...</div>; 
  }

  if (!order) return <div>Loading order details...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Order Confirmation</h1>
      <p className="text-lg mb-4">Thank you for your order!</p>
      <p className="text-lg mb-4">Order ID: {order._id}</p>
      <p className="text-lg mb-4">Total: ${order.total}</p>
      <p className="text-lg mb-4">Payment Status: {order.paymentStatus}</p>

      <h2 className="text-xl font-semibold mt-6">Order Items:</h2>
      <ul className="list-disc pl-5">
        {order.items.map((item) => (
          <li key={item.product.name}>
            {item.quantity} x {item.product.name} - ${item.product.price * item.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderSuccessPage;

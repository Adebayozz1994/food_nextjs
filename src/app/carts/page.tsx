// pages/food/cart.tsx
'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import UserNavbar from '../../components/UserNavbar';

interface Product {
  _id: string;
  name: string;
  price: number;
  imageUrl?: string;
  description?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface Cart {
  _id?: string;
  user: string;
  items: CartItem[];
}

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get<Cart>('http://localhost:5000/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => setCart(res.data))
      .catch((err) => {
        console.error(err);
        setError('Failed to load cart');
      });
  }, []);

  return (
    <div>
      {/* <UserNavbar /> */}
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        {error && <p className="text-red-500">{error}</p>}
        {cart ? (
          <div>
            {cart.items.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <ul>
                {cart.items.map((item) => (
                  <li key={item.product._id} className="border p-4 my-2">
                    <div className="flex justify-between">
                      <div>
                        <h2 className="font-bold">{item.product.name}</h2>
                        <p>Quantity: {item.quantity}</p>
                      </div>
                      <div>
                        <p>${item.product.price}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <p>Loading cart...</p>
        )}
      </div>
    </div>
  );
}

// app/cart/page.tsx
'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface CartItem {
  product: {
    _id: string;
    name: string;
    price: number;
    imageUrl: string;
  };
  quantity: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:5000/api/cart', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setCartItems(data.items);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:5000/api/cart/update',
        { productId, quantity },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      fetchCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/cart/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      fetchCart();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold">Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p className="text-gray-500 mt-4">Your cart is empty</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div key={item.product._id} className="flex items-center justify-between p-4 border-b">
              <img src={item.product.imageUrl} alt={item.product.name} className="w-16 h-16 rounded" />
              <p className="font-semibold">{item.product.name}</p>
              <p>${item.product.price.toFixed(2)}</p>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => handleUpdateQuantity(item.product._id, parseInt(e.target.value))}
                className="border p-1 w-16"
                min="1"
              />
              <button onClick={() => handleRemoveItem(item.product._id)} className="text-red-500">
                Remove
              </button>
            </div>
          ))}
          {/* Total Price Section */}
          <div className="mt-6 flex justify-between items-center border-t pt-4">
            <h3 className="text-xl font-semibold">Total:</h3>
            <p className="text-xl font-bold">#{totalPrice.toFixed(2)}</p>
          </div>
        </>
      )}
    </div>
  );
}

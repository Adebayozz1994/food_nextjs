'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';

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
  const router = useRouter();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('https://food-delivery-node-h1lq.onrender.com/api/cart', {
        headers: { Authorization: `Bearer ${token}` },
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
        'https://food-delivery-node-h1lq.onrender.com/api/cart/update',
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      fetchCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://food-delivery-node-h1lq.onrender.com/api/cart/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      fetchCart();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleCheckout = () => {
    router.push('/food/carts');
  };

  // const handleOrderSuccess = () => {
  //   // Clear local storage cart data
  //   localStorage.removeItem('cart');
    
  //   // Dispatch custom event
  //   window.dispatchEvent(new Event('orderCompleted'));
    
  //   // Navigate to success page
  //   router.push('/food/order-success');
  // };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  return (
    <div className="max-w-4xl mx-auto p-1">
      <h2 className="text-2xl font-bold mb-10">Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p className="text-gray-500 mt-4">Your cart is empty</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div key={item.product._id} className="flex items-center justify-between border-b mb-5">
              <Image src={item.product.imageUrl} alt={item.product.name} className="w-12 h-12 rounded" />
              <p className="font-semibold m-1">{item.product.name}</p>
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
          <div className="mt-6 flex justify-between items-center border-t pt-4">
            <h3 className="text-xl font-semibold">Total:</h3>
            <p className="text-xl font-bold">${totalPrice.toFixed(2)}</p>
          </div>
          {/* Checkout Button */}
          <button
            onClick={handleCheckout}
            className="mt-6 w-full bg-blue-500 text-white py-3 text-lg font-semibold rounded hover:bg-blue-600 transition"
          >
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
}

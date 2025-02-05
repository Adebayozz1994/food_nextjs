import { useEffect, useState } from 'react';
import { getCart,updateCartItem, removeFromCart } from '@/app/services/services.cart';

type CartItem = {
  product: {
    _id: string;
    name: string;
    price: number;
    imageUrl: string;
  };
  quantity: number;
};

const Cart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const data = await getCart();
      setCart(data.items);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) return;
    await updateCartItem(productId, quantity);
    fetchCart();
  };

  const handleRemoveItem = async (productId: string) => {
    await removeFromCart(productId);
    fetchCart();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold">Shopping Cart</h2>
      {cart.length === 0 ? (
        <p className="text-gray-500 mt-4">Your cart is empty</p>
      ) : (
        cart.map((item) => (
          <div key={item.product._id} className="flex items-center justify-between p-4 border-b">
            <img src={item.product.imageUrl} alt={item.product.name} className="w-16 h-16 rounded" />
            <p className="font-semibold">{item.product.name}</p>
            <p>${item.product.price}</p>
            <input
              type="number"
              value={item.quantity}
              onChange={(e) => handleUpdateQuantity(item.product._id, parseInt(e.target.value))}
              className="border p-1 w-16"
            />
            <button onClick={() => handleRemoveItem(item.product._id)} className="text-red-500">Remove</button>
          </div>
        ))
      )}
    </div>
  );
};

export default Cart;

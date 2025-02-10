// pages/food/cart.tsx
'use client';

import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

// --- Type Declarations ---

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

// Define the payload type for the checkout request.
interface CheckoutPayload {
  paymentMethod: string;
  cardDetails?: {
    cardNumber: string;
  };
}

// Define the type for the expected response from checkout.
interface CheckoutResponse {
  message: string;
  whatsappLink?: string;
}

// --- Component ---

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [error, setError] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('cod');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [checkoutMessage, setCheckoutMessage] = useState<string>('');
  const [whatsappLink, setWhatsappLink] = useState<string>('');

  // Fetch the cart when the component mounts.
  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get<Cart>('http://localhost:5000/api/cart', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log('Cart received:', res.data); // Debug: log the cart object
        setCart(res.data);
      })
      .catch((err: unknown) => {
        console.error(err);
        setError('Failed to load cart');
      });
  }, []);

  // Update payment method based on user selection.
  const handlePaymentMethodChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setPaymentMethod(e.target.value);
  };

  // Handle the checkout process.
  const handleCheckout = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCheckoutMessage('');
    setWhatsappLink('');
    const token = localStorage.getItem('token');

    // Build the payload with the proper type.
    const payload: CheckoutPayload = { paymentMethod };
    if (paymentMethod === 'card') {
      payload.cardDetails = { cardNumber };
    }

    try {
      const res = await axios.post<CheckoutResponse>(
        'http://localhost:5000/api/checkout',
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCheckoutMessage(res.data.message);
      if (res.data.whatsappLink) {
        setWhatsappLink(res.data.whatsappLink);
      }
      // Optionally clear or refresh the cart after checkout.
      setCart(null);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setCheckoutMessage(
          error.response?.data?.message || 'Checkout failed'
        );
      } else {
        console.error(error);
        setCheckoutMessage('Checkout failed');
      }
    }
  };

  return (
    <div>
      {/* Optionally, include your UserNavbar component */}
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        {error && <p className="text-red-500">{error}</p>}
        {cart ? (
          <div>
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

            {/* Checkout Section: Always shown when a cart is loaded */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Checkout</h2>
              <form onSubmit={handleCheckout}>
                <div className="mb-4">
                  <label
                    htmlFor="paymentMethod"
                    className="block mb-1 font-semibold"
                  >
                    Select Payment Method:
                  </label>
                  <select
                    id="paymentMethod"
                    value={paymentMethod}
                    onChange={handlePaymentMethodChange}
                    className="border p-2 w-full"
                  >
                    <option value="cod">Pay on Delivery (COD)</option>
                    <option value="card">Pay with Card</option>
                    <option value="whatsapp">Order through WhatsApp</option>
                  </select>
                </div>

                {paymentMethod === 'card' && (
                  <div className="mb-4">
                    <label
                      htmlFor="cardNumber"
                      className="block mb-1 font-semibold"
                    >
                      Card Number:
                    </label>
                    <input
                      type="text"
                      id="cardNumber"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="border p-2 w-full"
                      placeholder="Enter dummy card number"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded"
                >
                  Checkout
                </button>
              </form>
              {checkoutMessage && (
                <p className="mt-4 text-green-600">{checkoutMessage}</p>
              )}
              {whatsappLink && (
                <p className="mt-4">
                  To complete your order via WhatsApp,{' '}
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    click here
                  </a>
                  .
                </p>
              )}
            </div>
          </div>
        ) : (
          <p>Loading cart...</p>
        )}
      </div>
    </div>
  );
}

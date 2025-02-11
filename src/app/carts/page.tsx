'use client';

import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51QrGLQGu8lA2diLS1Lv1EUKugcYcw2e6hLxlS5cCQm0iHl2gYLOnokTUVEEDKLz69oJoJLwffXoCybK4IYJCIKDb00ePKnVval'); // Replace with your Stripe publishable key

interface CheckoutResponse {
  message: string;
  clientSecret?: string;
  whatsappLink?: string;
}

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [whatsappLink, setWhatsappLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('card');

  const handleCheckout = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const token = localStorage.getItem('token');
    try {
      const { data } = await axios.post<CheckoutResponse>(
        'http://localhost:5000/api/order/checkout',
        { paymentMethod },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (paymentMethod === 'card') {
        setClientSecret(data.clientSecret || null);
      } else if (paymentMethod === 'whatsapp' && data.whatsappLink) {
        setWhatsappLink(data.whatsappLink);
      } else {
        setMessage('Order placed successfully!');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setMessage('Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!stripe || !elements || !clientSecret) return;

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)!,
      },
    });

    if (error) {
      setMessage(error.message || 'Payment failed');
    } else if (paymentIntent?.status === 'succeeded') {
      setMessage('Payment successful!');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {message && <p className="text-red-500 mb-4">{message}</p>}
      {whatsappLink && (
        <p className="text-green-500 mb-4">
          Order placed via WhatsApp! <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="underline">Click here to confirm.</a>
        </p>
      )}

      <form onSubmit={handleCheckout}>
        <label className="block mb-2">Select Payment Method:</label>
        <select className="border p-2 mb-4 w-full" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
          <option value="card">Credit/Debit Card</option>
          <option value="whatsapp">Order via WhatsApp</option>
          <option value="cod">Cash on Delivery</option>
        </select>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Proceed to Payment'}
        </button>
      </form>

      {clientSecret && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Enter Card Details:</h2>
          <CardElement className="border p-2 rounded mt-2" />
          <button
            className="bg-green-500 text-white px-4 py-2 mt-4 rounded w-full"
            onClick={handlePayment}
          >
            Pay Now
          </button>
        </div>
      )}
    </div>
  );
};

export default function CheckoutPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}

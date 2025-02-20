'use client'
import React, { useState, FormEvent} from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51QrGLQGu8lA2diLS1Lv1EUKugcYcw2e6hLxlS5cCQm0iHl2gYLOnokTUVEEDKLz69oJoJLwffXoCybK4IYJCIKDb00ePKnVval');

interface CheckoutResponse {
  message: string;
  clientSecret?: string;
  whatsappLink?: string;
  orderId?: string;
  products?: Array<{ name: string, price: number, quantity: number }>;
}

interface OrderItem {
  product: {
    name: string;
    price: number;
    image?: string;
    description?: string;
  };
  quantity: number;
}

interface OrderDetails {
  orderId: string;
  trackingId: string;
  items: OrderItem[];
  total: number;
  paymentStatus: string;
  createdAt: string;
}

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [whatsappLink, setWhatsappLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  
  const handleCheckout = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const token = localStorage.getItem('token');
    try {
      const { data, headers } = await axios.post<CheckoutResponse>(
        'http://localhost:5000/api/order/checkout',
        { paymentMethod },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (headers['content-type']?.includes('application/json')) {
        if (paymentMethod === 'card') {
          setClientSecret(data.clientSecret || null);
        } else if (paymentMethod === 'whatsapp' && data.whatsappLink) {
          setWhatsappLink(data.whatsappLink);
        } else {
          setMessage('Order placed successfully!');
        }
      } else {
        throw new Error('Expected JSON, but received HTML.');
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

    setLoading(true);
    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (error) {
        setMessage(error.message || 'Payment failed');
      } else if (paymentIntent?.status === 'succeeded') {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(
            `http://localhost:5000/api/order/payment-intent/${paymentIntent.id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          
          setOrderDetails(response.data);
          setMessage('Payment successful!');
        } catch (error) {
          console.error('Error fetching order details:', error);
          setMessage('Payment successful, but failed to load order details.');
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      setMessage('Payment processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {message && (
        <p className={`mb-4 ${message.includes('failed') ? 'text-red-500' : 'text-green-500'}`}>
          {message}
        </p>
      )}

      {whatsappLink && (
        <p className="text-green-500 mb-4">
          Order placed via WhatsApp! <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="underline">Click here to confirm.</a>
        </p>
      )}

      <form onSubmit={handleCheckout}>
        <label className="block mb-2">Select Payment Method:</label>
        <select 
          className="border p-2 mb-4 w-full rounded"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="card">Credit/Debit Card</option>
          <option value="whatsapp">Order via WhatsApp</option>
          <option value="cod">Cash on Delivery</option>
        </select>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600 disabled:bg-blue-300"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Proceed to Payment'}
        </button>
      </form>

      {clientSecret && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Enter Card Details:</h2>
          <div className="border p-4 rounded bg-white mb-4">
            <CardElement options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
              },
            }} />
          </div>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded w-full hover:bg-green-600 disabled:bg-green-300"
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? 'Processing Payment...' : 'Pay Now'}
          </button>
        </div>
      )}

      {orderDetails && message?.includes('successful') && (
        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-green-600 mb-4">Your Purchase Was Successful!</h2>
          <p className="mb-4">Thank you for your order. Your payment has been processed successfully.</p>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="font-medium text-gray-700">Order Tracking ID: <span className="text-black">{orderDetails.trackingId}</span></p>
            
            <h3 className="text-xl font-semibold mt-6 mb-4">Order Details:</h3>
            <ul className="space-y-4">
              {orderDetails.items.map((item: OrderItem, index: number) => (
                <li key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{item.product.name}</h4>
                      {item.product.image && (
                        <img 
                          src={item.product.image} 
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded mt-2"
                        />
                      )}
                      {item.product.description && (
                        <p className="text-gray-600 mt-1">{item.product.description}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-lg">${item.product.price.toFixed(2)}</p>
                      <p className="text-gray-600">Quantity: {item.quantity}</p>
                      <p className="font-medium mt-1">
                        Subtotal: ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            
            <div className="mt-6 border-t pt-4">
              <p className="text-xl font-bold text-right">
                Order Total: ${orderDetails.total.toFixed(2)}
              </p>
            </div>
          </div>
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
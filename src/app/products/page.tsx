'use client';

import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { FaShoppingCart } from 'react-icons/fa';
import Link from 'next/link';

// Define a TypeScript interface for Product
interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
}

interface CartResponse {
  message: string;
  cartItemsCount: number;
}

interface ErrorResponse {
  message: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string>('');
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
  const [cartMessage, setCartMessage] = useState<{ [key: string]: string }>({});
  const [cartItemsCount, setCartItemsCount] = useState<number>(0);

  useEffect(() => {
    fetchProducts();
    fetchCartCount();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get<Product[]>('http://localhost:5000/api/products');
      setProducts(res.data);
    } catch (error) {
      console.error(error);
      setError('Failed to load products');
    }
  };

  const fetchCartCount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get<{ count: number }>(
        'http://localhost:5000/api/cart/count',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      // Make sure to use the count from the response
      setCartItemsCount(response.data.count);
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  // Function to handle "Add to Cart"
  const handleAddToCart = async (productId: string) => {
    // Set loading state for specific button
    setLoadingStates(prev => ({ ...prev, [productId]: true }));
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setCartMessage(prev => ({
          ...prev,
          [productId]: 'Please log in first',
        }));
        return;
      }

      const response = await axios.post<CartResponse>(
        'http://localhost:5000/api/cart/add',
        { productId, quantity: 1 },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCartMessage(prev => ({
        ...prev,
        [productId]: response.data.message || 'Added to cart!',
      }));

      // Update cart count from the response
      setCartItemsCount(response.data.cartItemsCount);

      // Clear message after 3 seconds
      setTimeout(() => {
        setCartMessage(prev => ({
          ...prev,
          [productId]: '',
        }));
      }, 3000);
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      setCartMessage(prev => ({
        ...prev,
        [productId]: err.response?.data?.message || 'Failed to add to cart',
      }));
    } finally {
      // Clear loading state for specific button
      setLoadingStates(prev => ({ ...prev, [productId]: false }));
    }
  };

  return (
    <div className="relative">
      {/* Cart Icon with Link */}
      <Link href="/cartpage" className="fixed top-4 right-4 z-50 cursor-pointer">
        <div className="relative p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow">
          <FaShoppingCart className="text-2xl text-blue-600" />
          {cartItemsCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
              {cartItemsCount}
            </span>
          )}
        </div>
      </Link>

      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Our Products</h1>
        {error && <p className="text-red-500">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="border p-4 rounded shadow hover:shadow-md transition-shadow">
              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-48 object-cover mb-4 rounded"
                />
              )}
              <h2 className="text-xl font-bold">{product.name}</h2>
              <p className="mt-2 text-gray-700">${product.price.toFixed(2)}</p>
              {product.description && <p className="mt-2 text-gray-600">{product.description}</p>}

              <button
                onClick={() => handleAddToCart(product._id)}
                disabled={loadingStates[product._id]}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300 disabled:bg-gray-400 w-full"
              >
                {loadingStates[product._id] ? 'Adding...' : 'Add to Cart'}
              </button>

              {cartMessage[product._id] && (
                <p className={`text-sm mt-2 ${
                  cartMessage[product._id].includes('Failed') || 
                  cartMessage[product._id].includes('Please log in') 
                    ? 'text-red-600' 
                    : 'text-green-600'
                }`}>
                  {cartMessage[product._id]}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

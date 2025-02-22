'use client';

import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { FaShoppingCart } from 'react-icons/fa';
import Link from 'next/link';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks' | 'Beverages' | 'Desserts';
  isAvailable: boolean;
}

interface CartResponse {
  message: string;
  cartItemsCount: number;
}

interface ErrorResponse {
  message: string;
}

const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Beverages', 'Desserts'] as const;

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
  const [cartMessage, setCartMessage] = useState<{ [key: string]: string }>({});
  const [cartItemsCount, setCartItemsCount] = useState<number>(0);

  useEffect(() => {
    fetchProducts();
    fetchCartCount();
  }, [selectedCategory]); // Refetch when category changes

  const fetchProducts = async () => {
    try {
      const url = selectedCategory
        ? `http://localhost:5000/api/products/category/${selectedCategory}`
        : 'http://localhost:5000/api/products';
      
      const response = await axios.get<Product[]>(url);
      setProducts(response.data);
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
      setCartItemsCount(response.data.count);
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  const handleAddToCart = async (productId: string) => {
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
      setCartItemsCount(response.data.cartItemsCount);

      setTimeout(() => {
        setCartMessage(prev => ({ ...prev, [productId]: '' }));
      }, 3000);
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      setCartMessage(prev => ({
        ...prev,
        [productId]: err.response?.data?.message || 'Failed to add to cart',
      }));
    } finally {
      setLoadingStates(prev => ({ ...prev, [productId]: false }));
    }
  };

  const groupProductsByCategory = (products: Product[]) => {
    return products.reduce((acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = [];
      }
      acc[product.category].push(product);
      return acc;
    }, {} as { [key: string]: Product[] });
  };

  const productsByCategory = selectedCategory 
    ? { [selectedCategory]: products }
    : groupProductsByCategory(products);

  return (
    <div className="relative min-h-screen bg-gray-100">
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
        <h1 className="text-3xl font-bold mb-6">Our Menu</h1>

        {/* Category Filter */}
        <div className="mb-8">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 border rounded-md shadow-sm"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Products by Category with Availability Status */}
        {Object.entries(productsByCategory).map(([category, categoryProducts]) => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-2">
              {category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categoryProducts.map((product) => (
                <div key={product._id} 
                  className={`bg-white border rounded-lg shadow-md hover:shadow-lg transition-shadow relative
                    ${!product.isAvailable ? 'opacity-75' : ''}`}
                >
                  {/* Availability Badge */}
                  <div className={`absolute top-4 right-4 z-10 px-3 py-1 rounded-full text-sm font-medium
                    ${product.isAvailable 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'}`}
                  >
                    {product.isAvailable ? 'Available' : 'Out of Stock'}
                  </div>

                  {product.imageUrl && (
                    <div className="relative">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      {!product.isAvailable && (
                        <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center rounded-t-lg">
                          <span className="text-white text-lg font-semibold">
                            Currently Unavailable
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-gray-800">{product.name}</h3>
                    <p className="mt-2 text-gray-600">{product.description}</p>
                    <p className="mt-2 text-lg font-semibold text-gray-800">
                      ${product.price.toFixed(2)}
                    </p>
                    
                    {product.isAvailable ? (
                      <div className="mt-4 space-y-2">
                        <button
                          onClick={() => handleAddToCart(product._id)}
                          disabled={loadingStates[product._id]}
                          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 
                            transition duration-300 disabled:bg-gray-400 flex items-center justify-center"
                        >
                          {loadingStates[product._id] ? (
                            <>
                              <span className="animate-spin mr-2">⌛</span>
                              Adding...
                            </>
                          ) : (
                            'Add to Cart'
                          )}
                        </button>
                        
                        {cartMessage[product._id] && (
                          <p className={`text-sm text-center ${
                            cartMessage[product._id].includes('Failed') || 
                            cartMessage[product._id].includes('Please log in') 
                              ? 'text-red-600' 
                              : 'text-green-600'
                          }`}>
                            {cartMessage[product._id]}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="mt-4">
                        <button
                          disabled
                          className="w-full bg-gray-300 text-gray-500 px-4 py-2 rounded-md cursor-not-allowed"
                        >
                          Out of Stock
                        </button>
                        <p className="text-sm text-center text-gray-500 mt-2">
                          This item is currently unavailable
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

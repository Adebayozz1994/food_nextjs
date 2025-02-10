'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Define a TypeScript interface for Product
interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [cartMessage, setCartMessage] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    axios
      .get<Product[]>('http://localhost:5000/api/products')
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load products');
      });
  }, []);

  // Function to handle "Add to Cart"
  const handleAddToCart = async (productId: string) => {
    setLoading(true);
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("No token found. Please log in first.");
        setCartMessage((prev) => ({
          ...prev,
          [productId]: 'User not authenticated',
        }));
        setLoading(false);
        return;
      }

      const { data } = await axios.post(
        'http://localhost:5000/api/cart/add',
        { productId, quantity: 1 },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      console.log('Cart Response:', data);

      setCartMessage((prev) => ({
        ...prev,
        [productId]: data.message || 'Added to cart!',
      }));

      setTimeout(() => {
        setCartMessage((prev) => ({
          ...prev,
          [productId]: '',
        }));
      }, 3000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setCartMessage((prev) => ({
        ...prev,
        [productId]: 'Failed to add to cart',
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Our Products</h1>
        {error && <p className="text-red-500">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="border p-4 rounded shadow">
              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-48 object-cover mb-4"
                />
              )}
              <h2 className="text-xl font-bold">{product.name}</h2>
              <p className="mt-2 text-gray-700">${product.price}</p>
              {product.description && <p className="mt-2">{product.description}</p>}

              {/* Add to Cart Button */}
              <button
                onClick={() => handleAddToCart(product._id)}
                disabled={loading}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300 disabled:bg-gray-400"
              >
                {loading ? 'Adding...' : 'Add to Cart'}
              </button>

              {/* Feedback message */}
              {cartMessage[product._id] && (
                <p className="text-sm text-green-600 mt-2">{cartMessage[product._id]}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

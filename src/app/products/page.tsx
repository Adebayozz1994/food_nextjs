// pages/food/products.tsx
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
              <p className="mt-2">${product.price}</p>
              {product.description && (
                <p className="mt-2">{product.description}</p>
              )}
              {/* Optionally, you can add an "Add to Cart" button here */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

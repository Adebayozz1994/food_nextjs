'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';

// Define Product interface
interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks' | 'Beverages' | 'Desserts';
  isAvailable: boolean;
}

const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Beverages', 'Desserts'] as const;

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string>('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState<Product['category']>('Breakfast');
  const [isLoading, setIsLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null); // Track product being edited
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  // Fetch products with optional category filter
  const fetchProducts = async () => {
    if (!token) return;
    try {
      const url = selectedCategory
        ? `https://food-delivery-node-h1lq.onrender.com/api/admin/products/category/${selectedCategory}`
        : 'https://food-delivery-node-h1lq.onrender.com/api/admin/products';
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data.products || response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load products');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [token, selectedCategory]);

  // Handle product deletion
  const handleDelete = async (productId: string) => {
    try {
      await axios.delete(`https://food-delivery-node-h1lq.onrender.com/api/admin/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts((prevProducts) => prevProducts.filter((prod) => prod._id !== productId));
    } catch (err) {
      console.error(err);
      setError('Failed to delete product');
    }
  };

  // Handle adding a new product
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !price || !imageUrl || !category) {
      setError('All fields are required.');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await axios.post(
        'https://food-delivery-node-h1lq.onrender.com/api/admin/products',
        { name, description, price: parseFloat(price), imageUrl, category },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProducts([...products, response.data.product]);
      resetForm();
    } catch (err) {
      console.error(err);
      setError('Failed to create product');
    }
    setIsLoading(false);
  };

  // Handle clicking the Edit button
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price.toString());
    setImageUrl(product.imageUrl);
    setCategory(product.category);
  };

  // Handle updating an existing product
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const response = await axios.put(
        `https://food-delivery-node-h1lq.onrender.com/api/admin/products/${editingProduct._id}`,
        { name, description, price: parseFloat(price), imageUrl, category },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProducts((prevProducts) =>
        prevProducts.map((prod) =>
          prod._id === editingProduct._id ? response.data.product : prod
        )
      );

      resetForm();
    } catch (err) {
      console.error(err);
      setError('Failed to update product');
    }
  };

  // Reset the form and exit edit mode
  const resetForm = () => {
    setEditingProduct(null);
    setName('');
    setDescription('');
    setPrice('');
    setImageUrl('');
    setCategory('Breakfast');
    setError('');
  };

  const handleToggleAvailability = async (productId: string) => {
    try {
      const response = await axios.patch(
        `https://food-delivery-node-h1lq.onrender.com/api/admin/products/${productId}/toggle-availability`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setProducts(prevProducts =>
        prevProducts.map(prod =>
          prod._id === productId ? response.data.product : prod
        )
      );
    } catch (err) {
      console.error(err);
      setError('Failed to toggle product availability');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Products</h1>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Category Filter */}
      <div className="mb-6">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Product Creation / Edit Form */}
      <div className="mb-6 p-4 border rounded shadow-lg bg-gray-100">
        <h2 className="text-2xl font-semibold mb-4">
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </h2>
        <form onSubmit={editingProduct ? handleUpdate : handleCreate} className="grid gap-4">
          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 border rounded"
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="p-2 border rounded"
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="p-2 border rounded"
            required
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Product['category'])}
            className="p-2 border rounded"
            required
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : editingProduct ? 'Update Product' : 'Add Product'}
            </button>
            {editingProduct && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white py-2 px-4 rounded"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Product List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product._id} className="border p-4 rounded shadow">
            {product.imageUrl && (
              <Image src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover mb-4" />
            )}
            <h2 className="text-xl font-bold">{product.name}</h2>
            <p className="text-gray-700">{product.description}</p>
            <p className="mt-2">${product.price.toFixed(2)}</p>
            <p className="text-sm text-gray-600">Category: {product.category}</p>
            <p className={`text-sm ${product.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
              Status: {product.isAvailable ? 'Available' : 'Unavailable'}
            </p>
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => handleEdit(product)}
                className="bg-yellow-500 text-white py-1 px-3 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product._id)}
                className="bg-red-500 text-white py-1 px-3 rounded"
              >
                Delete
              </button>
              <button
                onClick={() => handleToggleAvailability(product._id)}
                className={`py-1 px-3 rounded text-white ${
                  product.isAvailable ? 'bg-orange-500' : 'bg-green-500'
                }`}
              >
                {product.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

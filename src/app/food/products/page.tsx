"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaShoppingCart, FaSpinner } from "react-icons/fa";
import Link from "next/link";
// import Navbar from "@/Components/Navbar/page";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category:
    | "Breakfast"
    | "Lunch"
    | "Dinner"
    | "Snacks"
    | "Beverages"
    | "Desserts";
  isAvailable: boolean;
}

interface CartItem {
  product: Product | null;
  quantity: number;
}

interface CartData {
  items: CartItem[];
}

const CATEGORIES = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snacks",
  "Beverages",
  "Desserts",
] as const;

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loadingStates, setLoadingStates] = useState<{
    [key: string]: boolean;
  }>({});
  const [cartMessage, setCartMessage] = useState<{ [key: string]: string }>({});
  const [cartItemsCount, setCartItemsCount] = useState<number>(0);

  useEffect(() => {
    fetchProducts();
    fetchCartCount();

    // Listen for cart updates
    window.addEventListener("cartUpdated", fetchCartCount);
    window.addEventListener("clearCart", () => setCartItemsCount(0));

    return () => {
      window.removeEventListener("cartUpdated", fetchCartCount);
      window.removeEventListener("clearCart", () => setCartItemsCount(0));
    };
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      let url = "http://localhost:5000/api/products";

      if (selectedCategory) {
        const encodedCategory = encodeURIComponent(selectedCategory);
        url = `http://localhost:5000/api/products?category=${encodedCategory}`;
      }

      const response = await axios.get<Product[]>(url);
      setProducts(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. unauthorised User.");
      setProducts([]);
    }
  };

  const fetchCartCount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setCartItemsCount(0);
        return;
      }

      const response = await axios.get<CartData>(
        "http://localhost:5000/api/cart",
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      const totalItems = response.data.items
        .filter((item: CartItem) => item.product !== null)
        .reduce((sum: number, item: CartItem) => sum + (item.quantity || 0), 0);

      setCartItemsCount(totalItems);
    } catch (err) {
      console.error("Error fetching cart count:", err);
      setCartItemsCount(0);
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      setLoadingStates((prev) => ({ ...prev, [productId]: true }));
      const token = localStorage.getItem("token");

      if (!token) {
        setCartMessage((prev) => ({
          ...prev,
          [productId]: "Please log in to add items to cart",
        }));
        setCartItemsCount(0);
        return;
      }

      // Get current cart state
      const cartResponse = await axios.get<CartData>(
        "http://localhost:5000/api/cart",
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      const existingItem = cartResponse.data.items.find(
        (item: CartItem) => item.product?._id === productId
      );

      if (existingItem) {
        const newQuantity = existingItem.quantity + 1;
        await axios.put(
          "http://localhost:5000/api/cart/update",
          {
            productId,
            quantity: newQuantity,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setCartItemsCount((prev) => prev + 1);
      } else {
        await axios.post(
          "http://localhost:5000/api/cart/add",
          { productId, quantity: 1 },
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setCartItemsCount((prev) => prev + 1);
      }

      setCartMessage((prev) => ({
        ...prev,
        [productId]: "Added to cart successfully!",
      }));

      window.dispatchEvent(new Event("cartUpdated"));

      setTimeout(() => {
        setCartMessage((prev) => {
          const newMessages = { ...prev };
          delete newMessages[productId];
          return newMessages;
        });
      }, 2000);
    } catch (err) {
      console.error("Error adding to cart:", err);
      setCartMessage((prev) => ({
        ...prev,
        [productId]: "Failed to add to cart. Please try again.",
      }));
    } finally {
      setLoadingStates((prev) => ({ ...prev, [productId]: false }));
    }
  };

  // Group products by category
  const groupProductsByCategory = (
    products: Product[]
  ): Record<string, Product[]> => {
    return products.reduce((acc, product) => {
      const category = product.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    }, {} as Record<string, Product[]>);
  };

  const productsByCategory = selectedCategory
    ? {
        [selectedCategory]: products.filter(
          (p) => p.category === selectedCategory
        ),
      }
    : groupProductsByCategory(products);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Navbar /> */}

      <div className="relative pt-16">
        {/* Cart Icon */}
        <Link href="/food/cartpage" className="fixed top-20 right-6 z-50">
          <div className="relative p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group">
            <FaShoppingCart className="text-2xl text-blue-600 group-hover:text-blue-700" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold animate-pulse">
                {cartItemsCount}
              </span>
            )}
          </div>
        </Link>

        <div className="container mx-auto px-6 py-8">
          {/* Category Filter */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Our Menu</h1>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white text-gray-700"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-md">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Products Grid */}
          {Object.entries(productsByCategory).map(
            ([category, categoryProducts]) => (
              <div key={category} className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b border-gray-200 pb-2">
                  {category}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {categoryProducts.map((product) => (
                    <div
                      key={product._id}
                      className={`bg-white rounded-xl shadow overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
            ${!product.isAvailable ? "opacity-75" : ""}`}
                    >
                      {/* Product Image */}
                      <div className="relative h-48">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        {/* Availability Badge */}
                        <div
                          className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold shadow-md
              ${
                product.isAvailable
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
              }`}
                        >
                          {product.isAvailable ? "Available" : "Out of Stock"}
                        </div>
                        {!product.isAvailable && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
                            <span className="text-white text-sm font-semibold px-4 py-2 bg-black bg-opacity-50 rounded">
                              Currently Unavailable
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="p-4">
                        <h3 className="text-lg font-bold text-gray-800 mb-1">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-lg font-bold text-blue-600">
                            ${product.price.toFixed(2)}
                          </span>
                        </div>

                        {product.isAvailable ? (
                          <div className="space-y-2">
                            <button
                              onClick={() => handleAddToCart(product._id)}
                              disabled={loadingStates[product._id]}
                              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 
                    transition-colors duration-300 disabled:bg-gray-400 flex items-center justify-center
                    transform hover:scale-[1.02] active:scale-[0.98] text-base font-semibold"
                            >
                              {loadingStates[product._id] ? (
                                <>
                                  <FaSpinner className="animate-spin mr-2" />
                                  Adding...
                                </>
                              ) : (
                                "Add to Cart"
                              )}
                            </button>

                            {cartMessage[product._id] && (
                              <div
                                className={`text-xs text-center p-2 rounded-lg ${
                                  cartMessage[product._id].includes("Failed") ||
                                  cartMessage[product._id].includes(
                                    "Please log in"
                                  )
                                    ? "bg-red-50 text-red-600"
                                    : "bg-green-50 text-green-600"
                                }`}
                              >
                                {cartMessage[product._id]}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <button
                              disabled
                              className="w-full bg-gray-200 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed text-base"
                            >
                              Out of Stock
                            </button>
                            <p className="text-xs text-center text-gray-500">
                              This item is currently unavailable
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaMotorcycle, FaUtensils, FaClock, FaStar } from "react-icons/fa";
import Image from "next/image";

interface User {
  email: string;
  // add other fields as needed (firstName, etc.)
}

const MainPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Load the user from localStorage if present
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const navigateToLogin = () => {
    router.push("/food/login");
  };

  const navigateToSignup = () => {
    router.push("/food/signup");
  };

  const navigateToProduct = () => {
    router.push("/food/products");
  };

  const handleLogout = () => {
    // Remove user details and token from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/food/login");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-md fixed w-full z-50">
        <div className="container mx-auto px-6 py-3">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-blue-600">FoodExpress</div>
            <div className="space-x-4">
              {user ? (
                // If user is logged in, display email and logout button
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600">{user.email}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                // If not logged in, show login and signup buttons
                <>
                  <button
                    onClick={navigateToLogin}
                    className="text-gray-600 hover:text-blue-600"
                  >
                    Login
                  </button>
                  <button
                    onClick={navigateToSignup}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-16">
        <div className="relative h-auto md:h-[600px] bg-gradient-to-r from-blue-600 to-blue-400">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="container mx-auto px-6 relative z-10 h-full flex flex-col-reverse md:flex-row items-center">
            <div className="w-full md:w-1/2 text-white p-2">
              <h1 className="text-5xl font-bold mb-6">
                Delicious Food
                <br />
                Delivered To Your Door
              </h1>
              <p className="text-xl mb-8">
                Order from your favorite restaurants and get food delivered
                right to your doorstep.
              </p>
              <button
                onClick={navigateToProduct}
                className="bg-yellow-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-yellow-600 transition-colors"
              >
                Order Now
              </button>
            </div>
            <div className="w-full md:w-1/2 pl-0 md:pl-12 mt-8 md:mt-0">
              <div className="relative w-full h-[300px] md:h-[500px] m-4">
                <Image
                  src="/images/delivery.PNG" 
                  alt="Delivery Image"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-300 object-cover"
                />
               
                <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-lg shadow-lg">
                  <div className="text-blue-600 font-bold text-xl">30 min</div>
                  <div className="text-gray-600 text-sm">Fast Delivery</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaMotorcycle className="text-2xl text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Quick and reliable delivery to your location
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUtensils className="text-2xl text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Quality Food</h3>
              <p className="text-gray-600">
                Fresh and high-quality meals from top restaurants
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaClock className="text-2xl text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">24/7 Service</h3>
              <p className="text-gray-600">
                Order anytime, we are always here for you
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaStar className="text-2xl text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Best Deals</h3>
              <p className="text-gray-600">
                Great offers and discounts on your orders
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Download App Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-4xl font-bold mb-6">Download Our App</h2>
              <p className="text-gray-600 mb-8">
                Get the best food delivery experience with our mobile app.
                Available for iOS and Android.
              </p>
              <div className="flex space-x-4">
                <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
                  App Store
                </button>
                <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
                  Google Play
                </button>
              </div>
            </div>
            <div className="relative w-full h-[200px] m-4">
              <Image
                src="https://img.freepik.com/premium-vector/download-page-mobile-app-empty-screen-smartphone-you-app-download-app_100456-10225.jpg?uid=R147290862&ga=GA1.1.1457401061.1705098422&semt=ais_hybrid"
                alt="Delicious Food"
                fill
                className="rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-300 object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">FoodExpress</h3>
              <p className="text-gray-400">
                Your favorite food delivery service
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  {/* SVG icon for Facebook */}
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Instagram</span>
                  {/* SVG icon for Instagram */}
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  {/* SVG icon for Twitter */}
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2025 FoodExpress. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainPage;

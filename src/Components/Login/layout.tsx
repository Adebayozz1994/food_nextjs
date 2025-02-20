import React, { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-red-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-red-600">Welcome Back</h1>
              <p className="text-gray-600 mt-2">Please login to continue</p>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;

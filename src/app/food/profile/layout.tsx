import React, { ReactNode } from "react";
import { Toaster } from 'react-hot-toast';
import "./globals.css";

type LayoutProps = {
  children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
};

export default Layout;

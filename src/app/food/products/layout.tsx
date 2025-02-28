import Navbar from "../../../components/Navbar/page";
import React, { ReactNode } from "react";
import "./globals.css";

type LayoutProps = {
  children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <Navbar/>
        {children}
      </body>
    </html>
  );
};

export default Layout;

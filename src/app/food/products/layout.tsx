// import Navbar from "../../../components/Navbar/page";
import React, { ReactNode } from "react";
import Navbar from "@/components/Navbar/page";

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

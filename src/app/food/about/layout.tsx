
import React, { ReactNode } from "react";



type LayoutProps = {
  children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
};

export default Layout;

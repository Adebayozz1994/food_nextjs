// src/app/layout.tsx
import React from 'react';
import { UserProvider } from '../Usercontext/UserProvider';
import Navbar from './page';


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <Navbar />
          {children}
        </UserProvider>
      </body>
    </html>
  );
}

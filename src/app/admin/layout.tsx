"use client";

import { UserProvider } from "../../components/Usercontext/page";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          {children} 
        </UserProvider>
      </body>
    </html>
  );
}

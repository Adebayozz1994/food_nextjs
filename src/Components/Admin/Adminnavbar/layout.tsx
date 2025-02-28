"use client";

import { UserProvider } from "@/components/Usercontext/page";

// import { UserProvider } from "../../Usercontext/page";



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

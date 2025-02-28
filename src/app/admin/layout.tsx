"use client";

import { UserProvider } from "@/app/Usercontext/UserProvider";



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

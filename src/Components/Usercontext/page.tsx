"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";

// Define User type
interface User {
  firstName: string;
  lastName: string;
  email: string;
  // Add other fields if necessary
}

// Define UserContext type
interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

// Create Context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Custom Hook
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// Provider Component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Load user data from localStorage on mount (client-side only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userFromStorage = localStorage.getItem("user");
      if (userFromStorage) {
        setUser(JSON.parse(userFromStorage));
      }
    }
  }, []);

  // Save user to localStorage when updated
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        localStorage.removeItem("user");
      }
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};


"use client";

import { createContext, useContext, useState, useEffect, PropsWithChildren } from "react";

export type UserProfile = {
  id: string;
  email: string;
  name: string | null;
  phone_number: string | null;
  isadmin: boolean;
  ispropertyowner: boolean;
};

type UserContextType = {
  user: UserProfile | null;
    loadingUser: boolean;
  actions: {
    signin: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    fetchActiveUser: () => Promise<void>;
  };
};

const defaultState: UserContextType = {
  user: null,
  loadingUser: true,
  actions: {
    signin: async () => {},
    logout: async () => {},
    fetchActiveUser: async () => {},
  },
};

const UserContext = createContext(defaultState);

export function UserProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loadingUser, setLoadingUser] = useState(true); 

  const fetchActiveUser = async () => {
    try {
      setLoadingUser(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/activeUser`, {
        credentials: "include", 
      });

      if (!res.ok) throw new Error("Not authenticated");
  
        const data = await res.json();
        setUser(data.user);
      
    } catch {
      setUser(null);
    } finally{
      setLoadingUser(false);
    }
  };

  const signin = async (email: string, password: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Login failed");

    await fetchActiveUser();
  };

  const logout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  };

  useEffect(() => {
    fetchActiveUser();
  }, []);

   if (loadingUser) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-solid"></div>
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ user, loadingUser, actions: { signin, logout, fetchActiveUser } }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);

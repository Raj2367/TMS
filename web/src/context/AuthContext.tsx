"use client";

import { createContext, useContext, useState, useEffect } from "react";
import api, { setToken, removeToken, getToken } from "@/lib/api";
import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = getToken();

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Fetch real user data from your backend
        const res = await api.get("/auth/me");
        setUser(res.data.user);
      } catch (error) {
        // Token is invalid or expired — clean up
        console.error("Failed to load user:", error);
        removeToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    const { token, user } = res.data;

    setToken(token);
    setUser(user);
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await api.post("/auth/register", { name, email, password });
    const { token, user } = res.data;

    setToken(token);
    setUser(user);
  };

  const logout = () => {
    removeToken();
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}

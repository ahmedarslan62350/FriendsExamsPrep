"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

import { loginUser, registerUser } from "@/lib/api";
import { type ApiUser } from "@/lib/types";

type AuthContextValue = {
  token: string | null;
  user: ApiUser | null;
  isLoading: boolean;
  login: (payload: { email: string; password: string }) => Promise<void>;
  register: (payload: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = "boards-battle-token";
const USER_KEY = "boards-battle-user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }
    return window.localStorage.getItem(TOKEN_KEY);
  });
  const [user, setUser] = useState<ApiUser | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }
    const storedUser = window.localStorage.getItem(USER_KEY);
    return storedUser ? (JSON.parse(storedUser) as ApiUser) : null;
  });
  const [isLoading] = useState(false);

  const persist = (nextToken: string, nextUser: ApiUser) => {
    setToken(nextToken);
    setUser(nextUser);
    window.localStorage.setItem(TOKEN_KEY, nextToken);
    window.localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
  };

  const login = useCallback(async (payload: { email: string; password: string }) => {
    const response = await loginUser(payload);
    persist(response.token, response.user);
  }, []);

  const register = useCallback(async (payload: { name: string; email: string; password: string }) => {
    const response = await registerUser(payload);
    persist(response.token, response.user);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      isLoading,
      login,
      register,
      logout,
    }),
    [token, user, isLoading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}

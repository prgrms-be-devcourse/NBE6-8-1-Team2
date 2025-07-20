"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "@/lib/apiFetch";
import { User } from "@/types/auth";

type AuthContextType = {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: User | null;
  isAdmin: boolean;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 초기 mount 시 서버로 로그인 상태 확인
  useEffect(() => {
    (async () => {
      try {
        const userData = await apiFetch("/auth/me"); // 로그인된 유저 정보 확인
        setUser(userData);
        setIsLoggedIn(true);
      } catch {
        setUser(null);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = () => setIsLoggedIn(true);

  const logout = async () => {
    try {
      await apiFetch("/logout", { method: "POST" });
      setUser(null);
      setIsLoggedIn(false);
    } catch (err: any) {
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, user, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth는 <AuthProvider> 내부에서만 사용할 수 있습니다.");
  }
  return ctx;
}

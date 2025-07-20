"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "@/lib/apiFetch";

type User = {
  email: string;
  nickname: string;
  address: string;
  role: "ADMIN" | "USER";
};

type AuthContextType = {
  isLoggedIn: boolean;
  user: User | null;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // 초기 mount 시 로그인 상태 및 사용자 정보 확인
  useEffect(() => {
    (async () => {
      try {
        const userData = await apiFetch<User>("/auth/me");
        setUser(userData);
        setIsLoggedIn(true);
      } catch {
        setUser(null);
        setIsLoggedIn(false);
      }
    })();
  }, []);

  const login = () => {
    setIsLoggedIn(true);
    apiFetch<User>("/auth/me")
      .then(setUser)
      .catch(() => {
        setIsLoggedIn(false);
        setUser(null);
      });
  };

  const logout = async () => {
    try {
      await apiFetch("/logout", { method: "POST" });
    } catch {}
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
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

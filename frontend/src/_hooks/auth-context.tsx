"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { removeToken, getToken } from "@/lib/authService";

type AuthContextType = {
  isLoggedIn: boolean;
  login: () => void;   // 전역 상태 true
  logout: () => void;  // 전역 상태 false + 토큰 제거
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 초기 mount 시 localStorage token 검사
  useEffect(() => {
    const token = getToken();
    setIsLoggedIn(!!token);
  }, []);

  const login = () => setIsLoggedIn(true);

  const logout = () => {
    removeToken();
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
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

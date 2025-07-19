// src/_contexts/CartContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { CartItem } from "@/types";

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (menuId: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // localStorage 초기화
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      setCart(JSON.parse(stored));
    }
  }, []);

  // cart 바뀔 때마다 localStorage에 저장
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const exists = prev.find((i) => i.menu.id === item.menu.id);
      if (exists) {
        return prev.map((i) =>
          i.menu.id === item.menu.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (menuId: number) => {
    setCart((prev) => prev.filter((item) => item.menu.id !== menuId));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart는 <CartProvider> 내부에서만 사용해야 합니다.");
  return context;
}

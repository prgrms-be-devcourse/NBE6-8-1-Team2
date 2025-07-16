"use client";

import { useEffect, useState, useCallback } from "react";
import { apiFetch } from "@/lib/apiFetch";
import { MenuItem, CartItem } from "@/types";
import { useOrder } from "@/hooks/useOrder";
import { MenuCard } from "@/components/order/MenuCard";
import { CartItemCard } from "@/components/order/CartItemCard";
import { ErrorMessage } from "@/components/ui/ErrorMessage";

export default function OrderPage() {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const { order, isLoading, errorMessage } = useOrder();

  /*
  // 테스트용 메뉴 목록
  useEffect(() => {
    const mockMenus: MenuItem[] = [
      {
        id: 1,
        name: "아메리카노",
        description: "시원한 아이스 아메리카노",
        price: 3000,
      },
      {
        id: 2,
        name: "카페라떼",
        description: "부드러운 우유 거품의 라떼",
        price: 4000,
      },
    ];

    setMenus(mockMenus);
  }, []);
  */

  useEffect(() => {
    apiFetch<MenuItem[]>("/api/menus")
      .then(setMenus)
      .catch((err) => alert("메뉴 불러오기 실패: " + err.message));
  }, []);

  const handleAddToCart = useCallback((menu: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.menu.id === menu.id);
      if (existing) {
        return prev.map((item) =>
          item.menu.id === menu.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { menu, quantity: 1 }];
      }
    });
  }, []);

  const handleIncrease = useCallback((id: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.menu.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }, []);

  const handleDecrease = useCallback((id: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.menu.id === id
            ? { ...item, quantity: Math.max(0, item.quantity - 1) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const handleRemove = useCallback((id: number) => {
    setCart((prev) => prev.filter((item) => item.menu.id !== id));
  }, []);

  const handleOrder = () => {
    order(cart);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">메뉴</h1>

      <div className="space-y-4">
        {menus.map((menu) => (
          <MenuCard key={menu.id} menu={menu} onAdd={() => handleAddToCart(menu)} />
        ))}
      </div>

      <h2 className="text-lg font-bold mt-8">장바구니</h2>

      {cart.length === 0 ? (
        <p className="text-gray-500 mt-2">담은 메뉴가 없습니다.</p>
      ) : (
        <div className="space-y-2 mt-4">
          {cart.map((item) => (
            <CartItemCard
              key={item.menu.id}
              item={item}
              onIncrease={() => handleIncrease(item.menu.id)}
              onDecrease={() => handleDecrease(item.menu.id)}
              onRemove={() => handleRemove(item.menu.id)}
            />
          ))}
        </div>
      )}

      <p className="mt-4 text-right font-bold text-lg">
        총 결제 금액: ₩
        {cart
          .reduce((sum, item) => sum + item.menu.price * item.quantity, 0)
          .toLocaleString()}
      </p>

      <button
        type="button"
        onClick={handleOrder}
        disabled={isLoading}
        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
      >
        {isLoading ? "결제 처리 중..." : "결제하기"}
      </button>

      <ErrorMessage message={errorMessage} />
    </div>
  );
}

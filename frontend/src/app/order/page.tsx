"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/apiFetch";
import { MenuItem, CartItem } from "@/types";
import { useOrder } from "@/hooks/useOrder";

export default function OrderPage() {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const { order, isLoading, errorMessage } = useOrder();

  useEffect(() => {
    apiFetch<MenuItem[]>("/api/menus")
      .then(setMenus)
      .catch((err) => alert("메뉴 불러오기 실패: " + err.message));
  }, []);

  const handleAddToCart = (menu: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.menu.id === menu.id);
      if (existing) {
        return prev.map((item) =>
          item.menu.id === menu.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prev, { menu, quantity: 1 }];
      }
    });
  };

  const handleOrder = () => {
    order(cart);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">메뉴</h1>

      <div className="space-y-4">
        {menus.map((menu) => (
          <div key={menu.id} className="border p-4 rounded shadow-sm flex justify-between items-center">
            <div>
              <p className="font-semibold">{menu.name}</p>
              <p className="text-sm text-gray-500">{menu.description}</p>
              <p className="text-sm">₩{menu.price.toLocaleString()}</p>
            </div>
            <button
              onClick={() => handleAddToCart(menu)}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              담기
            </button>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-bold mt-8">장바구니</h2>

      {cart.length === 0 ? (
        <p className="text-gray-500 mt-2">담은 메뉴가 없습니다.</p>
      ) : (
        <div className="space-y-2 mt-4">
          {cart.map((item) => (
            <div key={item.menu.id} className="border p-3 flex justify-between items-center rounded">
              <div>
                <p className="font-semibold">{item.menu.name}</p>
                <p className="text-sm text-gray-500">
                  ₩{item.menu.price.toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setCart((prev) =>
                      prev.map((c) =>
                        c.menu.id === item.menu.id
                          ? { ...c, quantity: Math.max(0, c.quantity - 1) }
                          : c
                      ).filter((c) => c.quantity > 0)
                    )
                  }
                  className="px-2 py-1 bg-gray-300 rounded"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  type="button"
                  onClick={() =>
                    setCart((prev) =>
                      prev.map((c) =>
                        c.menu.id === item.menu.id ? { ...c, quantity: c.quantity + 1 } : c
                      )
                    )
                  }
                  className="px-2 py-1 bg-gray-300 rounded"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setCart((prev) =>
                      prev.filter((c) => c.menu.id !== item.menu.id)
                    )
                  }
                  className="px-2 py-1 bg-red-400 text-white rounded"
                >
                  삭제
                </button>
              </div>
            </div>
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
    </div>
  );
}
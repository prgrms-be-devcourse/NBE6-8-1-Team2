"use client";

import { useEffect, useState, useCallback } from "react";
import { apiFetch } from "@/lib/apiFetch";
import { MenuItem, CartItem } from "@/types";
import { useOrder } from "@/_hooks/useOrder";
import { MenuCard } from "@/_components/order/MenuCard";
import { CartItemCard } from "@/_components/order/CartItemCard";
import { ErrorMessage } from "@/_components/ui/ErrorMessage";
import { useAuth } from "@/_hooks/auth-context";
import { toast } from "react-toastify";

export default function OrderPage() {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const { order, isLoading, errorMessage } = useOrder();
  const { isLoggedIn } = useAuth(); 

  useEffect(() => {
    apiFetch<MenuItem[]>("/menus")
      .then(setMenus)
      .catch((err) => toast.error("메뉴 불러오기 실패: " + err.message));
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
    if (!isLoggedIn) {
      toast.error("로그인 후 결제할 수 있습니다.");
      return;
    }
    order(cart); // useOrder 훅에서 POST + 이동 처리
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.menu.price * item.quantity,
    0
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white">
      {/* 메뉴 영역 */}
      <div className="w-full lg:w-2/3 p-6">
        <h1 className="text-2xl font-bold mb-6">주문</h1>

        {/* 카테고리 (더미) */}
        <div className="flex gap-2 mb-6">
          {["커피", "음료", "디저트", "샌드위치", "기타"].map((cat, idx) => (
            <button
              key={idx}
              className="px-4 py-2 bg-gray-200 text-sm rounded hover:bg-gray-300 transition"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 메뉴 카드 리스트 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {menus.map((menu) => (
            <MenuCard key={menu.id} menu={menu} onAdd={() => handleAddToCart(menu)} />
          ))}
        </div>
      </div>

      {/* 장바구니 영역 */}
      <div className="w-full lg:w-1/3 border-l border-gray-200 p-6 bg-gray-50">
        <h2 className="text-xl font-bold mb-4">Cart</h2>

        {cart.length === 0 ? (
          <p className="text-gray-500">장바구니가 비어 있습니다.</p>
        ) : (
          <div className="space-y-4">
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

        {/* 총 금액 */}
        <p className="mt-6 text-right font-semibold text-lg">
          총 결제 금액 : ₩{totalPrice.toLocaleString()}
        </p>

        {/* 결제 버튼 */}
        <button
          type="button"
          onClick={handleOrder}
          disabled={isLoading || !isLoggedIn}
          className={`mt-4 w-full font-semibold py-3 rounded transition ${
            isLoggedIn
              ? "bg-black text-white hover:bg-gray-900"
              : "bg-gray-400 text-white cursor-not-allowed"
          }`}
        >
          {isLoading ? "결제 처리 중..." : "결제하기"}
        </button>

        {/* 로그인 안내 */}
        {!isLoggedIn && (
          <p className="mt-2 text-sm text-red-500 text-center">
            로그인 후 결제할 수 있습니다.
          </p>
        )}

        <ErrorMessage message={errorMessage} />
      </div>
    </div>
  );
}

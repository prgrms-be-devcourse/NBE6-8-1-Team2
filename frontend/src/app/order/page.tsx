"use client";

import { useEffect, useState, useCallback } from "react";
import { apiFetch } from "@/lib/apiFetch";
import { MenuItem } from "@/types";
import { useOrder } from "@/_hooks/useOrder";
import { MenuCard } from "@/_components/order/MenuCard";
import { CartItemCard } from "@/_components/order/CartItemCard";
import { ErrorMessage } from "@/_components/ui/ErrorMessage";
import { useAuth } from "@/_hooks/auth-context";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/_contexts/CartContext"; 

export default function OrderPage() {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const { order, isLoading, errorMessage } = useOrder();
  const { isLoggedIn } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const {
    cart,              
    addToCart,         
    removeFromCart,     
  } = useCart();

  useEffect(() => {
    apiFetch<MenuItem[]>("/menus")
      .then(setMenus)
      .catch((err) => toast.error("메뉴 불러오기 실패: " + err.message));
  }, []);

  const handleAddToCart = useCallback((menu: MenuItem) => {
    addToCart({ menu, quantity: 1 });
  }, [addToCart]);

  const handleIncrease = useCallback((id: number) => {
    const item = cart.find((i) => i.menu.id === id);
    if (item) {
      addToCart({ ...item, quantity: 1 }); 
    }
  }, [cart, addToCart]);

  const handleDecrease = useCallback((id: number) => {
    const item = cart.find((i) => i.menu.id === id);
    if (!item) return;
    if (item.quantity <= 1) {
      removeFromCart(id);
    } else {
      removeFromCart(id);
      addToCart({ menu: item.menu, quantity: item.quantity - 1 });
    }
  }, [cart, addToCart, removeFromCart]);

  const handleRemove = useCallback((id: number) => {
    removeFromCart(id);
  }, [removeFromCart]);

  const handleOrder = () => {
    if (!isLoggedIn) {
      toast.error("로그인 후 결제할 수 있습니다.");
      return;
    }
    order(cart);
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

        {/* 카테고리 버튼 */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[...new Set(menus.map((m) => m.category))].map((cat, idx) => (
            <button
              key={idx}
              onClick={() =>
                setSelectedCategory((prev) => (prev === cat ? null : cat))
              }
              className={`px-4 py-2 text-sm rounded transition ${
                selectedCategory === cat
                  ? "bg-black text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 메뉴 카드 리스트 */}
        <AnimatePresence mode="wait">
          {Object.entries(
            menus
              .filter((m) => !selectedCategory || m.category === selectedCategory)
              .reduce((acc, menu) => {
                if (!acc[menu.category]) acc[menu.category] = [];
                acc[menu.category].push(menu);
                return acc;
              }, {} as Record<string, MenuItem[]>)
          ).map(([category, groupedMenus]) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mb-6"
            >
              <h2 className="text-lg font-bold mb-2">{category}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {groupedMenus.map((menu) => (
                  <motion.div
                    key={menu.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MenuCard
                      menu={menu}
                      onAdd={() => handleAddToCart(menu)}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
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

        <p className="mt-6 text-right font-semibold text-lg">
          총 결제 금액 : ₩{totalPrice.toLocaleString()}
        </p>

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

        {!isLoggedIn && (
          <p className="mt-2 text-sm text-red-500 text-left">
            *로그인 후 결제할 수 있습니다.
          </p>
        )}

        <ErrorMessage message={errorMessage} />
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/apiFetch";
import { useRouter } from "next/navigation";

type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
};

type CartItem = {
  menu: MenuItem;
  quantity: number;
};

export default function OrderPage() {
  const router = useRouter();

  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

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

  const handleAddToCart = (menu: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.menu.id === menu.id);
      if (existing) {
        // 이미 담긴 메뉴 -> 수량 1 증가
        return prev.map((item) =>
          item.menu.id === menu.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // 새로 담는 메뉴
        return [...prev, { menu, quantity: 1 }];
      }
    });
  };

  const handleOrder = async () => {
    if (cart.length === 0) {
      alert("장바구니가 비어 있습니다.");
      return;
    }
  
    const items = cart.map((item) => ({
      menuId: item.menu.id,
      quantity: item.quantity,
    }));
  
    try {
      await apiFetch("/api/orders", {
        method: "POST",
        body: JSON.stringify({ items }),
      });
  
      alert("주문이 완료되었습니다.");
      router.push("/mypage");
    } catch (err: any) {
      alert(`주문 실패 : ${err.message}`);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">메뉴</h1>
  
      <div className="space-y-4">
        {menus.map((menu) => (
          <div
            key={menu.id}
            className="border p-4 rounded shadow-sm flex justify-between items-center"
          >
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
            <div
              key={item.menu.id}
              className="border p-3 flex justify-between items-center rounded"
            >
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
                      prev
                        .map((c) =>
                          c.menu.id === item.menu.id
                            ? { ...c, quantity: Math.max(0, c.quantity - 1) }
                            : c
                        )
                        .filter((c) => c.quantity > 0)
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
                        c.menu.id === item.menu.id
                          ? { ...c, quantity: c.quantity + 1 }
                          : c
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
        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
      >
        결제하기
      </button>
    </div>
  );
}
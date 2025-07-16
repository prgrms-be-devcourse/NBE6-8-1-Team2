"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/apiFetch"; 
import { Order, OrderItem } from "@/types";

export default function MyPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // API 호출
    apiFetch<Order[]>("/api/myorder")
      .then((data) => {
        const sorted = data.sort( // 최신 순 정렬
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setOrders(sorted);
      })
      .catch((err) => {
        alert("주문 내역 불러오기 실패: " + err.message);
      });

    /*
    // 🔧 테스트용 데이터 
    const mockData: Order[] = [
      {
        orderId: 101,
        createdAt: "2025-07-14T13:23:12",
        totalPrice: 14500,
        orderItems: [
          { menuId: 1, name: "아메리카노", quantity: 2, price: 5000 },
          { menuId: 3, name: "카페라떼", quantity: 1, price: 4500 },
        ],
      },
      {
        orderId: 102,
        createdAt: "2025-07-15T09:12:00",
        totalPrice: 6000,
        orderItems: [
          { menuId: 2, name: "카푸치노", quantity: 1, price: 6000 },
        ],
      },
    ];

    const sorted = mockData.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setOrders(sorted);
    */
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">내 주문 내역</h1>

      {orders.length === 0 ? (
        <p>주문 내역이 없습니다.</p>
      ) : (
        <ul className="space-y-6">
          {orders.map((order) => (
            <li
              key={order.orderId}
              className="border p-4 rounded-xl shadow bg-white"
            >
              <p className="text-sm text-gray-500 mb-2">
                주문 일시: {new Date(order.createdAt).toLocaleString()}
              </p>
              <ul className="divide-y">
                {order.orderItems.map((item, index) => (
                  <li key={index} className="flex justify-between py-1">
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span>{item.price * item.quantity}원</span>
                  </li>
                ))}
              </ul>
              <p className="text-right mt-2 font-semibold">
                총 결제 금액: {order.totalPrice.toLocaleString()}원
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
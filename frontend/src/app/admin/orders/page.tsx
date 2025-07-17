"use client";

import { useEffect, useState } from "react";
import { Order, OrderItem } from "@/types"; // 공용 타입 사용

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ 테스트용 더미 데이터
  const dummyOrders: Order[] = [
    {
      orderId: 1001,
      userId: 1,
      email: "coffee@lover.com",
      createdAt: "2025-07-16T10:30:00",
      totalPrice: 18500,
      orderItems: [
        { menuId: 1, name: "아메리카노", quantity: 2, price: 5000 },
        { menuId: 2, name: "카페라떼", quantity: 1, price: 8500 },
      ],
    },
    {
      orderId: 1002,
      userId: 2,
      email: "latte@cafe.com",
      createdAt: "2025-07-16T11:15:00",
      totalPrice: 12000,
      orderItems: [
        { menuId: 3, name: "카푸치노", quantity: 2, price: 6000 },
      ],
    },
  ];

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:8080/admin/orders");
      if (!res.ok) throw new Error("주문 목록 불러오기 실패");

      const data: Order[] = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("API 실패 → 더미 데이터 사용");
      setOrders(dummyOrders); // ❗ 실패 시 더미데이터 사용
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <p className="text-center mt-10">로딩 중입니다...</p>;

  const summarizeOrderItems = (orderItems: OrderItem[]) =>
    orderItems.map((item) => `${item.name}×${item.quantity}`).join("<br />");

  return (
    <div>
      <h1 className="text-2xl font-title font-bold mb-6 text-black">
        전체 주문 목록 조회
      </h1>
      <div className="overflow-x-auto border border-gray-300">
        <table className="w-full table-auto text-sm text-left text-black bg-white">
          <thead className="bg-black text-white text-[13px] font-bold tracking-wide uppercase h-12">
            <tr>
              <th className="px-4 py-2 text-center">주문번호</th>
              <th className="px-4 py-2 text-center">주문일시</th>
              <th className="px-4 py-2 text-center">주문자 이메일</th>
              <th className="px-4 py-2 text-center">주문상품</th>
              <th className="px-4 py-2 text-center">총액</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {orders.map((order) => (
              <tr key={order.orderId} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-center font-medium">{order.orderId}</td>
                <td className="px-4 py-3 text-center">
                  {new Date(order.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-3">{order.email}</td>
                <td
                  className="px-4 py-3 text-left"
                  dangerouslySetInnerHTML={{
                    __html: summarizeOrderItems(order.orderItems),
                  }}
                ></td>
                <td className="px-4 py-3 text-right">
                  {order.totalPrice.toLocaleString()}원
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

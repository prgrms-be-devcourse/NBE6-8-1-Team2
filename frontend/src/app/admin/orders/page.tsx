"use client";

import { useEffect, useState } from "react";
import { Order, OrderItem } from "@/types"; // 공용 타입 사용

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:8080/admin/orders");
      if (!res.ok) throw new Error("주문 목록 불러오기 실패");

      const data: Order[] = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("주문 목록을 불러오는 중 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <p>로딩 중입니다...</p>;

  const summarizeOrderItems = (orderItems: OrderItem[]) =>
    orderItems.map((item) => `${item.name}×${item.quantity}`).join(", ");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">전체 주문 목록 조회</h1>

      <table className="w-full border-collapse bg-white shadow">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">주문번호</th>
            <th className="border p-2">주문일시</th>
            <th className="border p-2">주문자 이메일</th>
            <th className="border p-2">주문상품</th>
            <th className="border p-2">총액</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.orderId}>
              <td className="border p-2 text-center">{order.orderId}</td>
              <td className="border p-2 text-center">
                {new Date(order.createdAt).toLocaleString()}
              </td>
              <td className="border p-2">{order.email}</td>
              <td className="border p-2">{summarizeOrderItems(order.orderItems)}</td>
              <td className="border p-2 text-right">
                {order.totalPrice.toLocaleString()}원
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

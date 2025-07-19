"use client";

import { useEffect, useState } from "react";
import { Order, OrderItem } from "@/types";
import { apiFetch } from "@/lib/apiFetch";
import { toast } from "react-toastify";  // toastify 임포트

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await apiFetch<any>("/admin/orders");
      const data = response.data || response;; // 백엔드 응답 형태에 따라 조정
      setOrders(data.content);
    } catch (error) {
      console.error("주문 목록 불러오기 실패", error);
      toast.error("주문 데이터를 불러오는 데 실패했습니다.");  // toastify로 에러 표시
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
      <div className="overflow-x-auto border border-gray-300 rounded">
        <table className="w-full table-auto text-sm text-left text-black bg-white rounded">
          <thead className="bg-black text-white font-bold tracking-wide uppercase h-12 rounded">
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

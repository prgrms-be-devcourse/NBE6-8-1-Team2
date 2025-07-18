"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/apiFetch"; 
import { Order } from "@/types";
import { OrderCard } from "@/_components/mypage/OrderCard";
import { useAuth } from "@/_hooks/auth-context";
import { toast } from "react-toastify";

export default function MyPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      toast.error("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    // API 호출
    apiFetch<Order[]>("/myorder")
      .then((data) => {
        const sorted = data.sort( // 최신 순 정렬
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setOrders(sorted);
      })
      .catch((err) => {
        toast.error("주문 내역 불러오기 실패: " + err.message);
      });
  }, [isLoggedIn, router]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">내 주문 내역</h1>

      <div className="flex flex-col gap-6 max-h-[80vh] overflow-y-auto pr-2">
        {orders.map((order) => (
          <OrderCard key={order.orderId} order={order} />
        ))}
      </div>
    </div>
  );
}

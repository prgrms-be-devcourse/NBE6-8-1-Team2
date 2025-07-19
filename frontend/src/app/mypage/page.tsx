"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/apiFetch";
import { Order } from "@/types";
import { OrderCard } from "@/_components/mypage/OrderCard";
import { useAuth } from "@/_hooks/auth-context";
import { toast } from "react-toastify";

// 페이징 응답 타입
type PagedResponse<T> = {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
};

// 페이지네이션 범위 계산 함수
function getCompactPagination(current: number, total: number): (number | "...")[] {
  if (total <= 3) {
    return Array.from({ length: total }, (_, i) => i + 1); // 1, 2, 3
  }

  const result: (number | "...")[] = [1];

  if (current > 2) {
    result.push("...");
  }

  if (current !== 1 && current !== total) {
    result.push(current);
  }

  if (current < total - 1) {
    result.push("...");
  }

  if (total !== 1) {
    result.push(total);
  }

  return result;
}

export default function MyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoggedIn } = useAuth();

  const initialPage = Number(searchParams.get("page")) || 0;

  const [page, setPage] = useState(initialPage);
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalPages, setTotalPages] = useState(0);

  // URL 동기화
  useEffect(() => {
    router.replace(`/mypage?page=${page}`);
  }, [page, router]);

  useEffect(() => {
    if (!isLoggedIn) {
      toast.error("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    apiFetch<PagedResponse<Order>>(`/myorder?page=${page}&size=10`)
      .then((data) => {
        setOrders(data.content);
        setTotalPages(data.totalPages);
      })
      .catch((err) => {
        toast.error("주문 내역 불러오기 실패: " + err.message);
      });
  }, [isLoggedIn, page, router]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">내 주문 내역</h1>

      <div className="flex flex-col gap-6 max-h-[80vh] overflow-y-auto pr-2">
        {orders.length === 0 ? (
          <div className="text-center text-gray-500 mt-6">
            아직 주문 내역이 없습니다. <br />
            메뉴를 주문해보세요!
          </div>
        ) : (
          orders.map((order) => (
            <OrderCard key={order.orderId} order={order} />
          ))
        )}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center gap-2 mt-6">
          <div className="flex gap-1">
            {/* 이전 버튼 */}
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              disabled={page === 0}
              className="px-3 py-1 border rounded disabled:opacity-50 text-sm"
            >
              ◀
            </button>

            {/* 페이지 번호 */}
            {getCompactPagination(page + 1, totalPages).map((item, idx) => {
              if (item === "...") {
                return (
                  <span
                    key={idx}
                    className="px-2 py-1 text-gray-500 text-sm select-none"
                  >
                    ...
                  </span>
                );
              }

              const pageIndex = item - 1;
              const isActive = pageIndex === page;

              return (
                <button
                  key={idx}
                  onClick={() => setPage(pageIndex)}
                  className={`px-3 py-1 rounded border text-sm ${
                    isActive
                      ? "bg-black text-white"
                      : "bg-white text-black hover:bg-gray-100"
                  }`}
                >
                  {item}
                </button>
              );
            })}

            {/* 다음 버튼 */}
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
              disabled={page === totalPages - 1}
              className="px-3 py-1 border rounded disabled:opacity-50 text-sm"
            >
              ▶
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

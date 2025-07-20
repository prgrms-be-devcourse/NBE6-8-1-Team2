"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/_hooks/auth-context";
import { toast } from "react-toastify";
import { apiFetch } from "@/lib/apiFetch";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn, isLoading } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const [hasAdminAccess, setHasAdminAccess] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    
    if (!isLoggedIn) {
      toast.error("로그인이 필요합니다.");
      router.push(`/login?from=${pathname}`);
      return;
    }

    // 관리자 권한을 API 호출로 확인
    const checkAdminAccess = async () => {
      try {
        // 간단한 admin API 호출로 권한 확인 (예: admin/orders)
        await apiFetch("/admin/orders");
        setHasAdminAccess(true);
      } catch (error: any) {
        if (error.message?.includes("403") || error.message?.includes("권한")) {
          toast.error("관리자 권한이 없습니다.");
          router.push("/");
        } else if (error.message?.includes("401") || error.message?.includes("로그인")) {
          toast.error("로그인이 필요합니다.");
          router.push(`/login?from=${pathname}`);
        } else {
          // 기타 에러는 권한 없음으로 처리
          toast.error("관리자 권한이 없습니다.");
          router.push("/");
        }
        setHasAdminAccess(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAdminAccess();
  }, [isLoggedIn, isLoading, router, pathname]);

  if (isLoading || isChecking || !isLoggedIn || !hasAdminAccess) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      {/* 사이드바 */}
      <aside className="w-60 bg-black text-center text-white p-4">
        <h2 className="text-2xl font-bold mb-10">관리자 메뉴</h2>
        <nav className="flex flex-col gap-2 text-xl">
          <a
            href="/admin/orders"
            className="mb-2 px-4 py-2 hover:bg-neutral-800 transition-colors rounded"
          >
            주문 관리
          </a>
          <a
            href="/admin/menus"
            className="mb-2 px-4 py-2 hover:bg-neutral-800 transition-colors rounded"
          >
            메뉴 관리
          </a>
        </nav>
      </aside>

      {/* 메인 컨텐츠 */}
      <main className="flex-1 p-6 bg-gray-100">{children}</main>
    </div>
  );
}
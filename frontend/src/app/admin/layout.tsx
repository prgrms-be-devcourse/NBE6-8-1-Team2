"use client";

import { ReactNode, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/_hooks/auth-context";
import { toast } from "react-toastify";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      toast.error("로그인이 필요합니다.");
      router.push(`/login?from=${pathname}`);
    }
  }, [isLoggedIn, router, pathname]);

  if (!isLoggedIn) {
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
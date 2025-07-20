"use client";

import { useAuth } from "@/_hooks/auth-context";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const { isLoggedIn, user, logout } = useAuth();

  // 회원가입, 로그인 페이지에서는 헤더 숨김
  if (pathname === "/login" || pathname === "/signup") return null;

  const handleLogout = () => {
    logout(); 
    router.push("/login");
  };

  return (
    <header className="bg-black text-white px-6 py-4 flex justify-between items-center shadow">
      <h1 className="text-3xl font-title font-bold">Grids & Circles</h1>

      <nav className="flex items-center gap-6 text-base">
        {/* 관리자 아닌 경우에만 표시 */}
        {isLoggedIn && user?.role !== "ADMIN" && (
          <>
            <Link href="/order" className="hover:underline">
              주문하기
            </Link>
            <Link href="/mypage" className="hover:underline">
              내 주문 내역
            </Link>
          </>
        )}

        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-white text-black rounded hover:bg-gray-100 transition"
          >
            로그아웃
          </button>
        ) : (
          <button
            onClick={() => router.push("/login")}
            className="px-4 py-2 bg-white text-black rounded hover:bg-gray-100 transition"
          >
            로그인
          </button>
        )}
      </nav>
    </header>
  );
}

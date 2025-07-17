"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function Header() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 페이지가 로드될 때 로그인 상태 확인
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token); // 토큰이 있으면 로그인 상태로 설정
  }, []);

  // 로그아웃 함수
  const handleLogout = () => {
    localStorage.removeItem("accessToken"); // localStorage에서 토큰 삭제
    setIsLoggedIn(false); // 로그인 상태 false로 설정
    toast.success("로그아웃 되었습니다.");
    router.push("/login"); // 로그인 페이지로 이동
  };

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">카페 메뉴 관리 서비스</h1>
      <nav>
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            로그아웃
          </button>
        ) : (
          <button
            onClick={() => router.push("/login")}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            로그인
          </button>
        )}
      </nav>
    </header>
  );
}

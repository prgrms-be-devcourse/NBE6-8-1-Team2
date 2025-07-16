"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/apiFetch";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // 에러 메시지 상태 추가

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return; // 중복 요청 방지
    setErrorMessage(""); // 폼 제출 시 에러 메시지 초기화

    // 이메일 유효성 검사
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(form.email)) {
      setErrorMessage("이메일 형식이 올바르지 않습니다.");
      return;
    }

    // 비밀번호 최소 길이 검증
    if (form.password.length < 6) {
      setErrorMessage("비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await apiFetch<{ token: string }>("/api/login", {
        method: "POST",
        body: JSON.stringify(form),
      });

      localStorage.setItem("accessToken", res.token);
      alert("로그인 성공");
      router.push("/order");
    } catch (err: any) {
      alert(`로그인 실패 : ${err.message}`);
    } finally {
      setIsLoading(false); // 요청 완료 후 로딩 상태 해제
    }
  };

  return (
    <div>
      <h1>로그인</h1>

      {/* 오류 메시지 표시 */}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      <form onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          placeholder="이메일"
          value={form.email}
          onChange={handleChange}
          required
        /><br />
        <input
          name="password"
          type="password"
          placeholder="비밀번호"
          value={form.password}
          onChange={handleChange}
          required
        /><br />
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-gray-500 text-white"
        >
          로그인
        </button>
      </form>
    </div>
  );
}
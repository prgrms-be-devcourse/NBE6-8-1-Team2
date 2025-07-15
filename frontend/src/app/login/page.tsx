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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await apiFetch<{ token: string }>("/api/login", {
        method: "POST",
        body: JSON.stringify(form),
      });

      localStorage.setItem("accessToken", res.token); // 토큰 저장
      alert("로그인 성공");
      router.push("/menus"); // 메뉴 페이지로 이동
    } catch (err: any) {
      alert(`로그인 실패 : ${err.message}`);
    }
  };

  return (
    <div>
      <h1>로그인</h1>
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
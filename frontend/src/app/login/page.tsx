"use client";

import { useState } from "react";
import { useLogin } from "@/hooks/useLogin";
import { LoginForm } from "@/types";

export default function LoginPage() {
  const { login, isLoading, errorMessage } = useLogin();
  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(form);
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
          disabled={isLoading}
        >
          {isLoading ? "로그인 중..." : "로그인"}
        </button>
      </form>
    </div>
  );
}
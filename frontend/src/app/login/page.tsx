"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLogin } from "@/_hooks/useLogin";
import { LoginForm } from "@/types";
import { InputField } from "@/_components/ui/InputField";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/order";
  const { login, isLoading } = useLogin();
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(form, from);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-sm p-8">
        <h1 className="text-2xl font-bold text-center mb-6">LogIn</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <InputField
            name="email"
            type="email"
            placeholder="이메일"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-400 rounded-md px-4 py-3 text-sm"
          />
          <InputField
            name="password"
            type="password"
            placeholder="비밀번호"
            value={form.password}
            onChange={handleChange}
            className="w-full border border-gray-400 rounded-md px-4 py-3 text-sm"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white font-semibold py-2 rounded hover:bg-gray-900 transition mt-2"
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </button>
        </form>
      </div>
    </div>
  );
}

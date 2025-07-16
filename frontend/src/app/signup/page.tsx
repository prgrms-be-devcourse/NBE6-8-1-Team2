"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignup } from "@/hooks/useSignup";
import { SignupForm } from "@/types";

export default function SignupPage() {
  const router = useRouter();
  const { signup, isLoading, errorMessage } = useSignup();

  const [form, setForm] = useState<SignupForm>({
    email: "",
    password: "",
    nickname: "",
    address: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    signup(form);
    if (!isLoading && !errorMessage) {
      router.push("/login"); 
    }
  };

  return (
    <div>
      <h1>회원가입</h1>
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
        <input
          name="nickname"
          placeholder="닉네임"
          value={form.nickname}
          onChange={handleChange}
          required
        /><br />
        <input
          name="address"
          placeholder="주소"
          value={form.address}
          onChange={handleChange}
          required
        /><br />
        <button type="submit" className="mt-4 px-4 py-2 bg-gray-500 text-white" disabled={isLoading}>
          {isLoading ? "회원가입 중..." : "회원가입"}
        </button>
      </form>
    </div>
  );
}
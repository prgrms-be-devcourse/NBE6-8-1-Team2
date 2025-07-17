"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignup } from "@/hooks/useSignup";
import { SignupForm } from "@/types";
import { InputField } from "@/components/ui/InputField";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";

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
    await signup(form);
    if (!isLoading && !errorMessage) router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-sm p-8">
        <h1 className="text-2xl font-bold text-center mb-6">SignUp</h1>
  
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <InputField
            name="email"
            type="email"
            placeholder="이메일"
            value={form.email}
            onChange={handleChange}
          />
          <InputField
            name="password"
            type="password"
            placeholder="비밀번호"
            value={form.password}
            onChange={handleChange}
          />
          <InputField
            name="nickname"
            type="text"
            placeholder="닉네임"
            value={form.nickname}
            onChange={handleChange}
          />
          <InputField
            name="address"
            type="text"
            placeholder="주소"
            value={form.address}
            onChange={handleChange}
          />
  
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white font-semibold py-2 rounded hover:bg-gray-900 transition mt-2"
          >
            {isLoading ? "회원가입 중..." : "회원가입"}
          </button>
  
          <ErrorMessage message={errorMessage} />
        </form>
      </div>
    </div>
  );  
}

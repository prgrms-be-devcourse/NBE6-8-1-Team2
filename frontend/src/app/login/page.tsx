"use client";

import { useState } from "react";
import { useLogin } from "@/hooks/useLogin";
import { LoginForm } from "@/types";
import { InputField } from "@/components/ui/InputField";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";

export default function LoginPage() {
  const { login, isLoading, errorMessage } = useLogin();
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(form);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">로그인</h1>
      <ErrorMessage message={errorMessage} />

      <form onSubmit={handleSubmit}>
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
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "로그인 중..." : "로그인"}
        </Button>
      </form>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/apiFetch";
import { SignupForm } from "@/types";

export default function SignupPage() {
    const router = useRouter();

    const [form, setForm] = useState<SignupForm>({
        email: "",
        password: "",
        nickname: "",
        address: ""
        // role은 backend에서 처리
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
  
      try {
        await apiFetch("/api/signup", {
          method: "POST",
          body: JSON.stringify(form),
        });
  
        alert("회원가입 성공");
        router.push("/login");
      } catch (err: any) {
        alert(`회원가입 실패 : ${err.message}`);
      }
    };
  
    return (
      <div>
        <h1>회원가입</h1>
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
          <button type="submit" className="mt-4 px-4 py-2 bg-gray-500 text-white">회원가입</button>
        </form>
      </div>
    );
  }
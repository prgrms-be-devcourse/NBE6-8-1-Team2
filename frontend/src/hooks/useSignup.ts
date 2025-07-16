import { useState } from "react";
import { apiFetch } from "@/lib/apiFetch";
import { SignupForm } from "@/types";

export function useSignup() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const signup = async (form: SignupForm) => {
    setErrorMessage(""); // 에러 메시지 초기화
    setIsLoading(true); // 로딩 시작

    try {
      await apiFetch("/api/signup", {
        method: "POST",
        body: JSON.stringify(form),
      });

      alert("회원가입 성공");
    } catch (err: any) {
      setErrorMessage(`회원가입 실패: ${err.message}`);
    } finally {
      setIsLoading(false); // 로딩 끝
    }
  };

  return { signup, isLoading, errorMessage };
}
